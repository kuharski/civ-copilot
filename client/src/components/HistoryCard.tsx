import { OverviewProps } from '../utils/types';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function HistoryCard({ civ }: OverviewProps) {
    
    const [expandedSections, setExpandedSections] = useState<boolean[]>(
        civ.civ.historicalInfo.map(() => false)
    );
    
    const toggleSection = (idx: number) => {
        if (!expandedSections) return;
        setExpandedSections((prev) => {
            const newStates = [...prev];
            newStates[idx] = !newStates[idx];
            return newStates;
        });
    };

    const mid = Math.ceil(civ.civ.historicalInfo.length / 2);
    const firstHalf = civ.civ.historicalInfo.slice(0, mid);
    const secondHalf = civ.civ.historicalInfo.slice(mid);

    return(
        <div className="flex flex-col lg:flex-row w-full">
            {/* first column */}
            <div className="flex flex-col w-full items-center">
                {firstHalf.map(({heading, text}, idx) => (
                <div className="flex flex-col xl:max-w-xl justify-center items-center max-w-80 md:max-w-96 w-full mt-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] px-6 pt-6 pb-2">
                    <h3 className="text-3xl md:text-4xl text-center">{heading}</h3>
                    {expandedSections[idx] && (
                        <p className="text-sm md:text-lg text-justify ">{text}</p>
                    )}
                    <p onClick={() => toggleSection(idx)} className="text-secondary text-sm mt-2 md:text-base cursor-pointer">
                        {expandedSections[idx] ? 
                        (<ChevronUp className="" size={32} />) 
                        : (<ChevronDown className="" size={32} />)}
                    </p>
                </div>
                ))}
            </div>
            {/* second column */}
            <div className="flex flex-col w-full items-center">
                {secondHalf.map(({heading, text}, idx) => {
                    const effIdx: number = mid + idx;
                    return (
                        <div className="flex flex-col xl:max-w-xl justify-center items-center max-w-80 md:max-w-96 w-full mt-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] px-6 pt-6 pb-2">
                            <h3 className="text-3xl md:text-4xl text-center">{heading}</h3>
                            {expandedSections[effIdx] && (
                                <p className="text-sm md:text-lg text-justify">{text}</p>
                            )}
                            <p onClick={() => toggleSection(effIdx)} className="text-secondary text-sm mt-2 md:text-base cursor-pointer">
                                {expandedSections[effIdx] ? 
                                (<ChevronUp size={36} />) 
                                : (<ChevronDown size={36} />)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}