"""후보 A 검증 — 공공 소액수의 SW 용역의 실제 경쟁 강도를 개찰 결과로 잰다.

맥에서 돌린다(클라우드는 공공데이터포털이 막혀 있다).
필요한 것: 공공데이터포털 「조달청_나라장터 낙찰정보서비스」 활용신청 후 받은 서비스키.
  https://www.data.go.kr/data/15129397/openapi.do

    export G2B_KEY='...'
    python3 profit/g2b_competition.py --days 60 --max 2000

주의: 작업 명(operation)과 응답 필드 이름은 이 클라우드에서 원문을 확인하지 못해 알려진 명세대로 적었다.
처음 실행하면 --dump로 응답 첫 건의 키를 출력해 필드 이름이 맞는지 먼저 본다.
필드 이름이 다르면 FIELDS만 고치면 된다.

출력: 건별 CSV와 요약(참가 업체 수 분포, 기초금액 분포, 낙찰률 분포, 1건 낙찰 확률의 근사).
"""
import argparse
import csv
import datetime as dt
import json
import os
import statistics
import sys
import urllib.parse
import urllib.request

BASE = "https://apis.data.go.kr/1230000/as/ScsbidInfoService"
OP = "getOpengResultListInfoServc"          # 용역 개찰결과 목록 (확인 필요)
FIELDS = {                                   # 응답 필드 (확인 필요)
    "no": "bidNtceNo", "name": "bidNtceNm", "org": "ntceInsttNm", "date": "opengDt",
    "bidders": "prtcptCnum", "winner": "opengCorpInfo",
}
SW_WORDS = ("홈페이지", "유지관리", "유지보수", "시스템", "소프트웨어", "앱", "웹", "플랫폼", "정보화", "전산")


def fetch(key, start, end, page, rows=100):
    q = {"serviceKey": key, "pageNo": page, "numOfRows": rows, "type": "json", "inqryDiv": 1,
         "inqryBgnDt": start.strftime("%Y%m%d0000"), "inqryEndDt": end.strftime("%Y%m%d2359")}
    url = f"{BASE}/{OP}?{urllib.parse.urlencode(q, safe='%')}"
    with urllib.request.urlopen(url, timeout=30) as r:
        body = json.load(r)["response"]["body"]
    items = body.get("items") or []
    return items if isinstance(items, list) else items.get("item", []), int(body.get("totalCount", 0))


def winner_amount_rate(info: str):
    # 알려진 형식: 업체명^사업자번호^대표자^투찰금액^투찰률
    parts = (info or "").split("^")
    try:
        return float(parts[3]), float(parts[4])
    except (IndexError, ValueError):
        return None, None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--days", type=int, default=60)
    ap.add_argument("--max", type=int, default=2000)
    ap.add_argument("--dump", action="store_true")
    a = ap.parse_args()
    key = os.environ.get("G2B_KEY") or sys.exit("G2B_KEY가 없다")
    end = dt.date.today()
    start = end - dt.timedelta(days=a.days)

    rows, page = [], 1
    while len(rows) < a.max:
        items, total = fetch(key, start, end, page)
        if a.dump and items:
            print(json.dumps(items[0], ensure_ascii=False, indent=1))
            return
        if not items:
            break
        for it in items:
            name = it.get(FIELDS["name"], "")
            if not any(w in name for w in SW_WORDS):
                continue
            amt, rate = winner_amount_rate(it.get(FIELDS["winner"], ""))
            rows.append({"no": it.get(FIELDS["no"]), "name": name, "org": it.get(FIELDS["org"]),
                         "date": it.get(FIELDS["date"]), "bidders": int(it.get(FIELDS["bidders"]) or 0),
                         "win_amount": amt, "win_rate": rate})
        if page * 100 >= total:
            break
        page += 1

    out = "profit/g2b_sw_results.csv"
    with open(out, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()) if rows else ["no"])
        w.writeheader(); w.writerows(rows)

    b = sorted(r["bidders"] for r in rows if r["bidders"])
    amts = sorted(r["win_amount"] for r in rows if r["win_amount"])
    if not b:
        print("SW 관련 개찰 결과가 없다. 기간이나 키워드를 넓힌다."); return
    q = lambda xs, p: xs[min(len(xs) - 1, int(p * len(xs)))]
    print(f"SW 관련 개찰 {len(rows)}건 ({start}~{end}) → {out}")
    print(f"참가 업체 수: 하위25% {q(b,.25)} / 중앙 {statistics.median(b)} / 상위25% {q(b,.75)} / 최대 {b[-1]}")
    if amts:
        print(f"낙찰 금액: 하위25% {q(amts,.25):,.0f} / 중앙 {statistics.median(amts):,.0f} / 상위25% {q(amts,.75):,.0f}원")
    # 낙찰자가 사실상 무작위(예정가격 추첨 + 하한율 근처 최저가)라면 1건 낙찰 확률 ≈ 1/참가 업체 수
    p = statistics.mean(1 / x for x in b)
    print(f"무작위 가정 시 1건 낙찰 확률 평균 {p:.2%}. 연 N건 제출 시 기대 낙찰 = N × {p:.3f}")
    if amts:
        print(f"기대 매출(제출 1건당) ≈ {p * statistics.median(amts):,.0f}원. 납품 노동 원가는 별도")


if __name__ == "__main__":
    main()
