import { useEffect, useState } from 'react';
import Loading from './Loading';

const civFillers = [
  "Consulting the Oracle...",
  "Dispatching a scout...",
  "Loading diplomatic treaties...",
  "Sharpening swords...",
  "Negotiating with city-states...",
  "Constructing the Great Library...",
  "Plotting a golden age...",
  "Translating ancient scrolls...",
  "Drafting a new social policy...",
  "Reinforcing the Great Wall...",
  "Seeking wisdom from advisors...",
  "Tuning the diplomatic AI...",
  "Surveying unexplored hexes...",
  "Praying for favorable RNG...",
  "Declaring war on the loading screen...",
  "Bribing a city-state with 250 gold...",
  "Waiting for Montezuma to finish his turn...",
  "Realizing you forgot to build libraries...",
  "Strategizing around Gandhi's inevitable nukes...",
  "Discovering archaeology... again.",
  "Spamming wonders while ignoring your military...",
  "Regretting that open borders deal with Shaka...",
  "Trying to flip a hostile city-state... diplomatically.",
  "Queuing caravans to fund your science addiction...",
  "Watching puppeted cities build Colosseums...",
  "Running out of tiles to build trading posts...",
  "Bulbing a Great Scientist too early... again.",
  "Pretending you know how tourism actually works...",
  "Scouting the fog for ancient ruins you missed...",
  "Consulting Sid Meier himself..."
];

export default function WaitingRoom() {
    const [filler, setFiller] = useState(civFillers[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            const next = civFillers[Math.floor(Math.random() * civFillers.length)];
            setFiller(next);
        }, 2500);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="relative min-h-screen flex flex-col bg-background text-text font-serif">
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
                <h1 className="text-text text-4xl md:text-5xl lg:text-6xl mt-24 mb-4">Waking the server...</h1>
                <h1 className="text-text text-lg md:text-xl lg:text-2xl mb-8">This may take up to 1 minute.</h1>
                <p className="text-text text-lg md:text-xl lg:text-2xl mb-8">{filler}</p>
                <Loading />
            </div>
        </div>
    );
}