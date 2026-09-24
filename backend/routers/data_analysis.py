import math
from fastapi import APIRouter, Query
from services.data_fetch import get_clean_data
from services.data_fetch_multi import get_clean_data_multi
from services.ema_dynamics import calculate_ema_velocity_acceleration

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


@router.get("")
def data_analysis(ticker: str):

    data = get_clean_data(ticker)

    # ohlc
    ohlc_records = build_ohlc_records(data)

    # ema velocity / acceleration
    ema_dynamics = calculate_ema_velocity_acceleration(data)
    ema_dynamics = ema_dynamics.reset_index()
    ema_dynamics["Date"] = ema_dynamics["Date"].astype(str)

    ema_dynamics_records = ema_dynamics.to_dict(orient="records")
    for row in ema_dynamics_records:
        for key, value in row.items():
            if isinstance(value, float) and math.isnan(value):
                row[key] = None

    return {
        "ohlc": ohlc_records,
        "ema_dynamics": ema_dynamics_records,
    }


@router.get("/multi")
def data_analysis_multi(tickers: list[str] = Query(...)):

    data_by_ticker = get_clean_data_multi(tickers)

    ohlc_result = {}
    ema_result = {}

    for ticker, data in data_by_ticker.items():
        ohlc_result[ticker] = build_ohlc_records(data)

        ema_dynamics = calculate_ema_velocity_acceleration(data)
        ema_dynamics = ema_dynamics.reset_index()
        ema_dynamics["Date"] = ema_dynamics["Date"].astype(str)

        ema_dynamics_records = ema_dynamics.to_dict(orient="records")
        for row in ema_dynamics_records:
            for key, value in row.items():
                if isinstance(value, float) and math.isnan(value):
                    row[key] = None

        ema_result[ticker] = ema_dynamics_records

    return {"ohlc": ohlc_result, "ema_dynamics": ema_result}
