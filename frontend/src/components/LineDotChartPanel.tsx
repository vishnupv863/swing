import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

export interface Series {
    key: string;
    name: string;
    color: string;
    dots?: boolean;
}

interface Props {
    title: string;
    data: Record<string, string | number | null>[];
    series: Series[];
}

export default function LineChartPanel({ title, data, series }: Props) {
    const tick = { fontSize: 12, fill: "#94a3b8" };

    return (
        <div>
            <h4>{title}</h4>
            <ResponsiveContainer width="100%" height={450}>
                <LineChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="2 4" vertical={false} opacity={0.2} />
                    <XAxis dataKey="date" minTickGap={50} tickLine={false} axisLine={false} tick={tick} />
                    <YAxis domain={["auto", "auto"]} tickLine={false} axisLine={false} tick={tick} />
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
                    {series.map((s) => (
                        <Line
                            key={s.key}
                            dataKey={s.key}
                            name={s.name}
                            stroke={s.dots ? "none" : s.color}
                            strokeWidth={2}
                            dot={s.dots ? { r: 3, fill: s.color, stroke: "none" } : false}
                            activeDot={{ r: 5 }}
                            isAnimationActive={false}
                            connectNulls
                        />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}