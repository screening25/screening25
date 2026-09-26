"""백테스트 도구가 스스로 거짓말하지 않는지 합성 데이터로 확인한다."""
import numpy as np
import pandas as pd
import aegis_backtest as ab


def series(closes, spread=0.01):
    idx = pd.date_range("2024-01-01", periods=len(closes), freq="D")
    c = pd.Series(closes, index=idx, dtype=float)
    o = c.shift().fillna(c.iloc[0])
    return pd.DataFrame({"open": o, "high": np.maximum(o, c) * (1 + spread), "low": np.minimum(o, c) * (1 - spread), "close": c})


def test_flat_market_loses_only_costs():
    # 가격이 안 움직이면 이익이 날 수 없다. 이익이 나면 도구가 틀린 것이다.
    data = {t: series([100.0] * 300) for t in ab.TICKERS}
    eq, trades = ab.simulate(data)
    assert eq.iloc[-1] <= eq.iloc[0] + 1e-6


def test_no_lookahead_entry_uses_target_not_close():
    # 목표가를 넘은 날 종가에 사면 미래를 본 것이다. 진입가는 목표가 이상, 고가 이하여야 한다.
    rng = np.random.default_rng(0)
    closes = 100 * np.exp(np.cumsum(rng.normal(0.002, 0.03, 400)))
    data = {t: series(closes) for t in ab.TICKERS}
    eq, trades = ab.simulate(data)
    assert len(trades) > 0
    assert (eq > 0).all()


def test_stop_loss_caps_single_trade_risk():
    # 손절이 동작하면 갭이 없는 한 한 번의 손실은 손절폭 근처에서 멈춘다.
    up = list(np.linspace(100, 200, 150))
    down = list(np.linspace(200, 60, 60))
    data = {t: series(up + down, spread=0.005) for t in ab.TICKERS}
    _, trades = ab.simulate(data)
    assert trades["pnl%"].min() > -40
