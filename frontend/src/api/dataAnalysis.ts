import api from "./api";

export interface EmaPoint {
    Date: string;
    ema_7: number;
    ema_21: number;
}

export interface OHLCRecord {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface DataAnalysisResponse {
    ohlc: OHLCRecord[];
    ema: EmaPoint[];
}

export interface DataAnalysisMultiResponse {
    ohlc: Record<string, OHLCRecord[]>;
    ema: Record<string, EmaPoint[]>;
}

export interface MonteCarloWeeklyPoint {
    date: string;
    close: number | null;
    mc_median: number | null;
    mc_5th: number | null;
    mc_95th: number | null;
}

export interface MonteCarloWeeklyResponse {
    data: MonteCarloWeeklyPoint[];
}

export function getMonteCarloWeekly(ticker: string) {
    const params = new URLSearchParams({ ticker });
    return api.get<MonteCarloWeeklyResponse>(`/data-analysis/monte-carlo-weekly?${params.toString()}`);
}

export function getDataAnalysis(ticker: string) {
    const params = new URLSearchParams({ ticker });
    return api.get<DataAnalysisResponse>(`/data-analysis?${params.toString()}`);
}

export function getDataAnalysisMulti(tickers: string[]) {
    const params = new URLSearchParams();
    tickers.forEach((t) => params.append("tickers", t));
    return api.get<DataAnalysisMultiResponse>(`/data-analysis/multi?${params.toString()}`);
}