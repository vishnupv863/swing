import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import ChartPanel from "../components/ChartPanel";
import { getDataAnalysisMulti } from "../api/dataAnalysis";
import type { DataAnalysisMultiResponse } from "../api/dataAnalysis";

function DataAnalysisMultiPage() {
    const [searchParams] = useSearchParams();
    const tickers = searchParams.getAll("tickers");

    const [emaDynamics, setEmaDynamics] = useState<DataAnalysisMultiResponse["ema_dynamics"]>({});
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
                setEmaDynamics(result.ema_dynamics);
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

    if (tickers.length === 0) {
        return <p style={{ color: "red" }}>No tickers specified.</p>;
    }

    return (
        <div>
            <h2>Full Stock Analysis</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {Object.entries(emaDynamics).map(([ticker, points]) => (
                <ChartPanel
                    key={ticker}
                    title={`${ticker} — EMA velocity & acceleration`}
                    dates={points.map((p) => p.Date)}
                    series={[
                        {
                            values: points.map((p) => p.ema_velocity),
                            type: "line",
                            color: "#4caf50",
                            name: "Velocity",
                        },
                        {
                            values: points.map((p) => p.ema_acceleration),
                            type: "line",
                            color: "#ff9800",
                            name: "Acceleration",
                        },
                    ]}
                />
            ))}
        </div>
    );
}

export default DataAnalysisMultiPage;