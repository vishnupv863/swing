# services/monte_carlo_weekly.py
import numpy as np
import pandas as pd


def calculate_weekly_monte_carlo_multi(
    data_by_ticker, n_sim=10000, window=75, n_candles=240
):
    output = {}

    for ticker, data in data_by_ticker.items():
        close = data["Close"]
        r = np.log(close / close.shift(1))
        vol = r.rolling(window).std().values[:, None]
        drift = r.rolling(window).mean().values[:, None] + 0.5 * vol**2

        sims = close.values[:, None] * np.exp(
            (drift - 0.5 * vol**2) + vol * np.random.normal(size=(len(close), n_sim))
        )

        # forecast made at week t belongs to week t+1; the last one is next week
        next_week = close.index[-1] + pd.Timedelta(weeks=1)
        df = pd.DataFrame(
            {"mc_median": np.median(sims, axis=1)},
            index=close.index[1:].append(pd.DatetimeIndex([next_week])),
        ).dropna()
        df.insert(0, "close", close)

        df = df.tail(n_candles).round(2).rename_axis("date").reset_index()
        df["date"] = df["date"].dt.strftime("%Y-%m-%d")
        output[ticker] = (
            df.astype(object).where(df.notna(), None).to_dict(orient="records")
        )

    return output
