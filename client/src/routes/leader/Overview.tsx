import { useEffect, useState } from 'react';
import { fetchCiv } from '../../api/fetch';
import { useParams } from 'react-router';
import Loading from '../../components/Loading';
import HistoryCard from '../../components/HistoryCard';
import StrategyCard from '../../components/StrategyCard';
import UniqueCards from '../../components/UniqueCards';
import LeaderCard from '../../components/LeaderCard';
import NotFound from '../../components/NotFound';
import { Civ } from '../../utils/types';

export default function Overview() {

    const { civilization } = useParams<{ civilization: string }>();
    const [civ, civStatus] = useState< Civ | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const getCiv = async () => {
            if (!civilization) {
                setLoading(false);
                return;
            }
            setLoading(true);
            const data = await fetchCiv(civilization);
            civStatus(data);
            setLoading(false);
        };

        getCiv();
    }, []);

    if(loading) {
        return(
            <div className="flex flex-col flex-1 items-center justify-center h-full">
                <div className="flex flex-1 items-center justify-center h-full w-full"><Loading /></div>
            </div>
        );
    }

    if (!civ) {
        return (<NotFound/>);
    }

    return(
        <div className="flex flex-col items-center justify-center text-text mb-12">
            <div className="flex flex-col justify-center items-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl mt-12 mb-4 md:mb-8">Strategic Overview</h1>
                <h1 className="text-primary text-4xl md:text-5xl lg:text-6xl">{civ.civ.name}</h1>
            </div>
            <div className="lg:flex lg:flex-row justify-center lg:justify-evenly items-center lg:items-start gap-6 my-10 w-full">
                {/* section 1 */}
                <div className="flex flex-col justify-center items-center">
                    {/* leader card */}
                    <h2 className="text-3xl md:text-4xl">Leader</h2>
                    <LeaderCard civ={civ} />
                    {/* unique units */}
                    <h2 className="text-3xl md:text-4xl mt-10">Unique Advantages</h2>
                    <UniqueCards civ={civ}/>
                </div>
                {/* section 2 */}
                <div className="flex flex-col justify-center items-center">
                    {/* strategy */}
                    <h2 className="text-3xl md:text-4xl">Strategy</h2>
                    <StrategyCard civ={civ}/>
                </div>
            </div>
            {/* civilization history */}
            <h2 className="text-3xl md:text-4xl">Civilization History</h2>
            <HistoryCard civ={civ}/>
        </div>   
    );
}