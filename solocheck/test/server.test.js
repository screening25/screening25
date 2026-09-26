// 서버를 실제로 띄우고 HTTP로 한 바퀴 돈다. 시계는 손으로 돌린다.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

const M = 60_000;

async function boot() {
  let clock = Date.UTC(2026, 8, 26, 0, 0);
  const app = createApp({ adminKey: 'k', now: () => clock });
  await new Promise((r) => app.server.listen(0, r));
  const base = `http://127.0.0.1:${app.server.address().port}`;
  const call = async (method, path, body, headers = {}) => {
    const res = await fetch(base + path, { method, headers: { 'content-type': 'application/json', ...headers }, body: body && JSON.stringify(body) });
    const ct = res.headers.get('content-type') ?? '';
    return { code: res.status, body: ct.includes('json') ? await res.json() : await res.text() };
  };
  return { app, call, advance: (min) => { clock += min * M; }, base };
}

test('작업 시작부터 무응답 보고, 대응, 보고서, 위변조 검증까지', async (t) => {
  const { app, call, advance } = await boot();
  t.after(() => app.close());

  assert.equal((await call('POST', '/api/orgs', { name: 'x' })).code, 403);
  const org = (await call('POST', '/api/orgs', { name: '한빛시설관리' }, { 'x-admin-key': 'k' })).body;
  const m = org.managerUrl.split('/')[2];

  const w = (await call('POST', `/api/m/${m}/workers`, { name: '김작업' })).body;
  const wt = w.url.split('/')[2];

  assert.equal((await call('POST', `/api/w/${wt}/start`, { place: '' })).code, 400);
  const s = (await call('POST', `/api/w/${wt}/start`, { place: 'B2 기계실', intervalMin: 30 })).body;
  assert.equal(s.status, 'ok');
  assert.equal((await call('POST', `/api/w/${wt}/start`, { place: 'B2' })).code, 409);

  advance(31); let fired = await app.tick();
  assert.deepEqual(fired.map((f) => f.type), ['reminded']);
  advance(5); fired = await app.tick();
  assert.deepEqual(fired.map((f) => f.type), ['escalated']);
  assert.deepEqual(await app.tick(), [], '같은 보고를 두 번 보내지 않는다');

  let dash = (await call('GET', `/api/m/${m}`)).body;
  assert.equal(dash.sessions[0].status, 'missed');

  advance(2);
  await call('POST', `/api/m/${m}/ack`, { sessionId: s.id, by: '박반장' });
  dash = (await call('GET', `/api/m/${m}`)).body;
  assert.equal(dash.sessions[0].status, 'missed_ack');

  advance(1);
  assert.equal((await call('POST', `/api/w/${wt}/checkin`, {})).body.status, 'ok');
  advance(1);
  const sos = await call('POST', `/api/w/${wt}/sos`, { note: '어지러움' });
  assert.equal(sos.body.status, 'sos');
  const tl = (await call('GET', `/api/m/${m}/timeline/${s.id}`)).body;
  assert.deepEqual(tl.events.map((e) => e.type), ['started', 'reminded', 'escalated', 'ack', 'checkin', 'sos', 'sos_sent']);

  await call('POST', `/api/w/${wt}/ended`, {});
  assert.equal((await call('GET', `/api/w/${wt}`)).body.session, null);

  const rep = (await call('GET', `/api/m/${m}/report?month=2026-09`)).body;
  assert.equal(rep.summary.missed, 1);
  assert.equal(rep.summary.sos, 1);
  assert.equal(rep.summary.maxResponseMin, 2);
  assert.ok(rep.chain.ok);

  const csv = (await call('GET', `/api/m/${m}/report?month=2026-09&format=csv`)).body;
  assert.match(csv, /무응답 보고/);
  assert.match(csv, /박반장/);

  // 다른 조직의 관리자는 이 작업을 볼 수 없다
  const other = (await call('POST', '/api/orgs', { name: '남' }, { 'x-admin-key': 'k' })).body.managerUrl.split('/')[2];
  assert.equal((await call('GET', `/api/m/${other}/timeline/${s.id}`)).code, 404);
  assert.equal((await call('POST', `/api/m/${other}/ack`, { sessionId: s.id })).code, 404);
});

test('기록은 고치거나 지울 수 없고, DB를 직접 건드리면 검증이 짚는다', async (t) => {
  const { app, call } = await boot();
  t.after(() => app.close());
  const org = (await call('POST', '/api/orgs', { name: 'a' }, { 'x-admin-key': 'k' })).body;
  const m = org.managerUrl.split('/')[2];
  const wt = (await call('POST', `/api/m/${m}/workers`, { name: 'b' })).body.url.split('/')[2];
  await call('POST', `/api/w/${wt}/start`, { place: 'p' });
  await call('POST', `/api/w/${wt}/checkin`, {});

  const db = app.store.db;
  assert.throws(() => db.exec("UPDATE events SET type='checkin' WHERE seq=1"), /append-only/);
  assert.throws(() => db.exec('DELETE FROM events WHERE seq=1'), /append-only/);

  // 트리거를 떼고 몰래 고친 경우
  db.exec('DROP TRIGGER events_no_update');
  db.exec("UPDATE events SET at = at - 600000 WHERE seq=2");
  const v = app.store.verifyChain();
  assert.equal(v.ok, false);
  assert.equal(v.brokenAt, 2);
});

test('페이지와 정적 파일이 뜬다', async (t) => {
  const { app, call } = await boot();
  t.after(() => app.close());
  for (const p of ['/', '/w/abc', '/m/abc', '/sw.js', '/common.js', '/style.css']) {
    assert.equal((await call('GET', p)).code, 200, p);
  }
  assert.equal((await call('GET', '/../package.json')).code, 404);
});
