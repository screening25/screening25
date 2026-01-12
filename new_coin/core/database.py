import sqlite3
import pandas as pd
import numpy as np

DB_PATH = 'aegis_v50.db'

def init_db():
    """
    데이터베이스 및 'trades' 테이블 초기화.
    - DB 파일이 없으면 새로 생성.
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS trades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            ticker TEXT NOT NULL,
            position_type TEXT NOT NULL, -- 'entry' or 'exit'
            price REAL NOT NULL,
            amount REAL NOT NULL,
            pnl_percent REAL,
            exit_reason TEXT
        )
    ''')
    conn.commit()
    conn.close()

def log_trade(ticker, position_type, price, amount, pnl_percent=None, exit_reason=None):
    """
    매매 발생 시 거래 내역 기록.
    """
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        INSERT INTO trades (ticker, position_type, price, amount, pnl_percent, exit_reason)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (ticker, position_type, price, amount, pnl_percent, exit_reason))
    conn.commit()
    conn.close()

def get_performance_metrics():
    """
    DB 데이터를 기반으로 Profit Factor와 MDD 계산.
    - 수익 팩터: 총수익 / 총손실
    - MDD: 최대 누적 손실률
    """
    conn = sqlite3.connect(DB_PATH)
    query = "SELECT pnl_percent FROM trades WHERE position_type = 'exit' AND pnl_percent IS NOT NULL"
    df = pd.read_sql_query(query, conn)
    conn.close()

    if df.empty:
        return {"profit_factor": 0, "mdd": 0}

    # Profit Factor 계산
    gross_profit = df[df['pnl_percent'] > 0]['pnl_percent'].sum()
    gross_loss = abs(df[df['pnl_percent'] < 0]['pnl_percent'].sum())
    profit_factor = gross_profit / gross_loss if gross_loss != 0 else float('inf')

    # MDD (Maximum Drawdown) 계산
    df['cumulative_pnl'] = (1 + df['pnl_percent'] / 100).cumprod()
    peak = df['cumulative_pnl'].expanding(min_periods=1).max()
    drawdown = (df['cumulative_pnl'] - peak) / peak
    mdd = abs(drawdown.min()) * 100 if not drawdown.empty else 0

    return {
        "profit_factor": round(profit_factor, 2),
        "mdd": round(mdd, 2)
    }
