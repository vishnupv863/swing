import { useParams } from "react-router-dom";
import MonteCarloWeekly from "../components/MonteCarloWeekly"; // adjust path

export default function MonteCarloWeeklyPage() {
    const { ticker = "^NSEI" } = useParams<{ ticker: string }>();

    return (
        <div style={{ padding: 16 }}>
            <h2>{ticker} - Weekly Monte Carlo</h2>
            <MonteCarloWeekly ticker={ticker} />
        </div>
    );
}