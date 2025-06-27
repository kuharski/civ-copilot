import api from './axios';
import { CivPreview } from '../types/utils';
import { Civ } from '../types/utils';

export async function fetchCivPreview (): Promise<CivPreview[]> {
    const response = await api.get<CivPreview[]>('/civs');
    return response.data;
};

export async function fetchCiv(id: string): Promise<Civ> {
    const response = await api.get<Civ>('/civs/' + id);
    return response.data;
};