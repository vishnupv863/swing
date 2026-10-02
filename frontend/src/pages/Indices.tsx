import { Link } from "react-router-dom";
import "../styles/stocks.css";

interface Category {
    title: string;
    tickers: string[];
}

const Broad_Indices = [
    "^NSEI",      // Nifty 50
    "^NSEBANK",   // Bank Nifty
];

const CATEGORIES: Category[] = [
    { title: "Broad Market Indices", tickers: Broad_Indices },
];

function Indices() {
    return (
        <div className="stocks-container">
            <header className="stocks-header">
                <h2 className="stocks-title">Indices Dashboard</h2>
                <p className="stocks-subtitle">Analyze broad market, midcap, smallcap and sectoral indices</p>
            </header>

            <div className="categories-grid">
                {CATEGORIES.map((category) => {
                    const params = new URLSearchParams();
                    category.tickers.forEach((t) => params.append("tickers", t));
                    params.append("category", category.title);

                    return (
                        <div key={category.title} className="category-card">
                            <div className="category-header">
                                <h3 className="category-title">{category.title}</h3>
                                <Link
                                    to={`/data-analysis/multi?${params.toString()}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-analysis"
                                >
                                    Get Full Index Analysis
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Indices;