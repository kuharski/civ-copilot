import axios from 'axios';
import { CivPreview } from '../types/utils';
import { Civ } from '../types/utils';

const api = axios.create({
  baseURL: '/api',
  timeout: 1000,
  headers: {'Content-Type': 'application/json'}
});

export async function fetchCivPreview (): Promise<CivPreview[]> {
    const response = await api.get<CivPreview[]>('/civs');
    return response.data;
};

export async function fetchCiv(id: string): Promise<Civ | null> {
    try{
        const response = await api.get<Civ>('/civs/' + id);
        return response.data;
    } catch (error) {
        return null;
    }
};