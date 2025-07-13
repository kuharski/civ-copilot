import { Link } from 'react-router';

export default function Home() {

    return (
        <div className="flex flex-col items-center justify-center text-text">
            <h1 className="text-text text-center text-3xl md:text-5xl lg:text-6xl mt-12 mb-2">
                Your Civ V AI <br /> Strategy Companion
            </h1>
            <p className="text-text text-lg md:text-xl lg:text-2xl mt-1 md:mt-2 lg:mt-4">Your conquest awaits below.</p>
            <div className="flex flex-col md:flex-col lg:flex-row w-full justify-center items-center px-6">
                <div className="flex flex-col items-center mt-12 lg:mt-24">
                    <Link to="/science-advisor">
                        <div className="size-40 md:size-44 lg:size-60 hover:cursor-pointer">
                            <img
                                src={"/scholarstable.png"}
                                alt={"The Scholar's Table"}
                                className="rounded-full object-cover hover:drop-shadow-[0_0_12px_rgba(248,198,33,0.8)] transition-shadow duration-300"
                            />
                        </div>
                    </Link>
                    <p className="mt-6 text-2xl md:text-4xl text-accent">The Scholar's Table</p>
                </div>                
                <div className="flex flex-col items-center mt-12 lg:mt-24 lg:ml-36">
                    <Link to="/leader/selection">
                        <div className="size-40 md:size-44 lg:size-60 hover:cursor-pointer">
                            <img
                                src={"/leadershall.png"}
                                alt={"The Hall of Leaders"}
                                className="rounded-full object-cover hover:drop-shadow-[0_0_12px_rgba(248,198,33,0.8)] transition-shadow duration-300"
                            />
                        </div>
                    </Link>
                    <p className="mt-6 text-2xl md:text-4xl text-accent">The Hall of Leaders</p>
                </div>
            </div>
        </div>
    );
};
