import yfinance as yf
import pandas as pd
from fastapi import HTTPException

IST = "Asia/Kolkata"


def get_clean_weekly_multi_data(tickers: list[str]):
    raw = yf.download(
        tickers,
        period="max",
        interval="1wk",
        auto_adjust=False,
        progress=False,
        group_by="ticker",
    )

    if raw.empty:
        raise HTTPException(status_code=404, detail="No market data found.")

    result = dict[str, pd.DataFrame] = {}

    for ticker in tickers:
        if isinstance(raw.columns, pd.MultiIndex):
            if ticker not in raw.columns.get_level_values(0):
                continue
            ticker_df = raw[ticker].copy()
        else:
            # only one ticker was actually returned (e.g. single-item list)
            ticker_df = raw.copy()

        ticker_df = ticker_df.dropna()

        if ticker_df.empty:
            continue
        # ==========================================
        # NORMALIZE TIMEZONE TO IST
        # ==========================================
        if ticker_df.index.tz is None:
            ticker_df.index = ticker_df.index.tz_localize("UTC").tz_convert(IST)
        else:
            ticker_df.index = ticker_df.index.tz_convert(IST)
            result[ticker] = ticker_df

    if not result:
        raise HTTPException(status_code=404, detail="No market data found.")

    return result
