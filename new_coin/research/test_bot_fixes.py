"""2026-01 거래 기록에서 찾은 버그 세 개가 고쳐졌는지 가짜 업비트로 확인한다. 네트워크를 쓰지 않는다.

    cd new_coin && python -m pytest -q research/test_bot_fixes.py
"""
import os
import sys
import pathlib
import pandas as pd
import pytest

ROOT = pathlib.Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))


class FakeUpbit:
    def __init__(self, krw=1_000_000, coins=None, price=100.0):
        self.krw, self.coins, self.price = krw, dict(coins or {}), price
        self.buys, self.sells = [], []

    def get_balance(self, cur):
        return self.krw if cur == "KRW" else self.coins.get(cur, 0.0)

    def buy_market_order(self, ticker, krw):
        self.buys.append(ticker)
        return {"uuid": f"b{len(self.buys)}", "vol": krw / self.price}

    def sell_market_order(self, ticker, qty):
        self.sells.append(ticker)
        self.coins[ticker.split("-")[1]] = 0.0
        return {"uuid": f"s{len(self.sells)}", "vol": qty}

    def get_order(self, uuid):
        vol = 3.0 if uuid.startswith("s") else 1.0
        return {"trades": [{"price": str(self.price), "volume": str(vol)}]}

    def get_balances(self):
        return []


def df(price=100.0):
    return pd.DataFrame({"open": [price] * 30, "high": [price * 1.02] * 30, "low": [price * 0.98] * 30, "close": [price] * 30})


@pytest.fixture
def strat(monkeypatch):
    monkeypatch.setattr("time.sleep", lambda s: None)
    from engine.strategy import SwingTrendStrategy
    return SwingTrendStrategy


def test_exit_keeps_fill_after_reset(strat):
    up = FakeUpbit(coins={"ETH": 3.0}, price=110.0)
    bot = strat(up, "KRW-ETH", 1_000_000, 1.5)
    bot.df, bot.position, bot.entry_price, bot.amount = df(110), "long", 100.0, 3.0
    pnl = bot.execute_sell_order()
    assert bot.amount == 0                      # 포지션은 비웠다
    assert bot.last_exit == {"price": 110.0, "qty": 3.0}  # 기록할 체결은 남았다
    assert pnl > 0


def test_no_buy_when_already_holding(strat):
    up = FakeUpbit(coins={"BTC": 1.0}, price=100_000.0)
    bot = strat(up, "KRW-BTC", 1_000_000, 1.5)
    bot.df, bot.atr = df(100_000), 1_000.0
    assert bot.execute_buy_order() is False
    assert up.buys == []


def test_no_reentry_on_exit_day(monkeypatch, tmp_path, strat):
    monkeypatch.chdir(tmp_path)                 # DB 파일을 임시 폴더에 만든다
    import main
    up = FakeUpbit(coins={"ETH": 3.0}, price=90.0)
    main.upbit = up
    main.TOTAL_CAPITAL = 1_000_000
    main.trading_halted, main.consecutive_losses = False, 0
    main.exited_on.clear()
    monkeypatch.setattr(strat, "check_btc_trend_confirmation", lambda self: True)
    monkeypatch.setattr(strat, "get_market_data", lambda self, interval="day", count=200: setattr(self, "df", df(90)) or True)
    monkeypatch.setattr(strat, "calculate_indicators", lambda self: setattr(self, "atr", 1.0))
    monkeypatch.setattr(strat, "check_entry_signal", lambda self: True)   # 돌파 조건이 하루 종일 참

    bot = strat(up, "KRW-ETH", 1_000_000, 1.5)
    bot.df, bot.position, bot.entry_price, bot.amount, bot.stop_loss_price = df(90), "long", 100.0, 3.0, 95.0
    main.portfolio.clear()
    main.portfolio["KRW-ETH"] = bot

    main.run_trading_logic()
    assert up.sells == ["KRW-ETH"]
    assert "KRW-ETH" not in up.buys             # 청산한 날 다시 사지 않는다
    rows = main.db.sqlite3.connect("aegis_v50.db").execute("select position_type, amount from trades where ticker='KRW-ETH'").fetchall()
    assert ("exit", 3.0) in rows                # 청산 수량이 0이 아니다
