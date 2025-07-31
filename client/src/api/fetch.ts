import axios from 'axios';

import { Civ, CivPreview, Tech, OptimalTechs } from '../utils/types';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' }
});

export async function fetchCivPreview(): Promise<CivPreview[]> {
    const response = await api.get<CivPreview[]>('/civs');
    return response.data;
};

export async function fetchCiv(id: string): Promise<Civ | null> {
    try {
        const response = await api.get<Civ>('/civs/' + id);
        return response.data;
    } catch (error) {
        return null;
    }
};

export async function fetchTechs(): Promise<Tech[]> {

    const response = await api.get<Tech[]>('/techs');
    return response.data;
}

export async function fetchOptimalOrdering(leader: string, playerScenario: string, techs: string[]): Promise<OptimalTechs> {
    // console.log(`CLIENT SENDING: ${leader} AND ${playerScenario} AND ${techs}`);
    try {
        const response = await api.post('/techs', {
            leader,
            playerScenario,
            techs
        });

        // console.log('CLIENT RECEIVED:', response.data);
        return response.data;
    } catch (err: any) {
        if (err.response) {
            console.error('RESPONSE STATUS:', err.response.status);
            console.error('RESPONSE DATA:', err.response.data);
        }
        throw err;
    }
}

export async function fetchPong(): Promise<string> {
    const response = await api.get('/ping');
    return response.data;
}