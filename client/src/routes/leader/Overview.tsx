import { useEffect, useState } from 'react';
import { fetchCiv } from '../../api/hallofleaders';
import { useParams } from 'react-router';
import Loading from '../../components/Loading';
import History from '../../components/History';
import { Civ } from '../../types/utils';

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
        <>
            {civ ?
                (
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
                        <div className="flex flex-col justify-center items-center max-w-80 md:max-w-96 w-full mt-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
                            <h3 className="text-3xl md:text-4xl text-center">{civ.leader.name}</h3>
                            <img src={civ.leader.icon} alt={civ.leader.name} className="size-32 md:size-36 lg:size-40 mt-1"/>
                            <div className="flex justify-center items-center">
                                <p className="text-md md:text-lg pr-1.5">{civ.leader.subtitle}</p>
                                <img src={civ.civ.icon} alt={civ.civ.slug} className="size-6 md:size-8"/>
                            </div>
                            <p className="text-md md:text-lg">{civ.leader.lived}</p>
                            <p className="text-md md:text-xl mt-2">{civ.leader.leaderTrait.name}</p>
                            <p className="text-sm md:text-lg text-justify">{civ.leader.leaderTrait.effect}</p>
                        </div>
                        <h2 className="text-3xl md:text-4xl mt-10">Unique Advantages</h2>
                        {/* unique units */}
                        <>
                            {civ.civ.uniqueUnits.length > 0 ? (
                                civ.civ.uniqueUnits.map(unit => (
                                    <div className="flex flex-col 2xl:flex-row 2xl:max-w-3xl 2xl:items-start justify-center items-center max-w-80 md:max-w-96 w-full mt-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
                                        <div className="flex flex-col justify-center items-center 2xl:basis-2/5">
                                            <h3 className="text-3xl md:text-4xl text-center">{unit.name}</h3>
                                            <img src={unit.icon} alt={unit.name} className="size-32 md:size-36 lg:size-40 mt-2 mb-2"/>
                                            <p className="text-md md:text-lg">{unit.prereqTech.era}</p>
                                            <div className="flex justify-center items-center">
                                                <p className="text-md md:text-lg pr-1.5">Requires {unit.prereqTech.name}</p>
                                                <img src={unit.prereqTech.icon} alt={unit.prereqTech.name} className="size-6 md:size-8"/>
                                            </div>
                                        </div>
                                        <div className="flex flex-col justify-center items-center 2xl:basis-3/5 2xl:pl-6">
                                            <p className="text-md md:text-xl mt-2">Information</p>
                                            <p className="text-sm md:text-lg text-justify">{unit.info}</p>
                                            <p className="text-md md:text-xl mt-2">Strategy</p>
                                            <p className="text-sm md:text-lg text-justify">{unit.strategy}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (<></>) }
                        </>
                        {/* unique buildings */}
                        <>
                            {civ.civ.uniqueBuildings.length > 0 ? (
                                civ.civ.uniqueBuildings.map(building => (
                                    <div className="flex flex-col 2xl:flex-row 2xl:max-w-3xl 2xl:items-start justify-center items-center max-w-80 md:max-w-96 w-full my-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
                                        <div className="flex flex-col justify-center items-center 2xl:basis-2/5">
                                            <h3 className="text-3xl md:text-4xl text-center">{building.name}</h3>
                                            <img src={building.icon} alt={building.name} className="size-32 md:size-36 lg:size-40 mt-4 mb-2"/>
                                            {building.prereqTech?.era != null ? (
                                                <>
                                                <p className="text-md md:text-lg">building.prereqTech.era</p>
                                                <div className="flex justify-center items-center">
                                                    <p className="text-md md:text-lg pr-1.5">Requires {building.prereqTech.name}</p>
                                                    <img src={building.prereqTech.icon} alt={building.prereqTech.name} className="size-6 md:size-8"/>
                                                </div>
                                                </>
                                            ) : (<p className="text-md md:text-lg">Requires No Research</p>)
                                            }
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
                                        </div>
                                        <div className="flex flex-col justify-center items-center 2xl:basis-3/5 2xl:pl-6">
                                            <p className="text-md md:text-xl mt-2">Information</p>
                                            <p className="text-sm md:text-lg text-justify">{building.info}</p>
                                            {building.strategy ? 
                                            (<><p className="text-md md:text-xl mt-2">Strategy</p>
                                            <p className="text-sm md:text-lg text-justify">{building.strategy}</p></>)
                                            : (<></>)
                                            }
                                        </div>
                                    </div>
                                ))
                            ) : (<></>) }
                        </>
                        </div>
                        {/* section 2 */}
                        <div className="flex flex-col justify-center items-center">
                            {/*strategy card */}
                            <h2 className="text-3xl md:text-4xl">Strategy</h2>
                            <div className="flex flex-col justify-center items-center max-w-80 md:max-w-96 2xl:max-w-2xl lg:max-w-lg w-full mt-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
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
                        </div>
                    </div>
                    {/* civilization history */}
                    <History civ={civ}/>
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