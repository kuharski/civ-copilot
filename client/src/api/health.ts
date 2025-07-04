import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 1000,
  headers: {'Content-Type': 'application/json'}
});

import { HealthResponse } from '../types/utils';

const fetchHealth = async (): Promise<HealthResponse | null> => {
    try{
        const response = await api.get<HealthResponse>('/health');
        return response.data;
    } catch (error) {
        return null;
    }

};

export default fetchHealth;