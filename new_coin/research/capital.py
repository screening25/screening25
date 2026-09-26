"""순이익 3,000만 원에 필요한 원금 — 과거 수익률 분포로 본다.

과거 수익률은 미래 수익률이 아니다. 이 표는 "과거에 이 정도였을 때 원금이 얼마 필요했나"를 보여 줄 뿐이다.
BTC는 살아남아 1등이 된 자산을 사후에 고른 것이라 생존 편향이 크다.

세금 (2026-09 검색 기준):
  - 해외주식: 연 250만 원 공제 뒤 22%
  - 가상자산: 2027-01-01부터 연 250만 원 공제 뒤 22%(취득가는 2026-12-31 시가 의제). 그 전 실현분은 비과세
  - 국내 상장주식(대주주 아님): 양도세 없음, 매도 때 거래세 0.20%
사용: python3 capital.py DATA_DIR
"""
import sys
import pathlib
import numpy as np
import pandas as pd
from backtest import load_krw

TARGET = 30_000_000
DEDUCT, RATE = 2_500_000, 0.22


def gross_needed(net: float, taxed: bool) -> float:
    """한 해에 한 번 실현한다고 보고, 세후 net을 남기려면 필요한 세전 이익."""
    return net if not taxed else (net - RATE * DEDUCT) / (1 - RATE)


def rolling_cagr(px: pd.Series, years: int, per_year: int) -> pd.Series:
    n = years * per_year
    return (px / px.shift(n)) ** (1 / years) - 1


def main(data_dir: str):
    data_dir = pathlib.Path(data_dir)
    btc = load_krw(data_dir, 'btc')
    sp = pd.read_csv(data_dir / 'datasets_s-and-p-500_main_data_data.csv', parse_dates=['Date']).set_index('Date')
    sp = sp[sp.SP500 > 0]
    # 배당 재투자 총수익 지수(월). 배당 열이 0으로 끝나는 최근 달은 배당을 빼고 계산된다(과소평가).
    tr = (sp.SP500 / sp.SP500.shift(1) + sp.Dividend.shift(1) / 12 / sp.SP500.shift(1)).fillna(1).cumprod()
    tr = tr.loc['1950-01-01':]

    print('── 과거 연환산 수익률 분포 (보유 기간별) ──')
    rows = []
    for name, px, per in [('S&P500 총수익(달러, 1950~)', tr, 12), ('BTC 보유(원화 환산, 2014~)', btc, 365)]:
        for y in [1, 3, 5]:
            c = rolling_cagr(px, y, per).dropna()
            rows.append({'자산': name, '보유년수': y, '하위10%': f'{c.quantile(.1):.1%}', '중앙값': f'{c.median():.1%}',
                         '상위10%': f'{c.quantile(.9):.1%}', '손실확률': f'{(c < 0).mean():.0%}'})
    print(pd.DataFrame(rows).to_string(index=False))

    print('\n── 세후 3,000만 원에 필요한 원금 (N년 뒤 한 번 실현) ──')
    rows = []
    for taxed, label in [(False, '비과세(국내주식·2026년 안 코인)'), (True, '22% 과세(해외주식·2027년 이후 코인)')]:
        g = gross_needed(TARGET, taxed)
        for r in [0.05, 0.08, 0.15, 0.30]:
            row = {'세금': label, '연수익률': f'{r:.0%}'}
            for n in [1, 3, 5]:
                row[f'{n}년'] = f'{g / ((1 + r) ** n - 1) / 1e6:,.0f}백만'
            rows.append(row)
    print(pd.DataFrame(rows).to_string(index=False))
    print(f'\n세전 필요 이익: 비과세 {gross_needed(TARGET, False)/1e6:.1f}백만 / 과세 {gross_needed(TARGET, True)/1e6:.1f}백만')


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
