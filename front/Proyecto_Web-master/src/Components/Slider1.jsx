import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


import slideImage1 from '../img/imagen1.jpg';
import slideImage2 from '../img/imagen2.jpg';
import slideImage3 from '../img/imagen3.jpg';

function HeaderSlider() {
    const navigate = useNavigate();

  const scrollToMenu = () => {
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
    return (
        <header className="h-screen text-white shadow">
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
                            backgroundImage: `url(${slideImage1})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="relative container mx-auto text-center z-10">
                            <h2 className="mb-0 font-bold text-xl md:text-2xl drop-shadow-lg">Bienvenido a</h2>
                            <h1 className="mb-5 font-bold text-5xl md:text-6xl drop-shadow-lg">El Rey del Mambo</h1>
                            <button onClick={scrollToMenu} className="bg-orange-700 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
                                Nuestro Menú
                            </button>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${slideImage2})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="relative container mx-auto text-center z-10">
                            <h2 className="mb-0 font-bold text-xl md:text-2xl drop-shadow-lg">Disfruta de</h2>
                            <h1 className="mb-5 font-bold text-5xl md:text-6xl drop-shadow-lg">Nuestras Especialidades</h1>
                            <button onClick={scrollToMenu} className="bg-orange-700 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
                                Ver Menú
                            </button>
                        </div>
                    </div>
                </SwiperSlide>
                <SwiperSlide>
                    <div
                        className="relative h-full flex items-center justify-center transition-transform duration-500 transform hover:scale-105"
                        style={{
                            backgroundImage: `url(${slideImage3})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className="absolute inset-0 bg-black opacity-50"></div>
                        <div className="relative container mx-auto text-center z-10">
                            <h2 className="mb-0 font-bold text-xl md:text-2xl drop-shadow-lg">Prueba</h2>
                            <h1 className="mb-5 font-bold text-5xl md:text-6xl drop-shadow-lg">Nuestros Sabores Únicos</h1>
                            <button onClick={scrollToMenu} className="bg-orange-700 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
                                Explorar Menú
                            </button>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </header>
    );
}

export default HeaderSlider;
