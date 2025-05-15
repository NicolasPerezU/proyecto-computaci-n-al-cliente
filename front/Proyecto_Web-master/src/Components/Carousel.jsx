import { useState, useEffect } from "react";
import pollo from '../img/pollo rostizado.jpg'; 
import plato from '../img/restaurant.jpg';
import asado from '../img/rustic.jpg';

function Carousel () {

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [pollo, plato, asado]; 

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); 
        return () => clearInterval(interval);
    }, [images.length]);

    return( 
        <div className="relative w-full h-96 overflow-hidden">
            {images.map((image, index) => (
                <div
                    key={index}
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? "opacity-100" : "opacity-0"}`}
                >
                    <img src={image} alt={`Imagen ${index + 1}`} className="w-full h-full object-cover" /> 
                </div>
            ))}
        </div>
    );
}

export default Carousel;
