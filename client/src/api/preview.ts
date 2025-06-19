import api from './axios';
import { CivPreview } from '../types/utils';

export default async function fetchCivPreview (): Promise<CivPreview[]> {
    const response = await api.get<CivPreview[]>('/civs');
    return response.data;
};