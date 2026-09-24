import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ChartPanel from "../components/ChartPanel";
import { getDataAnalysis } from "../api/dataAnalysis";
import type { EmaDynamicsPoint } from "../api/dataAnalysis";

function DataAnalysis() {
    const { ticker: rawTicker } = useParams<{ ticker: string }>();
    const ticker = rawTicker ? decodeURIComponent(rawTicker) : "";
    const [emaDynamics, setEmaDynamics] = useState<EmaDynamicsPoint[]>([]);
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

            <ChartPanel
                title="EMA velocity & acceleration"
                dates={emaDynamics.map((p) => p.Date)}
                series={[
                    {
                        values: emaDynamics.map((p) => p.ema_velocity),
                        type: "line",
                        color: "#4caf50",
                        name: "Velocity",
                    },
                    {
                        values: emaDynamics.map((p) => p.ema_acceleration),
                        type: "line",
                        color: "#ff9800",
                        name: "Acceleration",
                    },
                ]}
            />
        </div>
    );
}

export default DataAnalysis;