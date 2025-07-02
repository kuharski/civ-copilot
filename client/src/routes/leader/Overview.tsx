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

    const yieldConfigs = [
        { tag: "gold", label: "Gold", icon: "/icons/gold.png" },
        { tag: "production", label: "Production", icon: "/icons/production.png" },
        { tag: "science", label: "Science", icon: "/icons/science.png" },
        { tag: "culture", label: "Culture", icon: "/icons/culture.png" },
        { tag: "food", label: "Food", icon: "/icons/food.png" },
        { tag: "faith", label: "Faith", icon: "/icons/faith.png" },
        { tag: "happiness", label: "Happiness", icon: "/icons/happiness.png" },
    ];

    return(
        <>
            {civ ? 
                (
                <div className="flex flex-col items-center justify-center text-text">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-3xl md:text-5xl lg:text-6xl mt-12 mb-4">Strategic Overview</h1>
                        <h1 className="text-primary text-3xl md:text-5xl lg:text-6xl">{civ.civ.name}</h1>
                    </div>
                    <h2 className="text-2xl md:text-4xl mt-10">Leader</h2>
                    <div className="flex flex-col justify-center items-center max-w-80 md:max-w-96 w-full my-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
                        <h3 className="text-2xl md:text-4xl">{civ.leader.name}</h3>
                        <img src={civ.leader.icon} alt={civ.leader.name} className="size-32 md:size-36 lg:size-40 mt-1"/>
                        <div className="flex justify-center items-center">
                            <p className="text-md md:text-xl pr-1.5">{civ.leader.subtitle}</p>
                            <img src={civ.civ.icon} alt={civ.civ.slug} className="size-6 md:size-8"/>
                        </div>
                        <p className="text-md md:text-xl">{civ.leader.lived}</p>
                        <p className="text-md md:text-xl mt-2">{civ.leader.leaderTrait.name}</p>
                        <p className="text-sm md:text-lg text-justify">{civ.leader.leaderTrait.effect}</p>
                    </div>

                    <h2 className="text-2xl md:text-4xl">Unique Advantages</h2>
                    <>
                        {civ.civ.uniqueUnits.length > 0 ? (
                            civ.civ.uniqueUnits.map(unit => (
                                <div className="flex flex-col justify-center items-center max-w-80 md:max-w-96 w-full my-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
                                    <h3 className="text-2xl md:text-4xl">{unit.name}</h3>
                                    <img src={unit.icon} alt={unit.name} className="size-32 md:size-36 lg:size-40 mt-2"/>
                                    <p className="text-md md:text-xl">{unit.prereqTech.era}</p>
                                    <div className="flex justify-center items-center">
                                        <p className="text-md md:text-xl pr-1.5">Requires {unit.prereqTech.name}</p>
                                        <img src={unit.prereqTech.icon} alt={unit.prereqTech.name} className="size-6 md:size-8"/>
                                    </div>
                                    <p className="text-md md:text-xl mt-2">Information</p>
                                    <p className="text-sm md:text-lg text-justify">{unit.info}</p>
                                    <p className="text-md md:text-xl mt-2">Strategy</p>
                                    <p className="text-sm md:text-lg text-justify">{unit.strategy}</p>
                                </div>
                            ))
                        ) : (<></>) }
                    </>
                    <>
                        {civ.civ.uniqueBuildings.length > 0 ? (
                            civ.civ.uniqueBuildings.map(building => (
                                <div className="flex flex-col justify-center items-center max-w-80 md:max-w-96 w-full my-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
                                    <h3 className="text-2xl md:text-4xl">{building.name}</h3>
                                    <img src={building.icon} alt={building.name} className="size-32 md:size-36 lg:size-40 mt-2"/>
                                    <p className="text-md md:text-xl">{building.prereqTech.era}</p>
                                    <div className="flex justify-center items-center">
                                        <p className="text-md md:text-xl pr-1.5">Requires {building.prereqTech.name}</p>
                                        <img src={building.prereqTech.icon} alt={building.prereqTech.name} className="size-6 md:size-8"/>
                                    </div>
                                    <>
                                    {Object.values(building.yields).some(val => val > 0) ? (
                                        <>
                                        <p className="text-md md:text-xl mt-2">Yields</p>
                                        <div className="flex flex-wrap justify-center gap-2">
                                            {yieldConfigs.map(({tag, label, icon}) => {
                                                const val = building.yields[tag as keyof typeof building.yields];
                                                if (val > 0) {
                                                    return (
                                                        <div key={tag} className="flex items-center">
                                                            <p className="text-md pr-1.5">+{val}</p>
                                                            <img src={icon} alt={label} className="size-4 md:size-5"/>
                                                        </div>
                                                    );
                                                }
                                                return (null);
                                            })}
                                        </div>
                                        </>
                                        ) : (<></>)
                                    }
                                    </>
                                    <p className="text-md md:text-xl mt-2">Information</p>
                                    <p className="text-sm md:text-lg text-justify">{building.info}</p>
                                    <p className="text-md md:text-xl mt-2">Strategy</p>
                                    <p className="text-sm md:text-lg text-justify">{building.strategy}</p>
                                </div>
                            ))
                        ) : (<></>) }
                    </> 
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