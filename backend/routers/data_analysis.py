import math
from fastapi import APIRouter, Query
from services.data_fetch import get_clean_data
from services.data_fetch_multi import get_clean_data_multi
from services.ema import calculate_ema

router = APIRouter(prefix="/data-analysis", tags=["Data Analysis"])


def build_ohlc_records(data):
    ohlc = data[["Open", "High", "Low", "Close"]].reset_index()
    ohlc["Date"] = ohlc["Date"].astype(str)
    ohlc = ohlc.rename(
        columns={
            "Date": "date",
            "Open": "open",
            "High": "high",
            "Low": "low",
            "Close": "close",
        }
    )

    records = ohlc.to_dict(orient="records")
    for row in records:
        for key, value in row.items():
            if isinstance(value, float) and math.isnan(value):
                row[key] = None

    return records


def build_records(df):
    df = df.reset_index()
    df["Date"] = df["Date"].astype(str)

    records = df.to_dict(orient="records")
    for row in records:
        for key, value in row.items():
            if isinstance(value, float) and math.isnan(value):
                row[key] = None

    return records


@router.get("")
def data_analysis(ticker: str):

    data = get_clean_data(ticker)

    # ohlc
    ohlc_records = build_ohlc_records(data)

    # ema (7 & 21)
    ema_records = build_records(calculate_ema(data))

    return {
        "ohlc": ohlc_records,
        "ema": ema_records,
    }


@router.get("/multi")
def data_analysis_multi(tickers: list[str] = Query(...)):

    data_by_ticker = get_clean_data_multi(tickers)

    ohlc_result = {}
    ema_result = {}

    for ticker, data in data_by_ticker.items():
        ohlc_result[ticker] = build_ohlc_records(data)
        ema_result[ticker] = build_records(calculate_ema(data))

    return {
        "ohlc": ohlc_result,
        "ema": ema_result,
    }
