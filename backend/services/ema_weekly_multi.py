# services/ema.py
import pandas as pd


def calculate_ema_multi(
    data_by_ticker: dict[str, pd.DataFrame],
) -> dict[str, list[dict]]:
    output = {}

    for ticker, data in data_by_ticker.items():
        df = (
            pd.DataFrame(
                {
                    "ema_7": data["Close"].ewm(span=7, adjust=False).mean(),
                    "ema_21": data["Close"].ewm(span=21, adjust=False).mean(),
                }
            )
            .rename_axis("Date")
            .reset_index()
        )
        df["Date"] = df["Date"].astype(str)
        output[ticker] = df.to_dict(orient="records")

    return output
