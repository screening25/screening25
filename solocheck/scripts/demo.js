// 영업 시연용. 데모 조직 하나와 작업자 셋을 만들고, 한 사람은 무응답 상태로 둔다.
// 만든 데이터는 전부 데모다. 실제 고객 기록이 아니다.
import { createApp } from '../src/server.js';

const M = 60_000;
const t0 = Date.now();
const app = createApp({ dbPath: process.env.DB_PATH ?? ':memory:' });
const { store } = app;
const org = store.createOrg('데모 시설관리(가상)');
const [a, b, c] = ['김민수', '이정호', '박서연'].map((n) => store.addWorker(org.id, n));

const s1 = store.startSession(a, { place: 'B2 기계실', intervalMin: 30, graceMin: 5 }, t0 - 50 * M);
store.append(org.id, s1.id, 'checkin', t0 - 22 * M);
const s2 = store.startSession(b, { place: '옥상 냉각탑', intervalMin: 30, graceMin: 5 }, t0 - 40 * M); // 기한을 넘겨 무응답이 된다
const s3 = store.startSession(c, { place: '전기실 점검', intervalMin: 60, graceMin: 5 }, t0 - 10 * M);
await app.tick();

const port = Number(process.env.PORT ?? 8080);
await app.listen(port);
console.log(`관리자: http://localhost:${port}/m/${org.manager_token}`);
for (const w of [a, b, c]) console.log(`작업자 ${w.name}: http://localhost:${port}/w/${w.token}`);
