import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import OHLCChartPanel from "../components/OHLCChartPanel";
import { getDataAnalysis } from "../api/dataAnalysis";
import type { EmaPoint, OHLCRecord } from "../api/dataAnalysis";

function DataAnalysis() {
    const { ticker: rawTicker } = useParams<{ ticker: string }>();
    const ticker = rawTicker ? decodeURIComponent(rawTicker) : "";
    const [ohlc, setOhlc] = useState<OHLCRecord[]>([]);
    const [ema, setEma] = useState<EmaPoint[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!ticker) return;

        let cancelled = false;

        async function fetchAnalysis() {
            setLoading(true);
            setError("");

            try {
                const result = await getDataAnalysis(ticker);
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
    }, [ticker]);

    useEffect(() => {
        if (ticker) {
            document.title = `${ticker} — Data Analysis`;
        }
        return () => {
            document.title = "Intraday Analytics";
        };
    }, [ticker]);

    if (!ticker) {
        return <p style={{ color: "red" }}>No ticker specified.</p>;
    }

    return (
        <div>
            <h2>{ticker}</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            <OHLCChartPanel
                title="Price"
                data={ohlc}
                ema={[
                    { name: "EMA 7", color: "#2196f3", values: ema.map((p) => p.ema_7) },
                    { name: "EMA 21", color: "#e91e63", values: ema.map((p) => p.ema_21) },
                ]}
            />
        </div>
    );
}

export default DataAnalysis;