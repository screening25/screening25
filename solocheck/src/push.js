// 웹 푸시. 문자·알림톡과 달리 건당 비용이 없다.
// VAPID 키는 처음 뜰 때 만들어 저장소에 넣고 계속 쓴다(바꾸면 기존 구독이 모두 끊긴다).
import webpush from 'web-push';

export function makeSender(store) {
  let pub = store.kvGet('vapid_public');
  let priv = store.kvGet('vapid_private');
  if (!pub || !priv) {
    const k = webpush.generateVAPIDKeys();
    pub = k.publicKey; priv = k.privateKey;
    store.kvSet('vapid_public', pub); store.kvSet('vapid_private', priv);
  }
  webpush.setVapidDetails(process.env.VAPID_SUBJECT ?? 'mailto:ops@example.invalid', pub, priv);

  return async function send(subs, msg) {
    let ok = 0;
    await Promise.all(subs.map(async (sub) => {
      try {
        await webpush.sendNotification(sub, JSON.stringify(msg), { TTL: 600, urgency: 'high' });
        ok += 1;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) store.dropSub(sub.endpoint); // 기기가 구독을 버렸다
        else console.error('push error', err.statusCode ?? err.message);
      }
    }));
    return ok;
  };
}
