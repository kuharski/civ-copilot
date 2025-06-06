import React from 'react';
import { useEffect, useState } from 'react';
import fetchHealth from '../api/health';
import { HealthResponse } from '../types/utils';

const LandingPage = () => {

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
        <div className="relative min-h-screen bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')] bg-repeat bg-[#f5f0e6] font-serif">
        <button className="absolute top-6 right-8 bg-yellow-900 text-white px-4 py-2 rounded-md shadow-md">
            Sign In
        </button>
        <h1 className="text-5xl text-center text-yellow-900 mb-16">Civ Copilot</h1>

        <div className="flex flex-col md:flex-row justify-center items-center gap-16 px-6">
            <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-yellow-200 rounded-full flex items-center justify-center shadow-md text-3xl">
                👤
            </div>
            <p className="mt-4 text-lg text-yellow-900 font-medium">The Hall of Leaders</p>
            </div>

            <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-yellow-200 rounded-full flex items-center justify-center shadow-md text-3xl">
                ⚔️
            </div>
            <p className="mt-4 text-lg text-yellow-900 font-medium">The War Room</p>
            </div>

            <div className="flex flex-col items-center">
            <div className="w-28 h-28 bg-yellow-200 rounded-full flex items-center justify-center shadow-md text-3xl">
                ⚗️
            </div>
            <p className="mt-4 text-lg text-yellow-900 font-medium">The Scholar's Table</p>
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

export default LandingPage;
