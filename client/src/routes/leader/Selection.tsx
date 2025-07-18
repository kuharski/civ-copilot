import { useEffect, useState } from 'react';
import { fetchCivPreview } from '../../api/fetch';
import { CivPreview } from '../../utils/types';
import Loading from '../../components/Loading';
import Carousel from '../../components/Carousel';
import SearchBar from '../../components/SearchBar';

export default function Selection() {
    
    const [civs, civsState] = useState<CivPreview[]>([]);

    useEffect(() => {

        const getCivs = async () => {
            let data = await fetchCivPreview();
            let idx = data.length;
            while(idx !== 0) {
                let ranIdx = Math.floor(Math.random() * idx);
                idx--;
                [data[idx], data[ranIdx]] = [data[ranIdx], data[idx]];
            }
            civsState(data);
        };
        getCivs();
    }, []);

    return (
    <>
        {civs.length > 0 ? 
            (
            <div className="flex flex-col items-center justify-center">
                <div className="self-start mt-6 ml-6">
                    <SearchBar civs={civs}/>
                </div>
                <h1 className="text-text text-4xl md:text-5xl lg:text-6xl mt-12 mb-2">The Hall of Leaders</h1>
                <p className="text-text text-lg md:text-xl lg:text-2xl">Who will shape the history of tomorrow?</p>
                <div className="relative w-full max-w-xs md:max-w-xl lg:max-w-4xl mx-auto py-10 overflow-hidden">
                    <Carousel civs={civs} />
                </div>
            </div>
            ) : (
            <div className="flex flex-col flex-1 items-center justify-center h-full">
                <div className="flex flex-1 items-center justify-center h-full w-full"><Loading /></div>
            </div>
            )
        }
    </>
  );
}
