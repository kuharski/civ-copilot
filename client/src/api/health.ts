import api from './axios';
import { HealthResponse } from '../types/utils';

const fetchHealth = async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>('/health');
    return response.data;
};

export default fetchHealth;