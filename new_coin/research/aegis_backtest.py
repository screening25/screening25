"""Aegis V50 규칙을 일봉으로 되돌려 본다. 맥에서 업비트 데이터로 돌린다(클라우드는 업비트가 막혀 있다).

    pip install pyupbit pandas numpy
    python3 aegis_backtest.py                       # 업비트에서 일봉을 받아 돌린다
    python3 aegis_backtest.py --csv DIR             # DIR/KRW-BTC.csv 등(date,open,high,low,close)

봇은 매시 정각에 판단하지만 여기서는 일봉 한 개 안에서 일어난 일을 아래처럼 근사한다. 그래서 실제 봇과 결과가 다르다.
  - 진입: 오늘 고가가 목표가(오늘 시가 + 어제 범위 × k)를 넘으면 목표가에 산다. 슬리피지를 더한다
  - k: 최근 20일 종가 표준편차의 백분위로 0.3~0.7 (봇과 같다)
  - 필터: 어제까지 BTC 일봉 20일선 > 60일선 (봇은 4시간봉 20>60. 근사)
  - 손절: 진입가 − 3.5 ATR. 저가가 닿으면 그 값에 판다
  - 익절 추적: 종가가 진입가 + 0.9 ATR을 넘으면 방어선 = 최근 5일 고가 − 0.9 ATR(위로만)
  - 같은 날 진입과 청산이 모두 가능하면 청산을 먼저 본다(불리한 쪽으로 가정)
  - 포지션 크기: 자본의 1.5%를 3.5 ATR 손절폭으로 나눈 금액, 최대 4종목, 연속 3패면 BTC 필터가 풀릴 때까지 멈춤
비용: 수수료 0.05% + 슬리피지 0.10%, 매수·매도 각각.
학습/검증을 나누지 않는다. 이 규칙은 이미 사람이 정한 것이라 여기서는 "이 규칙이 비용을 넘는가"만 본다.
"""
import argparse
import pathlib
import numpy as np
import pandas as pd

TICKERS = ["KRW-BTC", "KRW-ETH", "KRW-XRP", "KRW-SOL", "KRW-DOGE"]
FEE, SLIP = 0.0005, 0.0010
RISK, STOP_ATR, TRAIL_ATR, SLOTS, MAX_LOSSES = 0.015, 3.5, 0.9, 4, 3


def load(args) -> dict[str, pd.DataFrame]:
    out = {}
    for t in TICKERS:
        if args.csv:
            p = pathlib.Path(args.csv) / f"{t}.csv"
            if not p.exists():
                continue
            df = pd.read_csv(p, parse_dates=["date"]).set_index("date")
        else:
            import pyupbit
            df = pyupbit.get_ohlcv(t, interval="day", count=args.days)
        out[t] = df[["open", "high", "low", "close"]].astype(float)
    return out


def indicators(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    prev_close = df.close.shift()
    tr = pd.concat([df.high - df.low, (df.high - prev_close).abs(), (df.low - prev_close).abs()], axis=1).max(axis=1)
    df["atr"] = tr.ewm(span=14, adjust=False).mean().shift()          # 어제까지로 계산
    std = df.close.rolling(20).std()
    pct = std.rolling(200, min_periods=20).apply(lambda s: s.rank(pct=True).iloc[-1], raw=False)
    df["k"] = (0.3 + pct * 0.4).shift().fillna(0.5)
    df["target"] = df.open + (df.high.shift() - df.low.shift()) * df.k
    df["hh5"] = df.high.rolling(5).max()
    return df


def simulate(data: dict[str, pd.DataFrame], capital: float = 10_000_000, breaker_reset: str = "never"):
    """breaker_reset: "never" = 봇 원본(연속 3패 뒤 멈추면 재시작 전까지 안 풀린다)
                      "trend" = BTC 추세 필터가 꺼졌다 다시 켜지면 연속 손실 수를 0으로 되돌린다"""
    data = {t: indicators(d) for t, d in data.items()}
    btc = data["KRW-BTC"]
    trend_ok = (btc.close.rolling(20).mean() > btc.close.rolling(60).mean()).shift().fillna(False)
    days = sorted(set().union(*[d.index for d in data.values()]))
    cash, pos, trades, losses, halted, equity = capital, {}, [], 0, False, []

    prev_ok = False
    for day in days:
        ok = bool(trend_ok.get(day, False))
        if breaker_reset == "trend" and ok and not prev_ok:
            losses = 0
        prev_ok = ok
        # 1) 보유분 청산
        for t in list(pos):
            d = data[t]
            if day not in d.index:
                continue
            row, p = d.loc[day], pos[t]
            stop = max(p["stop"], p["trail"])
            if row.low <= stop:
                px = min(row.open, stop) * (1 - SLIP)                 # 갭하락이면 시가에 판다
                cash += p["qty"] * px * (1 - FEE)
                pnl = (px * (1 - FEE)) / (p["entry"] * (1 + FEE)) - 1
                trades.append({"ticker": t, "in": p["day"], "out": day, "pnl%": round(pnl * 100, 2)})
                losses = losses + 1 if pnl < 0 else 0
                del pos[t]
                continue
            if row.close > p["entry"] + row.atr * TRAIL_ATR:          # 추적 방어선은 위로만
                p["trail"] = max(p["trail"], max(p["entry"], row.hh5) - row.atr * TRAIL_ATR)
        # 2) 멈춤 판단
        halt = losses >= MAX_LOSSES or not ok
        if halted and not halt:
            losses = 0
        halted = halt
        # 3) 진입
        if not halted:
            for t, d in data.items():
                if len(pos) >= SLOTS or t in pos or day not in d.index:
                    continue
                row = d.loc[day]
                if np.isnan(row.atr) or np.isnan(row.target) or row.high <= row.target:
                    continue
                entry = max(row.open, row.target) * (1 + SLIP)
                budget = min(cash, (capital * RISK) / (STOP_ATR * row.atr / entry))
                if budget < 5_000:
                    continue
                qty = budget * (1 - FEE) / entry
                cash -= budget
                pos[t] = {"day": day, "entry": entry, "qty": qty, "stop": entry - STOP_ATR * row.atr, "trail": 0.0}
        mark = sum(p["qty"] * data[t].close.get(day, p["entry"]) for t, p in pos.items())
        equity.append((day, cash + mark))

    eq = pd.Series(dict(equity))
    return eq, pd.DataFrame(trades)


def report(eq: pd.Series, trades: pd.DataFrame, bench: pd.Series):
    years = (eq.index[-1] - eq.index[0]).days / 365.25
    cagr = lambda s: (s.iloc[-1] / s.iloc[0]) ** (1 / years) - 1
    mdd = lambda s: (s / s.cummax() - 1).min()
    print(f"기간 {eq.index[0]:%Y-%m-%d} ~ {eq.index[-1]:%Y-%m-%d} ({years:.1f}년)")
    print(f"Aegis   CAGR {cagr(eq):7.1%}  MDD {mdd(eq):7.1%}  거래 {len(trades)}건")
    b = bench.loc[eq.index[0]:eq.index[-1]]
    print(f"BTC보유 CAGR {cagr(b):7.1%}  MDD {mdd(b):7.1%}")
    if len(trades):
        w = trades["pnl%"] > 0
        print(f"승률 {w.mean():.0%}  평균이익 {trades.loc[w, 'pnl%'].mean():.2f}%  평균손실 {trades.loc[~w, 'pnl%'].mean():.2f}%")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--csv")
    ap.add_argument("--days", type=int, default=2000)
    a = ap.parse_args()
    data = load(a)
    eq, trades = simulate(data)
    report(eq, trades, data["KRW-BTC"].close)
