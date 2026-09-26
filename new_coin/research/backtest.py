"""코인 전략 검증 — 일별 종가만으로 할 수 있는 것.

데이터 (이 클라우드 환경에서 받을 수 있었던 것):
  - Coin Metrics 커뮤니티 데이터 btc.csv / eth.csv (ReferenceRateUSD, 없으면 PriceUSD)
  - datasets/exchange-rates daily.csv (원/달러, FRED 출처)
  업비트 원화 시세가 아니라 달러 시세 × 환율로 만든 원화 환산 가격이다. 김치 프리미엄은 반영하지 못한다.

규칙은 데이터를 보기 전에 정했다(과최적화를 피하려고 파라미터를 고르지 않는다):
  hold      : 사서 계속 들고 있는다
  sma200    : 전날 종가가 200일 평균 위면 보유, 아래면 현금
  cross     : 50일 평균이 200일 평균 위면 보유
  mom90     : 90일 수익률이 0보다 크면 보유
신호는 t일 종가로 계산하고 t+1일 종가에 거래한다(미래 정보 차단).
비용: 한쪽당 수수료 0.05%(업비트 원화마켓) + 슬리피지 0.10% = 0.15%.
구간: 학습 2014-01-01~2019-12-31, 검증 2020-01-01~끝. 파라미터를 학습 구간에서 고르지 않았으므로
      두 구간은 "같은 규칙이 다른 시기에도 버티는가"를 보는 용도다.

사용: python3 backtest.py DATA_DIR
"""
import sys
import pathlib
import numpy as np
import pandas as pd

COST = 0.0015
SPLIT = '2020-01-01'


def load_krw(data_dir: pathlib.Path, asset: str) -> pd.Series:
    d = pd.read_csv(data_dir / f'coinmetrics_data_master_csv_{asset}.csv', usecols=['time', 'PriceUSD', 'ReferenceRateUSD'])
    d['usd'] = d['ReferenceRateUSD'].fillna(d['PriceUSD'])
    d = d.dropna(subset=['usd'])
    usd = pd.Series(d['usd'].values, index=pd.to_datetime(d['time']))
    fx = pd.read_csv(data_dir / 'datasets_exchange-rates_main_data_daily.csv')
    fx = fx[fx.Country == 'South Korea'].dropna(subset=['Exchange rate'])
    fx = pd.Series(fx['Exchange rate'].astype(float).values, index=pd.to_datetime(fx['Date']))
    fx = fx.reindex(usd.index.union(fx.index)).ffill().reindex(usd.index)  # 주말·휴일은 직전 환율
    return (usd * fx).dropna().loc['2014-01-01':]


def positions(px: pd.Series) -> dict[str, pd.Series]:
    sma50, sma200 = px.rolling(50).mean(), px.rolling(200).mean()
    raw = {
        'hold': pd.Series(1.0, index=px.index),
        'sma200': (px > sma200).astype(float),
        'cross': (sma50 > sma200).astype(float),
        'mom90': (px.pct_change(90) > 0).astype(float),
    }
    return {k: v.shift(1).fillna(0.0) for k, v in raw.items()}  # 어제 신호로 오늘 보유


def run(px: pd.Series, pos: pd.Series) -> pd.Series:
    ret = px.pct_change().fillna(0.0)
    trades = pos.diff().abs().fillna(pos.iloc[0])
    return (1 + pos * ret - trades * COST).cumprod()


def stats(eq: pd.Series, pos: pd.Series) -> dict:
    eq = eq / eq.iloc[0]
    years = (eq.index[-1] - eq.index[0]).days / 365.25
    daily = eq.pct_change().dropna()
    dd = eq / eq.cummax() - 1
    return {
        'CAGR%': round((eq.iloc[-1] ** (1 / years) - 1) * 100, 1),
        'MDD%': round(dd.min() * 100, 1),
        '연변동성%': round(daily.std() * np.sqrt(365) * 100, 1),
        '최악1년%': round((eq / eq.shift(365) - 1).min() * 100, 1),
        '거래수': int(pos.diff().abs().sum()),
        '보유비율%': round(pos.mean() * 100),
    }


def main(data_dir: str):
    data_dir = pathlib.Path(data_dir)
    rows = []
    for asset in ['btc', 'eth']:
        px = load_krw(data_dir, asset)
        if asset == 'eth':
            px = px.loc['2016-06-01':]  # 상장 직후 1년은 거래가 얇아 뺀다
        for name, pos in positions(px).items():
            for label, sl in [('학습', slice(None, SPLIT)), ('검증', slice(SPLIT, None))]:
                p, s = px.loc[sl], pos.loc[sl]
                eq = run(p, s)
                rows.append({'자산': asset.upper(), '전략': name, '구간': label,
                             '기간': f'{p.index[0]:%Y-%m}~{p.index[-1]:%Y-%m}', **stats(eq, s)})
    out = pd.DataFrame(rows)
    pd.set_option('display.width', 200)
    print(out.to_string(index=False))
    return out


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv) > 1 else '.')
