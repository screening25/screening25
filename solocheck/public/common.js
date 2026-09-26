export const $ = (s) => document.querySelector(s);
export const token = location.pathname.split('/')[2];

export async function api(path, body) {
  const res = await fetch(path, body === undefined ? {} : { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
  const out = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(out.error ?? res.status);
  return out;
}

export const STATUS = { ok: '정상', due: '확인 요청 중', missed: '응답 없음', missed_ack: '응답 없음 · 대응 중', sos: '긴급 호출', sos_ack: '긴급 · 대응 중', ended: '끝남' };
export const hm = (t) => new Date(t).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
export const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// 페이지가 열려 있을 때 쓰는 소리·진동. 푸시가 막힌 기기에서도 화면을 켜 두면 울린다.
let ctx;
export function beep(times = 3) {
  try {
    ctx ??= new AudioContext();
    for (let i = 0; i < times; i++) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = 880; o.connect(g); g.connect(ctx.destination);
      const t = ctx.currentTime + i * 0.5; g.gain.setValueAtTime(0.3, t); g.gain.setValueAtTime(0, t + 0.3);
      o.start(t); o.stop(t + 0.3);
    }
  } catch {}
  navigator.vibrate?.([400, 200, 400, 200, 400]);
}

export async function enablePush(endpoint) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) throw new Error('이 브라우저는 푸시를 받을 수 없습니다. 홈 화면에 추가한 뒤 다시 시도해 주세요.');
  const reg = await navigator.serviceWorker.register('/sw.js');
  if ((await Notification.requestPermission()) !== 'granted') throw new Error('알림 권한이 꺼져 있습니다.');
  const { publicKey } = await api('/api/vapid');
  const key = Uint8Array.from(atob(publicKey.replace(/-/g, '+').replace(/_/g, '/')), (c) => c.charCodeAt(0));
  const sub = (await reg.pushManager.getSubscription()) ?? (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: key }));
  await api(endpoint, sub.toJSON());
}
