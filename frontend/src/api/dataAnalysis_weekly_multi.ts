import api from "./api";

export interface ClosePoint {
    date: string;
    close: number | null;
}

export interface EmaPoint {
    Date: string;
    ema_7: number;
    ema_21: number;
}

export interface MonteCarloWeeklyPoint {
    date: string;
    mc_median: number | null;
}

export interface DataAnalysisMultiResponse {
    close: Record<string, ClosePoint[]>;
    ema: Record<string, EmaPoint[]>;
    monte_carlo: Record<string, MonteCarloWeeklyPoint[]>;
}

export function getDataAnalysisMulti(tickers: string[]) {
    const params = new URLSearchParams();
    tickers.forEach((t) => params.append("tickers", t));
    return api.get<DataAnalysisMultiResponse>(`/data-analysis/multi?${params.toString()}`);
}