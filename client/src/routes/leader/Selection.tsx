import { useEffect, useState } from 'react';
import { CivPreview } from '../../types/utils';
import fetchCivPreview from '../../api/preview'

export default function Selection() {

    const [civs, civsStatus] = useState<CivPreview[]>([]);

    useEffect(() => {

        const getCivs = async () => {

            const data = await fetchCivPreview();
            civsStatus(data);
        };
        getCivs();
    }, []);

    return (
        <div>
            {civs.length > 0 ? (
            <h1>{civs[0].leader.name}</h1>
            ) : (
            <h1>Loading…</h1>
            )}
        </div>  
    );

}
