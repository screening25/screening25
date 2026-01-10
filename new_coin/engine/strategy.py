# 파일 경로: engine/strategy.py
import pyupbit
import numpy as np
import pandas as pd
import time

class SwingTrendStrategy:
    """
    Aegis V50 Nexus 스윙/추세 추종 전략 엔진입니다.
    전략 관련 로직, 지표 계산, 주문 집행 요청을 담당합니다.
    """
    def __init__(self, upbit_client, ticker, total_capital, account_risk_percentage):
        self.upbit = upbit_client
        self.ticker = ticker
        self.total_capital = total_capital
        self.account_risk_percentage = account_risk_percentage
        
        self.position = None
        self.entry_price = 0
        self.stop_loss_price = 0
        self.trailing_stop_price = 0
        self.amount = 0
        
        self.df = None
        self.atr = 0
        self.dynamic_k = 0.5

    def get_market_data(self, interval="day", count=200):
        """Upbit API를 통해 시세 데이터를 수집하고 업데이트합니다."""
        try:
            df = pyupbit.get_ohlcv(self.ticker, interval=interval, count=count)
            time.sleep(0.1)
            if df is None or df.empty:
                raise ValueError("API로부터 수신된 데이터프레임이 비어있습니다.")
            self.df = df
            return True
        except Exception as e:
            print(f"[{self.ticker}] 데이터 수집 오류: {e}")
            return False

    def calculate_indicators(self):
        """ATR 및 동적 K값 등 핵심 기술 지표를 계산합니다."""
        # ATR (Average True Range) 계산
        high_low = self.df['high'] - self.df['low']
        high_close = np.abs(self.df['high'] - self.df['close'].shift())
        low_close = np.abs(self.df['low'] - self.df['close'].shift())
        tr = pd.concat([high_low, high_close, low_close], axis=1).max(axis=1)
        self.atr = tr.ewm(span=14, adjust=False).mean().iloc[-1]
        
        # 동적 K값 계산 (분위수 기반)
        rolling_std = self.df['close'].rolling(window=20).std().dropna()
        if not rolling_std.empty:
            quantile = rolling_std.rank(pct=True).iloc[-1]
            self.dynamic_k = 0.3 + (quantile * 0.4)
        else:
            self.dynamic_k = 0.5

    def check_btc_trend_confirmation(self):
        """비트코인 4시간봉 기준 정배열 상태를 확인합니다."""
        try:
            btc_df = pyupbit.get_ohlcv("KRW-BTC", interval="minute240", count=121)
            time.sleep(0.1)
            if btc_df is None or btc_df.empty: return False
            
            ma20 = btc_df['close'].rolling(window=20).mean().iloc[-1]
            ma60 = btc_df['close'].rolling(window=60).mean().iloc[-1]
            ma120 = btc_df['close'].rolling(window=120).mean().iloc[-1]
            return ma20 > ma60
        except Exception as e:
            print(f"BTC 추세 확인 오류: {e}")
            return False
    
    def check_entry_signal(self):
        """진입 시그널 확인 시에도 메모리에 저장된 최신가를 사용합니다."""
        if self.df is None: return False
        
        target_price = self.df['open'].iloc[-1] + (self.df['high'].iloc[-2] - self.df['low'].iloc[-2]) * self.dynamic_k
        # API 호출 대신 메모리(self.df)의 마지막 가격 사용
        current_price = self.df['close'].iloc[-1] 
        return current_price > target_price
       

    def check_exit_signal(self):
        if not self.position or self.df is None: return None
        
        # main.py의 스레드가 1초마다 갱신해주는 가격을 그대로 사용
        current_price = self.df['close'].iloc[-1] 
        
        if current_price < self.stop_loss_price:
            return 'STOP_LOSS'
            
        if self.trailing_stop_price > 0 and current_price < self.trailing_stop_price:
            return 'TRAILING_STOP'
            
        return None

    def update_trailing_stop(self):
        """
        익절 활성화를 1.0 ATR로 설정하고, 봇 재시작 시의 '과거 고점' 오류를 방지합니다.
        """
        if not self.position or self.df is None: return
        
        current_price = self.df['close'].iloc[-1]
        
        # [핵심 보완] 최근 5개 캔들의 고점과 '내 매수 평단가' 중 더 높은 것을 기준으로 잡습니다.
        # 이렇게 해야 봇을 켰을 때 '매수 전의 높은 고점' 때문에 바로 팔리는 현상이 사라집니다.
        recent_high = max(self.entry_price, self.df['high'].rolling(window=5).max().iloc[-1])
        
        # 1. 활성화 조건: 현재가가 평단가 + 1.0 ATR을 넘었을 때만 작동 시작
        if self.entry_price > 0 and current_price > self.entry_price + (self.atr * 0.9):
            
            # 2. 방어선 계산: '현재 거래 내'에서의 최고점 대비 1.0 ATR 하락 시 매도
            chandelier_exit = recent_high - (self.atr * 0.9)
            
            # [안전장치] 방어선이 현재가보다 높으면 즉시 매도되므로, 현재가보다 낮게 유지함
            if chandelier_exit > current_price:
                chandelier_exit = current_price * 0.998 # 현재가보다 0.2% 낮게 임시 설정

            # 계산된 익절선이 기존 손절가보다 높을 때만 갱신 (위로만 이동)
            if self.stop_loss_price < chandelier_exit:
                self.stop_loss_price = chandelier_exit
                print(f"[{self.ticker}] 익절 방어선 상향(동기화): {self.stop_loss_price:,.0f}원")
            
            if chandelier_exit > self.trailing_stop_price:
                self.trailing_stop_price = chandelier_exit
                print(f"[{self.ticker}] 익절선 갱신: {self.trailing_stop_price:,.0f}원")

    def execute_buy_order(self):
        """현금(KRW) 잔고를 확인하여 중복 매수를 방지하고 주문을 집행합니다."""
        try:
            balance = self.upbit.get_balance("KRW")
            if balance is None: return False
            
            krw_balance = float(balance)
            slot_threshold = (self.total_capital / 3) * 0.9
            
            # 1. 잔고가 부족하면 여기서 끝냄
            if krw_balance < slot_threshold: 
                print(f"[{self.ticker}] 현금 부족(잔액: {krw_balance:,.0f}원).")
                return False

            # 2. [수정] 아래 로직은 if문과 '같은 라인'에 있어야 실행됩니다!
            max_loss_krw = self.total_capital * (self.account_risk_percentage / 100)
            
            # 리스크 기준을 손절폭인 3.5와 일치시킴 (일관성 유지)
            risk_per_unit = self.atr * 3.5 
            risk_per_unit_percentage = (risk_per_unit / self.df['close'].iloc[-1])
            
            if risk_per_unit_percentage <= 0: return False
            
            buy_amount_krw = (max_loss_krw / risk_per_unit_percentage) * 0.9995
            result = self.upbit.buy_market_order(self.ticker, buy_amount_krw)
            
            if result and 'uuid' in result:
                time.sleep(2)
                order_info = self.upbit.get_order(result['uuid'])
                if order_info and (trades := order_info.get('trades')):
                    total_volume = sum(float(t['volume']) for t in trades)
                    total_price_volume = sum(float(t['price']) * float(t['volume']) for t in trades)
                    if total_volume > 0:
                        self.entry_price = total_price_volume / total_volume
                        self.amount = total_volume
                        self.position = 'long'
                        self.stop_loss_price = self.entry_price - (self.atr * 3.5)
                        return True
            return False
        except Exception as e:
            print(f"[{self.ticker}] 매수 주문 오류: {e}")
            return False

    def execute_sell_order(self):
            """실제 코인 잔고를 확인하여 있을 때만 매도 주문을 집행합니다."""
            try:
                # [수정] 매도 전에는 '코인'이 있는지 확인해야 합니다.
                coin_symbol = self.ticker.split('-')[1] # "KRW-BTC" -> "BTC"
                raw_balance = self.upbit.get_balance(coin_symbol)
                if raw_balance is None: return 0.0 # API 응답 없으면 다음 턴에 다시 시도
                actual_coin_balance = float(raw_balance)


                
                if actual_coin_balance <= 0:
                    print(f"[{self.ticker}] 매도할 코인 잔고가 없습니다. 상태만 초기화합니다.")
                    self.reset_position()
                    return 0.0
                
                # 실제 보유 수량으로 매도 집행 (self.amount 대신 실제 잔고 사용 시 더 안전)
                result = self.upbit.sell_market_order(self.ticker, actual_coin_balance)
                pnl_percent = 0.0
                
                if result and 'uuid' in result:
                    time.sleep(2)
                    order_info = self.upbit.get_order(result['uuid'])
                    if order_info and (trades := order_info.get('trades')) and len(trades) > 0:
                        total_volume = sum(float(t['volume']) for t in trades)
                        total_price_volume = sum(float(t['price']) * float(t['volume']) for t in trades)
                        
                        if total_volume > 0:
                            exit_price = total_price_volume / total_volume
                            fee = 0.0005
                            pnl_percent = ((exit_price * (1 - fee)) - (self.entry_price * (1 + fee))) / (self.entry_price * (1 + fee)) * 100
                
                self.reset_position()
                return pnl_percent
            except Exception as e:
                print(f"[{self.ticker}] 매도 주문 오류: {e}")
                self.reset_position()
                return None

    def reset_position(self):
        """포지션 상태를 초기화합니다."""
        self.position = None
        self.entry_price = 0
        self.stop_loss_price = 0
        self.trailing_stop_price = 0
        self.amount = 0

    def get_status(self):
        # 1. 기초 데이터 존재 여부 확인 (안전장치 1)
        if not self.position or self.df is None or self.df.empty:
            return None
        
        try:
            # 2. 최신 종가 추출 시 발생할 수 있는 인덱스 오류 방지 (안전장치 2)
            current_price = self.df['close'].iloc[-1] if not self.df['close'].empty else None
            if current_price is None:
                return None

            # 3. NoneType 연산 방지를 위한 기본값 처리 (안전장치 3)
            entry_p = self.entry_price if self.entry_price is not None else 0
            amt = self.amount if self.amount is not None else 0
            
            invested_amount = entry_p * amt
            eval_amount = current_price * amt
            
            # 4. 0으로 나누기 오류(ZeroDivisionError) 방지
            pnl_percent = (current_price - entry_p) / entry_p * 100 if entry_p > 0 else 0
            pnl_krw = eval_amount - invested_amount
            
            return {
                "ticker": self.ticker,
                "entry_price": entry_p,
                "current_price": current_price,
                "amount": amt,
                "invested_amount": round(invested_amount, 0),
                "eval_amount": round(eval_amount, 0),
                "pnl_percent": round(pnl_percent, 2),
                "pnl_krw": round(pnl_krw, 0),
                "stop_loss_price": self.stop_loss_price or 0,
                "trailing_stop_price": self.trailing_stop_price or 0
            }
        except Exception as e:
            # 에러 발생 시 시스템을 중단시키지 않고 로그만 남김
            print(f"[{self.ticker}] get_status 계산 중 오류 발생: {e}")
            return None
