import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { CivPreview } from '../../types/utils';
import fetchCivPreview from '../../api/preview';
import Loading from '../../components/Loading'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import '../../styles/swiper.css'
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

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
    <div className="flex flex-col items-center justify-center">
        <h1 className="text-text text-3xl mt-16 mb-2">The Hall of Leaders</h1>
        <p className="text-text text-lg">Who will shape the history of tomorrow?</p>
        <div className="relative w-full max-w-xs md:max-w-xl lg:max-w-4xl mx-auto py-10 overflow-hidden">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-20" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-20" />
        {civs.length > 0 ? (
            <Swiper
                modules={[Navigation]}
                spaceBetween={-100}
                initialSlide={Math.floor(civs.length / 2)}
                loop={true}
                slidesPerView={3}
                centeredSlides
                navigation
                breakpoints={{
                    0: {
                    slidesPerView: 1,
                    spaceBetween: 0,
                    },
                    768: {
                    slidesPerView: 2,
                    spaceBetween: -60,
                    },
                    1024: {
                    slidesPerView: 3,
                    spaceBetween: -100,
                    },
                }}
                className="relative overflow-visible"
                >
                {civs.map((civ, index) => (
                    <SwiperSlide key={index}>
                    <div className="h-full flex flex-col justify-center p-6 rounded-xl text-center">
                        <Link to="/leader/overview/">
                            <div className="relative mx-auto size-40 lg:size-44 hover:cursor-pointer group">
                                <img src={civ.leader.icon} alt={civ.leader.name} className="relative w-full h-full object-cover hover:drop-shadow-[0_0_12px_rgba(255,215,0,0.8)] transition-shadow duration-300" />
                            </div>
                        </Link>
                        <h2 className="text-text text-xl md:text-2xl font-bold pb-1">{civ.leader.name}</h2>
                        <div className="flex justify-center items-center">
                            <p className="text-sm md:text-md lg:text-lg text-gray-500 pr-1.5">{civ.leader.subtitle}</p>
                            <img src={civ.civ.icon} alt={civ.civ.slug} className="size-5 md:size-6 lg:size-7" />
                        </div>
                    </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        ) : (
            <Loading />
        )}
        </div>
    </div>
  );
}
