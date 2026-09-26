// 저장소. 사건은 덮어쓰거나 지우지 않고 쌓기만 한다.
// 줄마다 앞 줄의 해시를 물고 있어서, 누가 중간 줄을 고치거나 지우면 verifyChain()이 그 자리를 짚는다.
// 사고가 난 뒤 "확인 절차를 실제로 지켰다"는 증빙으로 쓰려면 이 성질이 필요하다.
import { DatabaseSync } from 'node:sqlite';
import { createHash, randomBytes } from 'node:crypto';

export const token = () => randomBytes(18).toString('base64url');
const sha = (s) => createHash('sha256').update(s).digest('hex');
const GENESIS = '0'.repeat(64);

export function open(path = ':memory:') {
  const db = new DatabaseSync(path);
  db.exec(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS orgs (
      id TEXT PRIMARY KEY, name TEXT NOT NULL, manager_token TEXT UNIQUE NOT NULL, created_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS workers (
      id TEXT PRIMARY KEY, org_id TEXT NOT NULL, name TEXT NOT NULL, token TEXT UNIQUE NOT NULL,
      created_at INTEGER NOT NULL, active INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY, org_id TEXT NOT NULL, worker_id TEXT NOT NULL, place TEXT NOT NULL,
      interval_min INTEGER NOT NULL, grace_min INTEGER NOT NULL, started_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS events (
      seq INTEGER PRIMARY KEY AUTOINCREMENT, org_id TEXT NOT NULL, session_id TEXT, type TEXT NOT NULL,
      at INTEGER NOT NULL, data TEXT NOT NULL, prev_hash TEXT NOT NULL, hash TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS events_session ON events(session_id, seq);
    CREATE TABLE IF NOT EXISTS push_subs (
      endpoint TEXT PRIMARY KEY, org_id TEXT NOT NULL, role TEXT NOT NULL, owner_id TEXT NOT NULL, sub TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS kv (k TEXT PRIMARY KEY, v TEXT NOT NULL);
    CREATE TRIGGER IF NOT EXISTS events_no_update BEFORE UPDATE ON events BEGIN SELECT RAISE(ABORT, 'events are append-only'); END;
    CREATE TRIGGER IF NOT EXISTS events_no_delete BEFORE DELETE ON events BEGIN SELECT RAISE(ABORT, 'events are append-only'); END;
  `);
  return new Store(db);
}

class Store {
  constructor(db) { this.db = db; }

  kvGet(k) { return this.db.prepare('SELECT v FROM kv WHERE k=?').get(k)?.v ?? null; }
  kvSet(k, v) { this.db.prepare('INSERT INTO kv(k,v) VALUES(?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').run(k, v); }

  createOrg(name, now = Date.now()) {
    const org = { id: token(), name, manager_token: token(), created_at: now };
    this.db.prepare('INSERT INTO orgs VALUES(?,?,?,?)').run(org.id, org.name, org.manager_token, org.created_at);
    return org;
  }
  orgByManagerToken(t) { return this.db.prepare('SELECT * FROM orgs WHERE manager_token=?').get(t) ?? null; }
  org(id) { return this.db.prepare('SELECT * FROM orgs WHERE id=?').get(id) ?? null; }

  addWorker(orgId, name, now = Date.now()) {
    const w = { id: token(), org_id: orgId, name, token: token(), created_at: now, active: 1 };
    this.db.prepare('INSERT INTO workers(id,org_id,name,token,created_at) VALUES(?,?,?,?,?)')
      .run(w.id, w.org_id, w.name, w.token, w.created_at);
    return w;
  }
  workerByToken(t) { return this.db.prepare('SELECT * FROM workers WHERE token=? AND active=1').get(t) ?? null; }
  workers(orgId) { return this.db.prepare('SELECT * FROM workers WHERE org_id=? AND active=1 ORDER BY created_at').all(orgId); }
  worker(id) { return this.db.prepare('SELECT * FROM workers WHERE id=?').get(id) ?? null; }

  startSession(worker, { place, intervalMin, graceMin }, now = Date.now()) {
    const s = { id: token(), org_id: worker.org_id, worker_id: worker.id, place, interval_min: intervalMin, grace_min: graceMin, started_at: now };
    this.db.prepare('INSERT INTO sessions VALUES(?,?,?,?,?,?,?)')
      .run(s.id, s.org_id, s.worker_id, s.place, s.interval_min, s.grace_min, s.started_at);
    this.append(s.org_id, s.id, 'started', now, { place, intervalMin, graceMin, worker: worker.name });
    return s;
  }
  session(id) { return this.db.prepare('SELECT * FROM sessions WHERE id=?').get(id) ?? null; }

  /** 끝나지 않은 작업 전부(조직 하나 또는 전체). */
  openSessions(orgId = null) {
    const sql = `SELECT s.* FROM sessions s WHERE ${orgId ? 's.org_id=? AND' : ''}
      NOT EXISTS (SELECT 1 FROM events e WHERE e.session_id=s.id AND e.type='ended') ORDER BY s.started_at`;
    return orgId ? this.db.prepare(sql).all(orgId) : this.db.prepare(sql).all();
  }
  openSessionOf(workerId) {
    return this.db.prepare(`SELECT s.* FROM sessions s WHERE s.worker_id=? AND
      NOT EXISTS (SELECT 1 FROM events e WHERE e.session_id=s.id AND e.type='ended') ORDER BY s.started_at DESC LIMIT 1`).get(workerId) ?? null;
  }
  sessionsBetween(orgId, from, to) {
    return this.db.prepare('SELECT * FROM sessions WHERE org_id=? AND started_at>=? AND started_at<? ORDER BY started_at').all(orgId, from, to);
  }

  append(orgId, sessionId, type, at, data = {}) {
    const prev = this.db.prepare('SELECT hash FROM events ORDER BY seq DESC LIMIT 1').get()?.hash ?? GENESIS;
    const body = JSON.stringify({ orgId, sessionId, type, at, data });
    const hash = sha(prev + body);
    this.db.prepare('INSERT INTO events(org_id,session_id,type,at,data,prev_hash,hash) VALUES(?,?,?,?,?,?,?)')
      .run(orgId, sessionId, type, at, JSON.stringify(data), prev, hash);
    return { type, at, data, hash };
  }
  events(sessionId) {
    return this.db.prepare('SELECT * FROM events WHERE session_id=? ORDER BY seq').all(sessionId)
      .map((r) => ({ ...r, data: JSON.parse(r.data) }));
  }
  orgEvents(orgId, from, to) {
    return this.db.prepare('SELECT * FROM events WHERE org_id=? AND at>=? AND at<? ORDER BY seq').all(orgId, from, to)
      .map((r) => ({ ...r, data: JSON.parse(r.data) }));
  }

  /** 사슬 전체를 처음부터 다시 계산한다. 어긋난 첫 줄 번호를 돌려준다(없으면 null). */
  verifyChain() {
    let prev = GENESIS;
    for (const r of this.db.prepare('SELECT * FROM events ORDER BY seq').iterate()) {
      const body = JSON.stringify({ orgId: r.org_id, sessionId: r.session_id, type: r.type, at: r.at, data: JSON.parse(r.data) });
      if (r.prev_hash !== prev || sha(prev + body) !== r.hash) return { ok: false, brokenAt: r.seq };
      prev = r.hash;
    }
    return { ok: true, head: prev };
  }

  saveSub(orgId, role, ownerId, sub) {
    this.db.prepare('INSERT INTO push_subs VALUES(?,?,?,?,?) ON CONFLICT(endpoint) DO UPDATE SET org_id=excluded.org_id, role=excluded.role, owner_id=excluded.owner_id, sub=excluded.sub')
      .run(sub.endpoint, orgId, role, ownerId, JSON.stringify(sub));
  }
  subs(orgId, role, ownerId = null) {
    const rows = ownerId
      ? this.db.prepare('SELECT * FROM push_subs WHERE org_id=? AND role=? AND owner_id=?').all(orgId, role, ownerId)
      : this.db.prepare('SELECT * FROM push_subs WHERE org_id=? AND role=?').all(orgId, role);
    return rows.map((r) => JSON.parse(r.sub));
  }
  dropSub(endpoint) { this.db.prepare('DELETE FROM push_subs WHERE endpoint=?').run(endpoint); }
}
