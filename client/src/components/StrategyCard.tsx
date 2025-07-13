import { OverviewProps } from "../utils/types";
import { Info } from 'lucide-react';

export default function StrategyCard({ civ }: OverviewProps) {

    function getVictoryStyle(victory: string){
        switch (victory) {
            case "Domination":
                return "bg-red-700"
            case "Science":
                return "bg-sky-600";
            case "Diplomatic":
                return "bg-green-600";
            case "Cultural":
                return "bg-purple-600";
            default:
                return "bg-gray-400";
        }
    }

    return(
        <div className="relative flex flex-col justify-center items-center max-w-80 md:max-w-96 2xl:max-w-2xl lg:max-w-lg w-full mt-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
            <div className="absolute top-3 right-3 md:top-4 md:right-4 lg:top-6 lg:right-6 text-secondary group">
                <Info className="size-7 md:size-8 lg:size-9 text-gray-500 hover:text-gray-700 transition-colors"/>
                <div className="absolute right-10 lg:right-14 top-0 z-10 
                                bg-white text-gray-800 shadow-lg rounded-xl p-4 w-48
                                opacity-0 group-hover:opacity-100 
                                pointer-events-none group-hover:pointer-events-auto
                                transition-opacity duration-300">
                    <p className="text-center text-md md:text-lg">
                        A strategy forged by <strong>advanced AI</strong>, your path to victory echoes the wisdom of the ancients.
                        </p>
                </div>
            </div>
            <h3 className="text-3xl md:text-4xl">Victory Focus</h3>
            <p className="text-lg md:text-2xl mt-4">Preferred Path</p>
            <div className={`px-4 py-1 rounded-full font-semibold text-md md:text-lg mt-4 ${getVictoryStyle(civ.strategy.primaryVictory)}`}>
                <p className="text-md md:text-lg">{civ.strategy.primaryVictory} Victory</p>
            </div>
            <p className="text-lg md:text-2xl mt-4">Alternative Path</p>
            <div className={`px-4 py-1 rounded-full font-semibold text-md md:text-lg mt-4 ${getVictoryStyle(civ.strategy.secondaryVictory)}`}>
                <p className="text-md md:text-lg">{civ.strategy.secondaryVictory} Victory</p>
            </div>
            <h3 className="text-3xl md:text-4xl mt-4">How to Win</h3>
            <p className="text-sm md:text-lg text-justify">{civ.strategy.general}</p>
            <h3 className="text-3xl md:text-4xl mt-4">How to Counter</h3>
            <p className="text-sm md:text-lg text-justify">{civ.strategy.counter}</p>
        </div>
    );
}