import { Link } from "react-router-dom";
import "../styles/stocks.css"

interface Stock {
    ticker: string;
    name: string;
}

interface Category {
    title: string;
    stocks: Stock[];
}

// Helper function to create Stock object from a ticker ending with .NS
const createStock = (ticker: string): Stock => ({
    ticker,
    name: ticker.replace(".NS", ""),
});

// Category Data Lists (All explicitly including .NS)
const Large_Caps = [
    "ADANIENT.NS", "ADANIPORTS.NS", "APOLLOHOSP.NS", "ASIANPAINT.NS", "AXISBANK.NS",
    "BAJAJ-AUTO.NS", "BAJFINANCE.NS", "BAJAJFINSV.NS", "BEL.NS", "BHARTIARTL.NS",
    "CIPLA.NS", "COALINDIA.NS", "DRREDDY.NS", "EICHERMOT.NS", "ETERNAL.NS",
    "GRASIM.NS", "HCLTECH.NS", "HDFCBANK.NS", "HDFCLIFE.NS", "HEROMOTOCO.NS",
    "HINDALCO.NS", "HINDUNILVR.NS", "ICICIBANK.NS", "INDUSINDBK.NS", "INFY.NS",
    "ITC.NS", "JIOFIN.NS", "JSWSTEEL.NS", "KOTAKBANK.NS", "LT.NS",
    "M&M.NS", "MARUTI.NS", "MAXHEALTH.NS", "NESTLEIND.NS", "NTPC.NS",
    "ONGC.NS", "POWERGRID.NS", "RELIANCE.NS", "SBILIFE.NS", "SBIN.NS",
    "SHRIRAMFIN.NS", "SUNPHARMA.NS", "TATACONSUM.NS", "TATASTEEL.NS", "TCS.NS",
    "TECHM.NS", "TITAN.NS", "TRENT.NS", "ULTRACEMCO.NS", "WIPRO.NS",
];

const Mid_Caps = [
    "APLAPOLLO.NS", "AUBANK.NS", "ALKEM.NS", "ASHOKLEY.NS", "AUROPHARMA.NS",
    "BALKRISIND.NS", "BANDHANBNK.NS", "BANKINDIA.NS", "BHARATFORG.NS", "BHEL.NS",
    "BIOCON.NS", "CGPOWER.NS", "COFORGE.NS", "COLPAL.NS", "CONCOR.NS",
    "CUMMINSIND.NS", "DABUR.NS", "DALBHARAT.NS", "DELHIVERY.NS", "DIXON.NS",
    "FEDERALBNK.NS", "FORTIS.NS", "GLENMARK.NS", "GODREJPROP.NS", "HINDPETRO.NS",
    "HINDZINC.NS", "HUDCO.NS", "IDFCFIRSTB.NS", "INDHOTEL.NS", "INDIANB.NS",
    "INDUSTOWER.NS", "JINDALSTEL.NS", "JSWENERGY.NS", "KALYANKJIL.NS", "LTF.NS",
    "LICHSGFIN.NS", "LUPIN.NS", "MANAPPURAM.NS", "MRF.NS", "MUTHOOTFIN.NS",
    "NATIONALUM.NS", "NHPC.NS", "NMDC.NS", "OBEROIRLTY.NS", "OIL.NS",
    "PAGEIND.NS", "PATANJALI.NS", "PERSISTENT.NS", "PETRONET.NS", "PHOENIXLTD.NS",
];

const Small_Caps = [
    "AEGISLOG.NS", "AFFLE.NS", "ARE&M.NS", "AMBER.NS", "ANANDRATHI.NS",
    "APARINDS.NS", "ASTERDM.NS", "BLS.NS", "BSOFT.NS", "CASTROLIND.NS",
    "CEATLTD.NS", "CENTRALBK.NS", "CESC.NS", "CYIENT.NS", "ECLERX.NS",
    "ELECON.NS", "EMAMILTD.NS", "ENGINERSIN.NS", "EXIDEIND.NS", "FIVESTAR.NS",
    "GESHIP.NS", "GODFRYPHLP.NS", "GRINDWELL.NS", "HFCL.NS", "IDBI.NS",
    "IEX.NS", "IIFL.NS", "INOXWIND.NS", "IRCON.NS", "JUBLFOOD.NS",
    "KAYNES.NS", "KFINTECH.NS", "KNRCON.NS", "KPIL.NS", "LATENTVIEW.NS",
    "MAHSEAMLES.NS", "MCX.NS", "MEDPLUS.NS", "MOIL.NS", "NBCC.NS",
    "NCC.NS", "PRAJIND.NS", "RBLBANK.NS", "REDINGTON.NS", "RITES.NS",
    "SONATSOFTW.NS", "TEJASNET.NS", "TRIDENT.NS",
];

const CATEGORIES: Category[] = [
    {
        title: "Large Cap Stocks",
        stocks: Large_Caps.map(createStock),
    },
    {
        title: "Mid Cap Stocks",
        stocks: Mid_Caps.map(createStock),
    },
    {
        title: "Small Cap Stocks",
        stocks: Small_Caps.map(createStock),
    },
];

function Stocks() {
    return (
        <div className="stocks-container">
            <header className="stocks-header">
                <h2 className="stocks-title">Stock Market Dashboard</h2>
                <p className="stocks-subtitle">Analyze market segments by market capitalization</p>
            </header>

            <div className="categories-grid">
                {CATEGORIES.map((category) => {
                    const params = new URLSearchParams();
                    category.stocks.forEach((stock) => params.append("tickers", stock.ticker));

                    return (
                        <div key={category.title} className="category-card">
                            <div className="category-header">
                                <h3 className="category-title">{category.title}</h3>
                                <Link
                                    to={`/data-analysis/multi?${params.toString()}&category=${encodeURIComponent(category.title)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-analysis"
                                >
                                    Get Full Stock Analysis
                                </Link>
                            </div>

                            <ul className="stock-list">
                                {category.stocks.map((stock) => (
                                    <li key={stock.ticker}>
                                        <Link
                                            to={`/data-analysis/${encodeURIComponent(stock.ticker)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="stock-item-link"
                                        >
                                            <span className="stock-name">{stock.name}</span>
                                            <span className="stock-ticker">{stock.ticker}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Stocks;