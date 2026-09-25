// DataAnalysisMultiPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import OHLCChartPanel from "../components/OHLCChartPanel";
import { getDataAnalysisMulti } from "../api/dataAnalysis";
import type { DataAnalysisMultiResponse } from "../api/dataAnalysis";

function DataAnalysisMultiPage() {
    const [searchParams] = useSearchParams();
    const tickers = searchParams.getAll("tickers");
    const category = searchParams.get("category");

    const [ohlc, setOhlc] = useState<DataAnalysisMultiResponse["ohlc"]>({});
    const [ema, setEma] = useState<DataAnalysisMultiResponse["ema"]>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (tickers.length === 0) return;

        let cancelled = false;

        async function fetchAnalysis() {
            setLoading(true);
            setError("");

            try {
                const result = await getDataAnalysisMulti(tickers);
                if (cancelled) return;
                setOhlc(result.ohlc);
                setEma(result.ema);
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Something went wrong");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchAnalysis();

        return () => {
            cancelled = true;
        };
    }, [tickers.join(",")]);

    useEffect(() => {
        document.title = category ? `${category} — Full Analysis` : "Full Stock Analysis";
        return () => {
            document.title = "Intraday Analytics";
        };
    }, [category]);

    if (tickers.length === 0) {
        return <p style={{ color: "red" }}>No tickers specified.</p>;
    }

    return (
        <div>
            <h2>{category ? `${category} — Full Analysis` : "Full Stock Analysis"}</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {Object.keys(ohlc).map((ticker) => (
                <div key={ticker}>
                    <h3>{ticker}</h3>

                    <OHLCChartPanel
                        title="Price"
                        data={ohlc[ticker] ?? []}
                        ema={[
                            {
                                name: "EMA 7",
                                color: "#2196f3",
                                values: (ema[ticker] ?? []).map((p) => p.ema_7),
                            },
                            {
                                name: "EMA 21",
                                color: "#e91e63",
                                values: (ema[ticker] ?? []).map((p) => p.ema_21),
                            },
                        ]}
                    />
                </div>
            ))}
        </div>
    );
}

export default DataAnalysisMultiPage;