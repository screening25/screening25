import test from 'node:test';
import assert from 'node:assert/strict';
import { sessionState, summarize } from '../src/engine.js';

const M = 60_000;
const S = { id: 's', startedAt: 0, intervalMin: 30, graceMin: 5 };

test('기한 전에는 정상이고 할 일이 없다', () => {
  const st = sessionState(S, [], 29 * M);
  assert.equal(st.status, 'ok');
  assert.deepEqual(st.actions, []);
  assert.equal(st.dueAt, 30 * M);
});

test('기한이 되면 작업자에게 한 번만 확인 요청을 보낸다', () => {
  const st = sessionState(S, [], 31 * M);
  assert.equal(st.status, 'due');
  assert.deepEqual(st.actions.map((a) => a.type), ['reminded']);
  const after = sessionState(S, [{ type: 'reminded', at: 31 * M, data: { key: st.actions[0].key } }], 32 * M);
  assert.deepEqual(after.actions, []);
});

test('유예를 넘기면 관리자에게 보고한다(한 번만)', () => {
  const ev = [{ type: 'reminded', at: 30 * M, data: { key: `remind:${30 * M}` } }];
  const st = sessionState(S, ev, 36 * M);
  assert.equal(st.status, 'missed');
  assert.deepEqual(st.actions.map((a) => a.type), ['escalated']);
  ev.push({ type: 'escalated', at: 36 * M, data: { key: st.actions[0].key } });
  assert.deepEqual(sessionState(S, ev, 50 * M).actions, []);
});

test('서버가 기한 내내 꺼져 있었어도 켜지면 요청과 보고를 모두 낸다', () => {
  const st = sessionState(S, [], 90 * M);
  assert.equal(st.status, 'missed');
  assert.deepEqual(st.actions.map((a) => a.type), ['reminded', 'escalated']);
});

test('안부를 보내면 다음 기한이 그 시각부터 다시 잡힌다', () => {
  const st = sessionState(S, [{ type: 'checkin', at: 20 * M }], 45 * M);
  assert.equal(st.status, 'ok');
  assert.equal(st.dueAt, 50 * M);
});

test('관리자가 대응을 기록하면 무응답이 대응 중으로 바뀐다', () => {
  const st = sessionState(S, [{ type: 'ack', at: 40 * M, data: {} }], 41 * M);
  assert.equal(st.status, 'missed_ack');
});

test('대응 기록이 이전 기한 것이면 새 무응답을 가리지 않는다', () => {
  const ev = [{ type: 'ack', at: 40 * M, data: {} }, { type: 'checkin', at: 42 * M }];
  const st = sessionState(S, ev, 42 * M + 36 * M);
  assert.equal(st.status, 'missed');
});

test('긴급 호출은 기한과 상관없이 즉시 관리자에게 가고, 대응 기록 전까지 남는다', () => {
  const ev = [{ type: 'sos', at: 5 * M }];
  const st = sessionState(S, ev, 5 * M);
  assert.equal(st.status, 'sos');
  assert.deepEqual(st.actions.map((a) => a.type), ['sos_sent']);
  ev.push({ type: 'sos_sent', at: 5 * M, data: { key: st.actions[0].key } }, { type: 'ack', at: 7 * M, data: {} });
  assert.equal(sessionState(S, ev, 8 * M).status, 'sos_ack');
});

test('작업이 끝나면 아무것도 보내지 않는다', () => {
  const st = sessionState(S, [{ type: 'ended', at: 10 * M }], 500 * M);
  assert.equal(st.status, 'ended');
  assert.deepEqual(st.actions, []);
});

test('월간 요약은 사건에서 다시 센다', () => {
  const s = summarize([{ session: { startedAt: 0 }, events: [
    { type: 'checkin', at: 30 * M }, { type: 'escalated', at: 66 * M }, { type: 'ack', at: 70 * M }, { type: 'ended', at: 120 * M },
  ] }]);
  assert.deepEqual(s, { sessions: 1, checkins: 1, missed: 1, sos: 0, maxResponseMin: 4, workMinutes: 120 });
});
