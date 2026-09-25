import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import { useRef, useState } from "react";

interface HoverPos {
    x: number;
    y: number;
}

export interface RsiSeries {
    values: (number | null | undefined)[];
    color: string;
    name?: string;
}

interface RsiChartPanelProps {
    dates: string[];
    series: RsiSeries[];
    title?: string;
    height?: number;
}

function RsiChartPanel({ dates, series, title, height = 250 }: RsiChartPanelProps) {
    const [hoverPos, setHoverPos] = useState<HoverPos | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

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

                        <YAxis domain={[0, 100]} />

                        <ReferenceLine y={70} stroke="#888" strokeDasharray="3 3" />
                        <ReferenceLine y={30} stroke="#888" strokeDasharray="3 3" />

                        <Tooltip cursor={false} />
                        <Legend />

                        {series.map((s, i) => (
                            <Line
                                key={i}
                                type="monotone"
                                dataKey={`series_${i}`}
                                name={s.name ?? `Series ${i + 1}`}
                                stroke={s.color}
                                dot={false}
                                isAnimationActive={false}
                                connectNulls={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>

                <Crosshair />
            </div>
        </div>
    );
}

export default RsiChartPanel;