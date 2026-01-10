import os
import threading
import schedule
import time
import pyupbit
from flask import Flask, render_template, jsonify
from dotenv import load_dotenv
from engine.strategy import SwingTrendStrategy
import core.database as db

# --- 시스템 초기화 ---
load_dotenv()
db.init_db()

# --- Upbit 클라이언트 및 Flask 앱 설정 ---
UPBIT_ACCESS_KEY = os.getenv("UPBIT_ACCESS_KEY")
UPBIT_SECRET_KEY = os.getenv("UPBIT_SECRET_KEY")
upbit = None
try:
    upbit = pyupbit.Upbit(UPBIT_ACCESS_KEY, UPBIT_SECRET_KEY)
except Exception as e:
    print(f"Upbit 클라이언트 초기화 실패: {e}")
app = Flask(__name__)

# --- 계좌 및 리스크 관리 설정 ---
# [변경] TOTAL_CAPITAL은 아래 함수에서 자동으로 계산되므로 초기값은 0으로 설정합니다.
TOTAL_CAPITAL = 0 
ACCOUNT_RISK_PERCENTAGE = 1.5
MAX_CONSECUTIVE_LOSSES = 3
MAX_SLOTS = 4
TARGET_TICKERS = ["KRW-BTC", "KRW-ETH", "KRW-XRP", "KRW-SOL", "KRW-DOGE"]

# --- 전역 상태 변수 ---
portfolio = {}
portfolio_lock = threading.Lock()
logs = ["Aegis V50 Nexus: 시스템 초기화 완료."]
consecutive_losses = 0
trading_halted = False

# --- 추가: 자산 대비 75% 자동 계산 함수 ---
def get_total_trading_budget(upbit_client, ratio=0.75):
    """업비트 내 모든 자산(보유 코인 + 현금)의 합계를 구하고 75%를 반환합니다."""
    try:
        balances = upbit_client.get_balances()
        total_asset = 0
        
        for b in balances:
            # 1. 현금 잔고 합산
            if b['currency'] == 'KRW':
                total_asset += float(b['balance']) + float(b['locked'])
            # 2. 코인 자산 합산 (보유 수량 * 평균 매수가)
            else:
                avg_price = float(b.get('avg_buy_price', 0))
                balance = float(b.get('balance', 0))
                locked = float(b.get('locked', 0))
                total_asset += (balance + locked) * avg_price
        
        return total_asset * ratio
    except Exception as e:
        print(f"자산 조회 오류: {e}")
        return 50000 * ratio # 실패 시 최소 기준값의 75% 반환

def sync_with_upbit():
    """서버 시작 시 업비트 실제 잔고를 확인하여 포트폴리오를 복구함."""
    global portfolio, logs, TOTAL_CAPITAL
    try:
        balances = upbit.get_balances()
        for b in balances:
            ticker = f"KRW-{b['currency']}"
            if ticker in TARGET_TICKERS and float(b['balance']) * float(b['avg_buy_price']) > 5000:
                # 동적으로 계산된 TOTAL_CAPITAL을 인자로 전달합니다.
                bot = SwingTrendStrategy(upbit, ticker, TOTAL_CAPITAL, ACCOUNT_RISK_PERCENTAGE)
                bot.position = 'long'
                bot.amount = float(b['balance'])
                bot.entry_price = float(b['avg_buy_price'])
                
                bot.get_market_data()
                bot.calculate_indicators()
                bot.stop_loss_price = bot.entry_price - (bot.atr * 3.5)
                
                with portfolio_lock:
                    portfolio[ticker] = bot
                
                logs.append(f"[동기화] 기존 보유 자산 발견: {ticker}")
                print(f"Synced {ticker} position from Upbit.")
    except Exception as e:
        logs.append(f"[오류] 잔고 동기화 실패: {e}")

def run_trading_logic():
    """스케줄러에 의해 주기적으로 실행되는 메인 트레이딩 로직입니다."""
    global portfolio, logs, consecutive_losses, trading_halted, TOTAL_CAPITAL
    if not upbit:
        logs.append("[오류] Upbit 클라이언트가 초기화되지 않았습니다.")
        return

    is_btc_trend_ok = SwingTrendStrategy(upbit, "KRW-BTC", 0, 0).check_btc_trend_confirmation()

    with portfolio_lock:
        # 1. 보유 포지션 청산 관리
        for ticker in list(portfolio.keys()):
            bot = portfolio[ticker]
            if not bot.get_market_data(interval="day"): continue
            bot.calculate_indicators()
            bot.update_trailing_stop()
            
            exit_reason = bot.check_exit_signal()
            if exit_reason:
                pnl_percent = bot.execute_sell_order()
                if pnl_percent is not None:
                    db.log_trade(ticker, 'exit', bot.df['close'].iloc[-1], bot.amount, pnl_percent, exit_reason)
                    consecutive_losses = consecutive_losses + 1 if pnl_percent < 0 else 0
                    logs.append(f"[청산] {ticker} | 사유: {exit_reason} | 실현손익: {pnl_percent:.2f}%")
                    del portfolio[ticker]

        # 2. 서킷 브레이커
        halt_condition = consecutive_losses >= MAX_CONSECUTIVE_LOSSES or not is_btc_trend_ok
        if halt_condition and not trading_halted:
            trading_halted = True
            reason = "연속 손실" if consecutive_losses >= MAX_CONSECUTIVE_LOSSES else "BTC 추세 붕괴"
            logs.append(f"[거래 중단] 사유: {reason}. 신규 진입을 중단합니다.")
        elif not halt_condition and trading_halted:
            trading_halted = False
            consecutive_losses = 0
            logs.append("[거래 재개] 시스템이 신규 진입을 재개합니다.")

        # 3. 신규 진입
        if len(portfolio) < MAX_SLOTS and not trading_halted:
            for ticker in TARGET_TICKERS:
                if len(portfolio) >= MAX_SLOTS or ticker in portfolio: continue

                bot = SwingTrendStrategy(upbit, ticker, TOTAL_CAPITAL, ACCOUNT_RISK_PERCENTAGE)
                if not bot.get_market_data(interval="day"): continue
                bot.calculate_indicators()

                if is_btc_trend_ok and bot.check_entry_signal():
                    if bot.execute_buy_order():
                        db.log_trade(ticker, 'entry', bot.entry_price, bot.amount)
                        portfolio[ticker] = bot
                        logs.append(f"[진입] {ticker} @ {bot.entry_price:,.0f}")
                        time.sleep(1)

def run_scheduler():
    schedule.every(1).hour.at(":01").do(run_trading_logic)
    run_trading_logic()
    while True:
        schedule.run_pending()
        time.sleep(1)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/data')
def get_data():
    with portfolio_lock:
        active_positions = [bot.get_status() for bot in portfolio.values() if bot.get_status() is not None]
    
    try:
        # API 응답이 None일 경우 0을 기본값으로 설정하여 충돌 방지
        raw_krw = upbit.get_balance("KRW")
        held_krw = float(raw_krw) if raw_krw is not None else 0.0
        total_buy = sum(pos['entry_price'] * pos['amount'] for pos in active_positions)
        current_eval = sum(pos['current_price'] * pos['amount'] for pos in active_positions)
        
        total_eval = held_krw + current_eval
        total_pnl_krw = current_eval - total_buy
        total_pnl_percent = (total_pnl_krw / total_buy * 100) if total_buy > 0 else 0
        
        performance = db.get_performance_metrics()
        performance.update({
            "held_krw": held_krw,
            "total_eval": total_eval,
            "total_buy": total_buy,
            "total_pnl_krw": total_pnl_krw,
            "total_pnl_percent": total_pnl_percent,
            "available_krw": held_krw
        })
        
        return jsonify({
            "positions": active_positions,
            "performance": performance,
            "logs": logs[-20:]
        })
    except Exception as e:
        print(f"Data API 오류: {e}")
        return jsonify({"error": str(e)}), 500

def update_realtime_data():
    while True:
        try:
            with portfolio_lock:
                if portfolio:
                    tickers = list(portfolio.keys())
                    current_prices = pyupbit.get_current_price(tickers)
                    if current_prices is None: continue
                    if len(tickers) == 1 and isinstance(current_prices, (float, int)):
                        current_prices = {tickers[0]: current_prices}
                    
                    for ticker, price in current_prices.items():
                        if ticker in portfolio and price:
                            bot = portfolio[ticker]
                            if bot.df is not None:
                                bot.df.loc[bot.df.index[-1], 'close'] = price
            time.sleep(1) 
        except Exception as e:
            print(f"실시간 가격 최신화 일시 오류: {e}")
            time.sleep(2)

if __name__ == '__main__':
    # [수정] 봇 시작 시 전체 자산을 조회하여 75% 예산을 확정합니다.
    TOTAL_CAPITAL = get_total_trading_budget(upbit, ratio=0.75)
    print(f"======================================")
    print(f"운용 예산 확정 (전체 자산의 75%): {TOTAL_CAPITAL:,.0f}원")
    print(f"======================================")

    sync_with_upbit() 
    
    ticker_thread = threading.Thread(target=update_realtime_data, daemon=True)
    ticker_thread.start()
    
    scheduler_thread = threading.Thread(target=run_scheduler, daemon=True)
    scheduler_thread.start()
    
    app.run(host='0.0.0.0', port=5555, debug=False)