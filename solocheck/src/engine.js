// 상태 계산기. 저장된 사건만 보고 지금 상태와 해야 할 일을 정한다.
// 울림 메모(alarm-memo)의 Store.state(of:)와 같은 방식이다 — 상태를 저장하지 않고 사건에서 계산한다.
// 그래서 서버가 멈췄다 다시 떠도 놓친 확인·보고가 그대로 드러난다.

const MIN = 60_000;

/**
 * @param {{id:string, startedAt:number, intervalMin:number, graceMin:number}} session
 * @param {{type:string, at:number, data?:object}[]} events  이 작업의 사건, 시각 순
 * @param {number} now
 */
export function sessionState(session, events, now) {
  const interval = session.intervalMin * MIN;
  const grace = session.graceMin * MIN;

  let lastOk = session.startedAt;
  let endedAt = null;
  let sosAt = null;
  let sosAckAt = null;
  const done = new Set(); // 이미 한 일(중복 방지 열쇠)
  let lastAck = null;

  for (const e of events) {
    switch (e.type) {
      case 'checkin':
        lastOk = Math.max(lastOk, e.at);
        sosAt = null; // 본인이 괜찮다고 눌렀으면 긴급 상황은 끝난 것으로 본다
        sosAckAt = null;
        break;
      case 'sos':
        sosAt = e.at;
        sosAckAt = null;
        break;
      case 'ack':
        lastAck = e;
        if (sosAt && e.at >= sosAt) sosAckAt = e.at;
        break;
      case 'ended':
        endedAt = e.at;
        break;
      case 'reminded':
      case 'escalated':
      case 'sos_sent':
        done.add(e.data?.key);
        break;
    }
  }

  if (endedAt !== null) {
    return { status: 'ended', lastOk, dueAt: null, overdueMin: 0, actions: [] };
  }

  const dueAt = lastOk + interval;
  const actions = [];
  let status;

  if (sosAt !== null) {
    status = sosAckAt ? 'sos_ack' : 'sos';
    const key = `sos:${sosAt}`;
    if (!done.has(key)) actions.push({ type: 'sos_sent', to: 'managers', key });
  } else if (now < dueAt) {
    status = 'ok';
  } else if (now < dueAt + grace) {
    status = 'due';
    const key = `remind:${dueAt}`;
    if (!done.has(key)) actions.push({ type: 'reminded', to: 'worker', key });
  } else {
    // 확인을 놓쳤다. 관리자 확인(ack)이 이 기한 뒤에 있으면 대응 중으로 본다.
    const acked = lastAck && lastAck.at >= dueAt + grace;
    status = acked ? 'missed_ack' : 'missed';
    const remindKey = `remind:${dueAt}`;
    if (!done.has(remindKey)) actions.push({ type: 'reminded', to: 'worker', key: remindKey });
    const escKey = `escalate:${dueAt}`;
    if (!done.has(escKey)) actions.push({ type: 'escalated', to: 'managers', key: escKey });
  }

  return {
    status,
    lastOk,
    dueAt,
    overdueMin: now > dueAt ? Math.floor((now - dueAt) / MIN) : 0,
    actions,
  };
}

/** 한 달 보고서용 요약. 같은 사건에서 다시 계산하므로 저장된 숫자와 어긋날 일이 없다. */
export function summarize(sessionsWithEvents) {
  const out = { sessions: 0, checkins: 0, missed: 0, sos: 0, maxResponseMin: null, workMinutes: 0 };
  for (const { session, events } of sessionsWithEvents) {
    out.sessions += 1;
    let end = session.startedAt;
    const escalations = [];
    for (const e of events) {
      end = Math.max(end, e.at);
      if (e.type === 'checkin') out.checkins += 1;
      if (e.type === 'escalated') { out.missed += 1; escalations.push(e.at); }
      if (e.type === 'sos') { out.sos += 1; escalations.push(e.at); }
      if (e.type === 'ack' && escalations.length) {
        const from = escalations.shift();
        const min = Math.round((e.at - from) / MIN);
        out.maxResponseMin = Math.max(out.maxResponseMin ?? 0, min);
      }
    }
    out.workMinutes += Math.round((end - session.startedAt) / MIN);
  }
  return out;
}
