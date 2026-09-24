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
import { useRef, useState } from "react";

interface HoverPos {
    x: number;
    y: number;
}

type LineStyle = "line" | "dotted" | "dot";

export interface ChartSeries {
    values: (number | null | undefined)[];
    type: LineStyle;
    color: string;
    name?: string;
}

interface ChartPanelProps {
    dates: string[];
    series: ChartSeries[];
    title?: string;
    height?: number;
}

function ChartPanel({ dates, series, title, height = 500 }: ChartPanelProps) {
    const [hoverPos, setHoverPos] = useState<HoverPos | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // X-axis is the full set of trading dates. Each series' values
    // are placed onto it in ascending order as they arrive — index 0 goes
    // to the earliest date, index 1 to the next, and so on. Any date slot
    // beyond the values received so far gets null for that series.
    const chartData = dates.map((date, i) => {
        const row: Record<string, string | number | null> = { date };
        series.forEach((s, seriesIndex) => {
            row[`series_${seriesIndex}`] = s.values[i] ?? null;
        });
        return row;
    });

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        setHoverPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }

    function Crosshair() {
        if (!hoverPos) return null;

        return (
            <>
                <div
                    style={{
                        position: "absolute",
                        left: hoverPos.x,
                        top: 0,
                        bottom: 0,
                        width: 1,
                        borderLeft: "1px dashed #888",
                        pointerEvents: "none",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: hoverPos.y,
                        left: 0,
                        right: 0,
                        height: 1,
                        borderTop: "1px dashed #888",
                        pointerEvents: "none",
                    }}
                />
            </>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            {title && <h3>{title}</h3>}

            <div
                ref={containerRef}
                style={{ position: "relative", width: "100%", height }}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoverPos(null)}
            >
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />

                        <XAxis dataKey="date" interval="preserveStartEnd" />

                        <YAxis domain={["auto", "auto"]} />

                        {/* Recharts' own cursor is disabled — the overlay
                            <Crosshair /> below replaces it. */}
                        <Tooltip cursor={false} />
                        <Legend />

                        {series.map((s, i) => {
                            if (s.type === "dot") {
                                // Dots only, no connecting line — for raw
                                // price ticks.
                                return (
                                    <Line
                                        key={i}
                                        type="monotone"
                                        dataKey={`series_${i}`}
                                        name={s.name ?? `Series ${i + 1}`}
                                        stroke="none"
                                        dot={{ fill: s.color, r: 3 }}
                                        isAnimationActive={false}
                                        connectNulls={false}
                                    />
                                );
                            }

                            return (
                                <Line
                                    key={i}
                                    type="monotone"
                                    dataKey={`series_${i}`}
                                    name={s.name ?? `Series ${i + 1}`}
                                    stroke={s.color}
                                    strokeDasharray={s.type === "dotted" ? "5 5" : undefined}
                                    dot={false}
                                    isAnimationActive={false}
                                    connectNulls={false}
                                />
                            );
                        })}
                    </LineChart>
                </ResponsiveContainer>

                <Crosshair />
            </div>
        </div>
    );
}

export default ChartPanel;