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
        mu = r.rolling(window).mean().values[:, None]

        # GBM step: estimate step t+1 from price at t
        sims = close.values[:, None] * np.exp(
            (mu - 0.5 * vol**2) + vol * np.random.normal(size=(len(close), n_sim))
        )

        mc_median = np.median(sims, axis=1)

        # 1. Shift target dates forward by 1 period so forecast at t aligns with t+1
        next_date = close.index[-1] + pd.Timedelta(weeks=1)
        forecast_dates = close.index[1:].append(pd.DatetimeIndex([next_date]))

        # 2. Build DataFrame where mc_median forecasts the NEXT period
        df = pd.DataFrame({"mc_median": mc_median}, index=forecast_dates)

        # 3. Join actual close values (last future row will have NaN close, which is expected)
        df["close"] = close

        # 4. Drop initial window NaNs while preserving the future forecast row
        df = df.iloc[window - 1 :]

        df = df.tail(n_candles).round(2).rename_axis("date").reset_index()
        df["date"] = df["date"].dt.strftime("%Y-%m-%d")

        output[ticker] = (
            df.astype(object).where(df.notna(), None).to_dict(orient="records")
        )

    return output
