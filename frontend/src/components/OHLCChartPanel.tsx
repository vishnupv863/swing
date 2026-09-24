import {
    ComposedChart,
    Bar,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";

export interface OHLCPoint {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface OverlaySeries {
    name: string;
    color: string;
    values: (number | null | undefined)[];
}

interface CandlestickShapeProps {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    payload?: OHLCPoint;
    yAxisMap?: { scale: (v: number) => number };
}

interface OHLCChartPanelProps {
    data: OHLCPoint[];
    ema?: OverlaySeries[];
    rsi?: (number | null | undefined)[];
    title?: string;
    height?: number;
    rsiHeight?: number;
}

function OHLCChartPanel({
    data,
    ema = [],
    rsi,
    title,
    height = 500,
    rsiHeight = 150,
}: OHLCChartPanelProps) {
    const chartData = data.map((d, i) => {
        const row: Record<string, string | number | null | [number, number]> = {
            date: d.date,
            open: d.open,
            high: d.high,
            low: d.low,
            close: d.close,
            // recharts Bar needs a [low, high] range to size the wick;
            // the body (open/close box) is drawn manually in the shape below
            range: [d.low, d.high],
        };
        ema.forEach((s, seriesIndex) => {
            row[`ema_${seriesIndex}`] = s.values[i] ?? null;
        });
        return row;
    });

    function Candlestick(props: CandlestickShapeProps) {
        const { x, y, width, height: barHeight, payload } = props;
        if (x === undefined || y === undefined || width === undefined || barHeight === undefined || !payload) {
            return <g />;
        }

        const { open, high, low, close } = payload;
        const isUp = close >= open;
        const color = isUp ? "#26a69a" : "#ef5350";

        // The bar (range: [low, high]) gives us y for `high` at `y`
        // and y for `low` at `y + barHeight`. Scale open/close linearly
        // within that same pixel range.
        const priceRange = high - low || 1;
        const pxPerUnit = barHeight / priceRange;

        const openY = y + (high - open) * pxPerUnit;
        const closeY = y + (high - close) * pxPerUnit;
        const bodyTop = Math.min(openY, closeY);
        const bodyBottom = Math.max(openY, closeY);
        const bodyHeight = Math.max(bodyBottom - bodyTop, 1);

        const wickX = x + width / 2;
        const bodyWidth = Math.max(width * 0.6, 2);
        const bodyX = x + (width - bodyWidth) / 2;

        return (
            <g>
                {/* wick: full high-low line */}
                <line x1={wickX} x2={wickX} y1={y} y2={y + barHeight} stroke={color} strokeWidth={1} />
                {/* body: open-close box */}
                <rect x={bodyX} y={bodyTop} width={bodyWidth} height={bodyHeight} fill={color} />
            </g>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            {title && <h3>{title}</h3>}

            <ResponsiveContainer width="100%" height={height}>
                <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" interval="preserveStartEnd" />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip />
                    <Legend />

                    <Bar dataKey="range" shape={Candlestick} name="Price" isAnimationActive={false} />

                    {ema.map((s, i) => (
                        <Line
                            key={i}
                            type="monotone"
                            dataKey={`ema_${i}`}
                            name={s.name}
                            stroke={s.color}
                            dot={false}
                            isAnimationActive={false}
                            connectNulls={false}
                        />
                    ))}
                </ComposedChart>
            </ResponsiveContainer>

            {rsi && (
                <ResponsiveContainer width="100%" height={rsiHeight}>
                    <ComposedChart data={chartData.map((d, i) => ({ ...d, rsi: rsi[i] ?? null }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" interval="preserveStartEnd" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <ReferenceLine y={70} stroke="#888" strokeDasharray="3 3" />
                        <ReferenceLine y={30} stroke="#888" strokeDasharray="3 3" />
                        <Line
                            type="monotone"
                            dataKey="rsi"
                            name="RSI"
                            stroke="#9c27b0"
                            dot={false}
                            isAnimationActive={false}
                            connectNulls={false}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}

export default OHLCChartPanel;