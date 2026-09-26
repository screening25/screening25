// HTTP 서버. 외부 프레임워크 없이 node:http 하나로 둔다(부품을 줄인다 — 울림 메모와 같은 원칙).
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { open } from './db.js';
import { sessionState, summarize } from './engine.js';
import { tick } from './tick.js';
import { makeSender } from './push.js';

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PUBLIC = path.join(ROOT, '..', 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml' };

const clampInt = (v, lo, hi, d) => { const n = Number.parseInt(v, 10); return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : d; };
const text = (v, max) => String(v ?? '').trim().slice(0, max);

export function createApp({ dbPath = ':memory:', adminKey = process.env.ADMIN_KEY, now = () => Date.now() } = {}) {
  const store = open(dbPath);
  const push = makeSender(store);

  const send = async (target, msg) => {
    if (target.role === 'manager') msg = { ...msg, url: `/m/${store.org(target.orgId).manager_token}` };
    return push(store.subs(target.orgId, target.role, target.ownerId ?? null), msg);
  };

  const view = (s) => {
    const st = sessionState({ id: s.id, startedAt: s.started_at, intervalMin: s.interval_min, graceMin: s.grace_min }, store.events(s.id), now());
    const w = store.worker(s.worker_id);
    return { id: s.id, worker: w.name, workerId: w.id, place: s.place, intervalMin: s.interval_min, graceMin: s.grace_min,
      startedAt: s.started_at, status: st.status, lastOk: st.lastOk, dueAt: st.dueAt, overdueMin: st.overdueMin };
  };

  const routes = [
    // ── 운영자: 고객 조직 만들기(파일럿 계약 뒤 운영자가 직접 연다)
    ['POST', /^\/api\/orgs$/, async (req, body) => {
      if (!adminKey || req.headers['x-admin-key'] !== adminKey) return [403, { error: 'forbidden' }];
      const name = text(body.name, 60);
      if (!name) return [400, { error: 'name required' }];
      const org = store.createOrg(name, now());
      return [201, { orgId: org.id, managerUrl: `/m/${org.manager_token}` }];
    }],
    ['GET', /^\/api\/vapid$/, async () => [200, { publicKey: store.kvGet('vapid_public') }]],
    ['GET', /^\/api\/info$/, async () => [200, { contact: process.env.CONTACT ?? null }]],

    // ── 관리자
    ['GET', /^\/api\/m\/([\w-]+)$/, async (req, body, [t]) => {
      const org = store.orgByManagerToken(t); if (!org) return [404, { error: 'not found' }];
      return [200, {
        org: { name: org.name },
        workers: store.workers(org.id).map((w) => ({ id: w.id, name: w.name, url: `/w/${w.token}` })),
        sessions: store.openSessions(org.id).map(view),
        chain: store.verifyChain(),
      }];
    }],
    ['POST', /^\/api\/m\/([\w-]+)\/workers$/, async (req, body, [t]) => {
      const org = store.orgByManagerToken(t); if (!org) return [404, { error: 'not found' }];
      const name = text(body.name, 40); if (!name) return [400, { error: 'name required' }];
      if (store.workers(org.id).length >= 200) return [400, { error: 'too many workers' }];
      const w = store.addWorker(org.id, name, now());
      return [201, { id: w.id, name: w.name, url: `/w/${w.token}` }];
    }],
    ['POST', /^\/api\/m\/([\w-]+)\/ack$/, async (req, body, [t]) => {
      const org = store.orgByManagerToken(t); if (!org) return [404, { error: 'not found' }];
      const s = store.session(text(body.sessionId, 64));
      if (!s || s.org_id !== org.id) return [404, { error: 'no session' }];
      store.append(org.id, s.id, 'ack', now(), { by: text(body.by, 40) || '관리자', note: text(body.note, 200) });
      return [200, view(s)];
    }],
    ['GET', /^\/api\/m\/([\w-]+)\/timeline\/([\w-]+)$/, async (req, body, [t, sid]) => {
      const org = store.orgByManagerToken(t); if (!org) return [404, { error: 'not found' }];
      const s = store.session(sid); if (!s || s.org_id !== org.id) return [404, { error: 'no session' }];
      return [200, { session: view(s), events: store.events(s.id).map(({ type, at, data, hash }) => ({ type, at, data, hash })) }];
    }],
    ['GET', /^\/api\/m\/([\w-]+)\/report$/, async (req, body, [t], url) => {
      const org = store.orgByManagerToken(t); if (!org) return [404, { error: 'not found' }];
      const month = /^\d{4}-\d{2}$/.test(url.searchParams.get('month') ?? '') ? url.searchParams.get('month') : kstMonth(now());
      const [from, to] = monthRange(month);
      const sessions = store.sessionsBetween(org.id, from, to);
      const rows = sessions.map((s) => ({ session: { startedAt: s.started_at }, events: store.events(s.id) }));
      const csv = reportCsv(org, month, sessions, store);
      if (url.searchParams.get('format') === 'csv') {
        return [200, csv, { 'content-type': 'text/csv; charset=utf-8', 'content-disposition': `attachment; filename="solocheck-${month}.csv"` }];
      }
      return [200, { month, summary: summarize(rows), chain: store.verifyChain() }];
    }],
    ['POST', /^\/api\/m\/([\w-]+)\/push$/, async (req, body, [t]) => {
      const org = store.orgByManagerToken(t); if (!org) return [404, { error: 'not found' }];
      if (!body?.endpoint) return [400, { error: 'bad subscription' }];
      store.saveSub(org.id, 'manager', org.id, body);
      return [200, { ok: true }];
    }],

    // ── 작업자
    ['GET', /^\/api\/w\/([\w-]+)$/, async (req, body, [t]) => {
      const w = store.workerByToken(t); if (!w) return [404, { error: 'not found' }];
      const s = store.openSessionOf(w.id);
      return [200, { name: w.name, org: store.org(w.org_id).name, session: s ? view(s) : null }];
    }],
    ['POST', /^\/api\/w\/([\w-]+)\/start$/, async (req, body, [t]) => {
      const w = store.workerByToken(t); if (!w) return [404, { error: 'not found' }];
      if (store.openSessionOf(w.id)) return [409, { error: 'already working' }];
      const place = text(body.place, 80); if (!place) return [400, { error: 'place required' }];
      const s = store.startSession(w, { place, intervalMin: clampInt(body.intervalMin, 5, 240, 30), graceMin: clampInt(body.graceMin, 1, 30, 5) }, now());
      return [201, view(s)];
    }],
    ...['checkin', 'sos', 'ended'].map((type) => ['POST', new RegExp(`^/api/w/([\\w-]+)/${type}$`), async (req, body, [t]) => {
      const w = store.workerByToken(t); if (!w) return [404, { error: 'not found' }];
      const s = store.openSessionOf(w.id); if (!s) return [409, { error: 'not working' }];
      store.append(w.org_id, s.id, type, now(), type === 'sos' ? { note: text(body.note, 200) } : {});
      if (type === 'sos') await tick(store, send, now()); // 긴급은 다음 주기를 기다리지 않는다
      return [200, type === 'ended' ? { ended: true } : view(s)];
    }]),
    ['POST', /^\/api\/w\/([\w-]+)\/push$/, async (req, body, [t]) => {
      const w = store.workerByToken(t); if (!w) return [404, { error: 'not found' }];
      if (!body?.endpoint) return [400, { error: 'bad subscription' }];
      store.saveSub(w.org_id, 'worker', w.id, body);
      return [200, { ok: true }];
    }],
  ];

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://x');
    try {
      if (req.method === 'GET' && !url.pathname.startsWith('/api/')) return serveStatic(url.pathname, res);
      for (const [m, re, fn] of routes) {
        const hit = req.method === m && url.pathname.match(re);
        if (!hit) continue;
        const body = m === 'POST' ? await readJson(req) : null;
        const [code, out, headers] = await fn(req, body, hit.slice(1), url);
        if (typeof out === 'string') { res.writeHead(code, headers); return res.end(out); }
        res.writeHead(code, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
        return res.end(JSON.stringify(out));
      }
      res.writeHead(404).end();
    } catch (err) {
      console.error(err);
      res.writeHead(err.status ?? 500, { 'content-type': 'application/json' }).end(JSON.stringify({ error: err.status ? err.message : 'server error' }));
    }
  });

  let timer = null;
  return {
    store, server, send,
    tick: () => tick(store, send, now()),
    listen(port) {
      timer = setInterval(() => tick(store, send, now()).catch(console.error), 15_000);
      return new Promise((r) => server.listen(port, r));
    },
    close() { clearInterval(timer); server.close(); },
  };
}

async function serveStatic(p, res) {
  const file = p === '/' ? 'index.html' : p.startsWith('/m/') ? 'manager.html' : p.startsWith('/w/') ? 'worker.html' : p.slice(1);
  if (file.includes('..') || file.includes('/')) return res.writeHead(404).end();
  try {
    const data = await readFile(path.join(PUBLIC, file));
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer' });
    res.end(data);
  } catch { res.writeHead(404).end(); }
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => { raw += c; if (raw.length > 20_000) { req.destroy(); reject(Object.assign(new Error('too large'), { status: 413 })); } });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(Object.assign(new Error('bad json'), { status: 400 })); } });
  });
}

const KST = 9 * 3600_000;
export const kstMonth = (t) => new Date(t + KST).toISOString().slice(0, 7);
export function monthRange(month) {
  const [y, m] = month.split('-').map(Number);
  return [Date.UTC(y, m - 1, 1) - KST, Date.UTC(y, m, 1) - KST];
}
const kst = (t) => new Date(t + KST).toISOString().slice(0, 19).replace('T', ' ');
const TYPE_KO = { started: '작업 시작', checkin: '괜찮음', reminded: '확인 요청', escalated: '무응답 보고', sos: '긴급 호출', sos_sent: '긴급 전달', ack: '관리자 확인', ended: '작업 끝' };

function reportCsv(org, month, sessions, store) {
  const q = (v) => `"${String(v).replaceAll('"', '""')}"`;
  const lines = [['시각(KST)', '작업자', '장소', '사건', '내용', '해시'].map(q).join(',')];
  for (const s of sessions) {
    const w = store.worker(s.worker_id);
    for (const e of store.events(s.id)) {
      const detail = e.type === 'ack' ? `${e.data.by} ${e.data.note ?? ''}` : e.data.delivered !== undefined ? `전달 기기 ${e.data.delivered}대` : '';
      lines.push([kst(e.at), w.name, s.place, TYPE_KO[e.type] ?? e.type, detail.trim(), e.hash].map(q).join(','));
    }
  }
  return '﻿' + lines.join('\r\n') + '\r\n';
}
