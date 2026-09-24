import api from "./api";

export interface EmaDynamicsPoint {
    Date: string;
    ema_velocity: number;
    ema_acceleration: number;
}

export interface DataAnalysisResponse {
    ema_dynamics: EmaDynamicsPoint[];
}

export interface DataAnalysisMultiResponse {
    ema_dynamics: Record<string, EmaDynamicsPoint[]>;
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