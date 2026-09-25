# services/ema.py
import pandas as pd


def calculate_ema(data: pd.DataFrame) -> pd.DataFrame:
    work = data.copy()

    work["ema_7"] = work["Close"].ewm(span=7, adjust=False).mean()
    work["ema_21"] = work["Close"].ewm(span=21, adjust=False).mean()

    return work[["ema_7", "ema_21"]]
