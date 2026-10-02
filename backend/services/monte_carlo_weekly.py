import numpy as np
import pandas as pd
import yfinance as yf


def calculate_weekly_monte_carlo(
    ticker: str,
    n_candles: int = 240,
    n_sim: int = 10000,
    window: int = 75,
) -> list[dict]:
    df = yf.download(
        ticker, period="max", interval="1wk", auto_adjust=True, progress=False
    )
    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.droplevel(1)
    df = df[["Close"]].dropna()
    # df = df.iloc[:-1]  # uncomment to drop the in-progress weekly candle

    # Rolling drift and volatility (per-step, dt = 1)
    df["log_return"] = np.log(df["Close"] / df["Close"].shift(1))
    df["volatility"] = df["log_return"].rolling(window).std()
    df["drift"] = df["log_return"].rolling(window).mean() + 0.5 * df["volatility"] ** 2
    df = df.dropna()

    sub = df.iloc[-n_candles:]

    S = sub["Close"].values[:, None]
    mu = sub["drift"].values[:, None]
    sig = sub["volatility"].values[:, None]

    Z = np.random.normal(0, 1, (len(sub), n_sim))
    sims = S * np.exp((mu - 0.5 * sig**2) + sig * Z)

    # forecast made at row t is placed on row t+1; last one is the live next-week forecast
    next_date = sub.index[-1] + pd.Timedelta(weeks=1)
    fc = pd.DataFrame(
        {
            "mc_median": np.median(sims, axis=1),
            "mc_5th": np.percentile(sims, 5, axis=1),
            "mc_95th": np.percentile(sims, 95, axis=1),
        },
        index=list(sub.index[1:]) + [next_date],
    )

    result = sub[["Close"]].rename(columns={"Close": "close"}).join(fc, how="outer")
    result.index = result.index.strftime("%Y-%m-%d")
    result.index.name = "date"
    result = result.round(2).reset_index()

    result = result.astype(object).where(result.notna(), None)
    return result.to_dict(orient="records")
