# 솔로체크

단독작업자에게 정한 간격마다 안부 확인을 보낸다.
응답이 없으면 관리자에게 알리고, 모든 사건을 고칠 수 없는 기록으로 남긴다.

울림 메모(alarm-memo)의 "울리고, 확인받고, 사건을 쌓는다" 구조를 업무용으로 옮긴 것이다.

- 사업 분석: [docs/BUSINESS.md](docs/BUSINESS.md)
- 판매 자료: [docs/SALES.md](docs/SALES.md)
- 실행 기록과 매출: [docs/LEDGER.md](docs/LEDGER.md) (현재 매출 0원)

## 실행

Node 22.13 이상이 필요하다.

```
npm install
npm test                 # 시험 13개
npm run demo             # 가상 데이터로 시연 서버, 주소를 출력한다
ADMIN_KEY=... CONTACT=... npm start
```

고객 조직은 운영자가 입금 확인 뒤에 만든다.

```
curl -X POST localhost:8080/api/orgs -H 'x-admin-key: ...' -H 'content-type: application/json' -d '{"name":"회사명"}'
```

돌려받은 `managerUrl`을 고객에게 보낸다. 작업자는 관리자 화면에서 추가하고 링크를 보낸다.

## 구조

| 파일 | 하는 일 |
|---|---|
| src/engine.js | 사건만 보고 상태와 할 일을 계산한다. 서버가 멈췄다 떠도 놓친 보고를 낸다 |
| src/db.js | SQLite. 사건 테이블은 트리거로 수정·삭제를 막고, 줄마다 앞 줄 해시를 문다 |
| src/tick.js | 15초마다 진행 중인 작업을 계산해 푸시를 보내고, 보낸 사실도 기록한다 |
| src/server.js | HTTP API와 정적 파일. 링크 토큰으로만 접근한다 |
| public/ | 작업자·관리자 화면(설치 없는 웹앱), 서비스 워커 |

## 운영 전에 할 일

- HTTPS 뒤에 둔다. 링크 토큰이 곧 접근 권한이라 평문 HTTP로 쓰면 안 된다.
- `VAPID_SUBJECT`에 운영자 메일을 넣는다.
- DB 파일(`DB_PATH`)을 매일 백업한다.
- 갤럭시 2대와 아이폰 1대로 2주 동안 알림이 실제로 오는지 검증한다.
