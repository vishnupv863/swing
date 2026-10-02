import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import LineChartPanel from "../components/LineDotChartPanel";
import { getDataAnalysisMulti } from "../api/dataAnalysis_weekly_multi";
import type { DataAnalysisMultiResponse } from "../api/dataAnalysis_weekly_multi";

type Row = Record<string, string | number | null>;

function DataAnalysisWeeklyMultiPage() {
    const [searchParams] = useSearchParams();
    const tickers = searchParams.getAll("tickers");
    const category = searchParams.get("category");

    const [close, setClose] = useState<DataAnalysisMultiResponse["close"]>({});
    const [mc, setMc] = useState<DataAnalysisMultiResponse["monte_carlo"]>({});
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
                setClose(result.close);
                setMc(result.monte_carlo);
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

    // join close with monte carlo by date, keep the last 241 rows (240 candles + next week)
    const rowsFor = (ticker: string): Row[] => {
        const m = new Map<string, Row>();
        const put = (date: string, v: Row) => m.set(date, { ...m.get(date), date, ...v });

        (close[ticker] ?? []).forEach((p) => put(p.date, { close: p.close }));
        (mc[ticker] ?? []).forEach(({ date, mc_median }) => put(date, { mc_median }));

        return [...m.values()]
            .sort((a, b) => String(a.date).localeCompare(String(b.date)))
            .slice(-241);
    };

    if (tickers.length === 0) {
        return <p style={{ color: "red" }}>No tickers specified.</p>;
    }

    return (
        <div>
            <h2>{category ? `${category} — Full Analysis` : "Full Stock Analysis"}</h2>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {Object.keys(close).map((ticker) => (
                <div key={ticker}>
                    <h3>{ticker}</h3>

                    <LineChartPanel
                        title="Close + Monte Carlo"
                        data={rowsFor(ticker)}
                        series={[
                            { key: "close", name: "Close", color: "#38bdf8", dots: true },
                            { key: "mc_median", name: "MC median", color: "#f472b6", dots: true },
                        ]}
                    />
                </div>
            ))}
        </div>
    );
}

export default DataAnalysisWeeklyMultiPage;