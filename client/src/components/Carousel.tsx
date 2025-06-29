import { Link } from 'react-router';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { PreviewProps } from '../types/utils';
import '../styles/swiper.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

export default function Carousel({ civs }: PreviewProps) {

    return(
        <>
            <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-background to-transparent z-20" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-background to-transparent z-20" />
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
                        <Link to={"/leader/overview/" + civ.civ.slug}>
                            <div className="relative mx-auto size-40 lg:size-44 hover:cursor-pointer group">
                                <img src={civ.leader.icon} alt={civ.leader.name} className="relative w-full h-full object-cover hover:drop-shadow-[0_0_12px_rgba(248,198,33,0.8)] transition-shadow duration-300" />
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
        </>
    );

}