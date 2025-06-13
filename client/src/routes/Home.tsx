import React from 'react';
import { useEffect, useState } from 'react';
import fetchHealth from '../api/health';
import { HealthResponse } from '../types/utils';

export default function Home() {

    const [status, setStatus] = useState<HealthResponse | null>(null);

    useEffect(() => {
        const checkHealth = async () => {
            const data = await fetchHealth();
            console.log(data.status);
            console.log(data.mongoStatus);
            setStatus(data);
        };
        checkHealth();
    }, []);

    return (
        <div className="h-full w-full p-4">
        <h1 className="text-5xl text-center text-primary mb-16">Civ Copilot</h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-16 px-6">
            <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-surface rounded-full flex items-center justify-center shadow-md text-3xl">
                👤
            </div>
            <p className="mt-4 text-lg text-secondary font-medium">The Hall of Leaders</p>
            </div>

            <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-surface rounded-full flex items-center justify-center shadow-md text-3xl">
                ⚔️
            </div>
            <p className="mt-4 text-lg text-secondary font-medium">The War Room</p>
            </div>

            <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-surface rounded-full flex items-center justify-center shadow-md text-3xl">
                ⚗️
            </div>
            <p className="mt-4 text-lg text-secondary font-medium">The Scholar's Table</p>
            </div>
        </div>
        {status ? (
        <div className="mt-8 text-center text-3xl text-green-400">
            <p>{status.status}</p>
            <p>{status.mongoStatus}</p>
            <p>{status.timestamp}</p>
        </div>
        ) : (
        <div className="mt-8 text-center text-3xl text-green-400">Loading health status…</div>
        )}
        </div>
    );
};
