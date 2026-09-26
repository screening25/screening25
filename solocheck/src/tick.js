// 주기적으로 모든 진행 중 작업을 계산해 알림을 보낸다.
// 보낸 사실도 사건으로 남긴다. 그래서 "관리자에게 몇 시 몇 분에 알렸다"가 기록으로 증명된다.
import { sessionState } from './engine.js';

const LABEL = {
  reminded: (w, s) => ({ title: '안부 확인 시간입니다', body: `${s.place} · 「괜찮음」을 눌러 주세요` }),
  escalated: (w, s, st) => ({ title: `⚠ ${w.name} 응답 없음`, body: `${s.place} · 확인 기한을 ${st.overdueMin}분 넘겼습니다` }),
  sos_sent: (w, s) => ({ title: `🚨 ${w.name} 긴급 호출`, body: `${s.place}` }),
};

/**
 * @param {import('./db.js').Store} store
 * @param {(target:{orgId:string, role:'worker'|'manager', ownerId?:string}, msg:object) => Promise<number>} send  보낸 기기 수를 돌려준다
 */
export async function tick(store, send, now = Date.now()) {
  const fired = [];
  for (const s of store.openSessions()) {
    const events = store.events(s.id);
    const st = sessionState(
      { id: s.id, startedAt: s.started_at, intervalMin: s.interval_min, graceMin: s.grace_min },
      events, now);
    const w = store.worker(s.worker_id);
    for (const a of st.actions) {
      const msg = { ...LABEL[a.type](w, s, st), url: a.to === 'worker' ? `/w/${w.token}` : null, tag: a.key };
      const target = a.to === 'worker'
        ? { orgId: s.org_id, role: 'worker', ownerId: w.id }
        : { orgId: s.org_id, role: 'manager' };
      let delivered = 0;
      try { delivered = await send(target, msg); } catch (err) { console.error('send failed', err); }
      store.append(s.org_id, s.id, a.type, now, { key: a.key, delivered });
      fired.push({ session: s.id, ...a, delivered });
    }
  }
  return fired;
}
