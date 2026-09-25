import yfinance as yf
import pandas as pd
from fastapi import HTTPException

IST = "Asia/Kolkata"


def get_clean_data(ticker: str) -> pd.DataFrame:
    """
    Downloads the latest 3 months of daily data for `ticker`
    and returns a cleaned DataFrame (flat columns, no NaNs,
    DatetimeIndex in IST).

    Raises HTTPException on missing data.
    """

    # ==========================================
    # DOWNLOAD DATA
    # ==========================================

    raw = yf.download(
        ticker,
        period="12mo",
        interval="1d",
        auto_adjust=False,
        progress=False,
    )

    if raw.empty:
        raise HTTPException(status_code=404, detail="No market data found.")

    # ==========================================
    # CLEAN COLUMNS
    # ==========================================

    if isinstance(raw.columns, pd.MultiIndex):
        raw.columns = raw.columns.get_level_values(0)

    raw = raw.dropna()

    # ==========================================
    # NORMALIZE TIMEZONE TO IST
    # yfinance may return the index as tz-naive or in a
    # non-Indian timezone depending on the ticker/interval —
    # convert everything to Asia/Kolkata so downstream code
    # always lines up with actual NSE trading dates.
    # ==========================================

    if raw.index.tz is None:
        raw.index = raw.index.tz_localize("UTC").tz_convert(IST)
    else:
        raw.index = raw.index.tz_convert(IST)

    return raw
