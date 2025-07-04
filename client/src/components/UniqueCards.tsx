import { OverviewProps } from "../types/utils";

export default function UniqueCards({ civ }: OverviewProps) {

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
        <>
            {civ.civ.uniqueBuildings.length > 0 ? (
                civ.civ.uniqueBuildings.map(building => (
                    <div className="flex flex-col 2xl:flex-row 2xl:max-w-3xl 2xl:items-start justify-center items-center max-w-80 md:max-w-96 w-full my-10 bg-surface rounded-3xl border-4 border-[#5b9bd5] p-6">
                        <div className="flex flex-col justify-center items-center 2xl:basis-2/5">
                            <h3 className="text-3xl md:text-4xl text-center">{building.name}</h3>
                            <img src={building.icon} alt={building.name} className="size-32 md:size-36 lg:size-40 mt-4 mb-2"/>
                            {building.prereqTech?.era != null ? (
                                <>
                                <p className="text-md md:text-lg">{building.prereqTech.era}</p>
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
        </>
    );
}