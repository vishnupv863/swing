import pandas as pd


def calculate_close_weekly_multi(
    data_by_ticker: dict[str, pd.DataFrame],
) -> dict[str, list[dict]]:
    output = {}
    for ticker, data in data_by_ticker.items():
        df = (
            data[["Close"]]
            .rename(columns={"Close": "close"})
            .rename_axis("date")
            .reset_index()
        )
        df["date"] = df["date"].dt.strftime("%Y-%m-%d")
        output[ticker] = df.to_dict(orient="records")

    return output
