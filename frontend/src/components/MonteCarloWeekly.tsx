import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { getMonteCarloWeekly } from "../api/dataAnalysis"; // adjust path
import type { MonteCarloWeeklyPoint } from "../api/dataAnalysis"; // adjust path

interface Props {
    ticker?: string;
}

export default function MonteCarloWeekly({ ticker = "^NSEI" }: Props) {
    const [data, setData] = useState<MonteCarloWeeklyPoint[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        getMonteCarloWeekly(ticker)
            .then((res) => {
                if (!cancelled) setData(res.data);
            })
            .catch((err) => {
                if (!cancelled) setError(err?.message ?? "Failed to load Monte Carlo data");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [ticker]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div style={{ color: "red" }}>{error}</div>;

    return (
        <ResponsiveContainer width="100%" height={600}>
            <LineChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="2 4" vertical={false} opacity={0.2} />
                <XAxis
                    dataKey="date"
                    minTickGap={50}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                    domain={["auto", "auto"]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <Tooltip
                    contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #334155",
                        background: "#0f172a",
                        color: "#e2e8f0",
                        fontSize: 13,
                    }}
                    labelStyle={{ color: "#94a3b8" }}
                />
                <Legend iconType="circle" />
                <Line
                    dataKey="close"
                    name="Close"
                    stroke="none"
                    dot={{ r: 3, fill: "#38bdf8", stroke: "#0c4a6e", strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                    isAnimationActive={false}
                />
                <Line
                    dataKey="mc_median"
                    name="MC median"
                    stroke="none"
                    dot={{ r: 3, fill: "#f472b6", stroke: "#831843", strokeWidth: 1 }}
                    activeDot={{ r: 5 }}
                    isAnimationActive={false}
                />
            </LineChart>
        </ResponsiveContainer>
    );
}