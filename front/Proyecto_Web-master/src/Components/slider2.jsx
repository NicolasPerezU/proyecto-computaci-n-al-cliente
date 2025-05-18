import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


import car1 from '../img/carrusel1.jpg';
import car2 from '../img/carrusel2.jpg';
import car3 from '../img/carrusel3.jpg';
import car4 from '../img/carrusel4.jpg';
import car5 from '../img/carrusel5.jpg';
import car6 from '../img/carrusel6.jpg';
import car7 from '../img/carrusel7.jpg';
import car8 from '../img/carrusel8.jpg';
import car9 from '../img/carrusel9.jpg';
import car10 from '../img/carrusel10.jpg';

function HeaderSlider() {
    return (
        <header className="text-white shadow" style={{ height: '700px' }}>

            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                loop={true}
                className="h-full"
            >
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${car1})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${car2})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                       
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${car3})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${car4})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${car5})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                       
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${car6})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${car7})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                       
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${car8})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                       
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${car9})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                       
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${car10})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                       
                    </div>
                </SwiperSlide>
                
            </Swiper>
        </header>
    );
}

export default HeaderSlider;
