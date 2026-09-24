# services/ema_dynamics.py
import pandas as pd


def calculate_ema_velocity_acceleration(
    data: pd.DataFrame, span: int = 21
) -> pd.DataFrame:
    work = data.copy()

    ema = work["Close"].ewm(span=span, adjust=False).mean()

    velocity = ema.diff()
    acceleration = velocity.diff()

    work["ema_velocity"] = velocity
    work["ema_acceleration"] = acceleration

    work = work.dropna(subset=["ema_velocity", "ema_acceleration"])

    return work[["ema_velocity", "ema_acceleration"]]
