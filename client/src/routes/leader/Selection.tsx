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
    <h1>{JSON.stringify(civs[1])}</h1>
         
    );

}
