# services/rsi.py
import pandas as pd


def _rsi(close: pd.Series, period: int) -> pd.Series:
    delta = close.diff()

    gain = delta.clip(lower=0)
    loss = -delta.clip(upper=0)

    avg_gain = gain.ewm(alpha=1 / period, adjust=False, min_periods=period).mean()
    avg_loss = loss.ewm(alpha=1 / period, adjust=False, min_periods=period).mean()

    rs = avg_gain / avg_loss
    rsi = 100 - (100 / (1 + rs))

    # where avg_loss is 0 (no losses in the window), RSI is 100
    rsi = rsi.where(avg_loss != 0, 100)

    return rsi


def calculate_rsi(data: pd.DataFrame) -> pd.DataFrame:
    work = data.copy()

    work["rsi_7"] = _rsi(work["Close"], 7)
    work["rsi_21"] = _rsi(work["Close"], 21)

    return work[["rsi_7", "rsi_21"]]
