import { useEffect, useState } from 'react';
import { fetchCiv } from '../../api/hallofleaders';
import { useParams } from 'react-router';
import Loading from '../../components/Loading';
import { Civ } from '../../types/utils'

export default function Overview() {
    const { civilization } = useParams<{ civilization: string }>();
    const [civ, civStatus] = useState< Civ | null>(null);

    useEffect(() => {
        const getCiv = async () => {
            if (!civilization) return;
            const data = await fetchCiv(civilization);
            civStatus(data);
        };

        getCiv();
    }, []);

    return(
        <>
            { civ ? (
                <div className="flex flex-col items-center justify center">
                    <h1 className="text-3xl">{civ.civ.name}</h1>
                    <p className="text-3xl">{civ.strategy.general}</p>
                </div>
            ) : (
                <Loading />
            )}
        </>       
    );
}