from fastapi import APIRouter, Query
from services.data_fetch_weekly_multi import get_clean_weekly_multi_data
from services.ema_weekly_multi import calculate_ema_multi
from services.monte_carlo_weekly_multi import calculate_weekly_monte_carlo_multi
from services.close_price_weekly_multi import calculate_close_weekly_multi

router = APIRouter(prefix="/data-analysis", tags=["Data Analysis"])


@router.get("/multi")
def data_analysis_multi(tickers: list[str] = Query(...)):
    data = get_clean_weekly_multi_data(tickers)
    return {
        "close": calculate_close_weekly_multi(data),
        "ema": calculate_ema_multi(data),
        "monte_carlo": calculate_weekly_monte_carlo_multi(data),
    }
