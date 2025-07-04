import { OverviewProps } from "../types/utils";

export default function LeaderCard( {civ}: OverviewProps) {

    return(
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
    );
}