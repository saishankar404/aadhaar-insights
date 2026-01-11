import axios from 'axios';

const API_BASE_URL = 'http://localhost:8005/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface NationalSummary {
    total_enrolments: number;
    average_saturation: number;
    national_risk_index: number;
    high_risk_districts: number;
}

export interface DistrictMetric {
    district: string;
    state: string;
    risk_score: number;
    risk_level: string;
    asr: number;
    uii?: number;
    tds?: number;
    aepg?: number;
    cbcg?: number;
}

export const fetchNationalSummary = async (): Promise<NationalSummary> => {
    const response = await api.get('/national/summary');
    return response.data;
};

export const fetchMapData = async (month?: string): Promise<DistrictMetric[]> => {
    const response = await api.get('/map', { params: { month } });
    return response.data;
};

export const fetchTopRiskDistricts = async (limit: number = 10): Promise<DistrictMetric[]> => {
    const response = await api.get('/risk/top', { params: { limit } });
    return response.data;
};

export const fetchDistrictDetails = async (districtId: string) => {
    const response = await api.get(`/district/${districtId}`);
    return response.data;
}

export const fetchDistrictTrends = async (districtId: string) => {
    const response = await api.get(`/district/${districtId}/trends`);
    return response.data;
}
