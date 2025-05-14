import React from 'react';
import Slider from '../Components/Slider1';
import Empleados from '../Components/Empleados';
import Promociones from '../Components/Promociones'; 
import imagen7 from '../img/imagen4.jpg';
import Slider2 from './slider2';
import producto1 from '../img/producto1.jpg';
import producto2 from '../img/producto2.jpg';
import producto3 from '../img/producto3.jpg';
import producto4 from '../img/producto4.jpg';
import producto5 from '../img/producto5.jpg';
import producto6 from '../img/producto6.jpg';
import producto7 from '../img/producto7.jpg';
import producto8 from '../img/producto8.jpg';
import producto9 from '../img/producto9.jpg';
import { useCart } from '../Hooks/Carrito';

// >>> MOVE THE PRODUCTS ARRAY HERE, OUTSIDE THE Inicio FUNCTION <<<
export const products = [
    {
        _id: 'pollo-asado-entero', // Use a unique ID for the product
        nombre: 'Pollo Asado Entero',
        descripcion: 'Acompañado de papas francesas, ensalada, arroz, arepas, plátanos fritos.',
        precio: 35000,
        imagen: producto1,
    },
    {
        _id: 'pollo-broaster-entero',
        nombre: 'Pollo Broaster Entero',
        descripcion: 'Acompañado de papas francesas, ensalada, arroz, arepas, plátanos fritos.',
        precio: 30000,
        imagen: producto2,
    },
    {
         _id: 'alitas-de-pollo',
        nombre: 'Alitas de Pollo',
        descripcion: 'Acompañadas con maduritos, ensalada, papa salada y dos salsas a elección',
        precio: 18000,
        imagen: producto3,
    },
     {
         _id: 'brochetas-de-pollo',
        nombre: 'Brochetas de Pollo',
        descripcion: 'Pinchos de pollo asado a la parrilla con vegetales, marinados en salsa de ajo y limón.',
        precio: 22000,
        imagen: producto4,
    },
    {
         _id: 'costillas-bbq',
        nombre: 'Costillas BBQ',
        descripcion: 'Costillas de cerdo cocidas lentamente y bañadas en salsa barbacoa acompañadas de papas francesas.',
        precio: 25000,
        imagen: producto5,
    },
    {
         _id: 'churrasco-de-pollo',
        nombre: 'Churrasco de Pollo',
        descripcion: 'Filetes de pechuga de pollo marinados y asados, servidos con chimichurri.',
        precio: 25000,
        imagen: producto6,
    },
     {
         _id: 'combo-fiesta-6-personas',
        nombre: 'Combo fiesta (6 personas)',
        descripcion: 'Dos pollos asados enteros con seis acompañamientos, salsas y bebidas.',
        precio: 65000,
        imagen: producto7,
    },
     {
         _id: 'combo-pollo-frito-4-personas',
        nombre: 'Combo de pollo frito (4 personas)',
        descripcion: '12 piezas de pollo frito, acompañadas de patatas fritas, ensalada de col y refrescos.',
        precio: 70000,
        imagen: producto8,
    },
    {
         _id: 'combo-tacos-pollo',
        nombre: 'Combo Tacos de Pollo',
        descripcion: 'Tres tacos de pollo desmenuzado, con guacamole, salsa picante y cebolla.',
        precio: 30000,
        imagen: producto9,
    },
    // Add other products here following the same structure
];


function Inicio() {
    // Get addItemToCart and authentication state from the context
    const { addItemToCart, loadingCart, error } = useCart(); // Added loadingCart and error for potential use

    // Function to check if the user is authenticated
    const isAuthenticated = () => {
        return !!localStorage.getItem('token');
    };

    // The products array is now defined and exported outside this function

    // Handle adding a product to the cart
    const handleAddToCart = (product) => {
        if (!isAuthenticated()) {
            // Optionally show a message to the user to log in
            alert("Por favor, inicia sesión para añadir productos al carrito.");
            return;
        }
        addItemToCart(product);
        // Optionally provide user feedback (e.g., a small notification)
        console.log(`Producto "${product.nombre}" añadido al carrito.`);
    };

    return (
        <section id="Inicio" className="home-page bg-black text-white"> {/* Ajuste de color de fondo */}
            <Slider />

            {/* Sobre Nosotros Section */}
            <div id="SobreNosotros" className="container mx-auto my-10 flex flex-wrap bg-gray-920 p-8 rounded-lg shadow-lg"> {/* Ajuste de color de fondo */}

                <div className="hidden lg:flex lg:w-1/2 justify-center">
                    <img
                        src={imagen7}
                        className="w-1/2 border-4 border-yellow-700 shadow-lg rounded-lg transition-transform transform hover:scale-105"
                        alt="about img"
                    />
                </div>
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center">
                    <h2 className="text-4xl font-extrabold uppercase mb-5">Sobre nosotros</h2>
                    <p className="mb-4 text-lg">
                    En El Rey del Mambo, nos especializamos en llevar a tu mesa el sabor inigualable del pollo asado, preparado con los más altos estándares de calidad y frescura.
                    </p>
                    <p className="mb-5 text-lg">
                    Desde nuestros inicios, nos hemos dedicado a perfeccionar cada receta, combinando ingredientes frescos y una sazón única que nos distingue.
                    </p>

                </div>
            </div>

            {/* MENÚ*/}

            <section id="menu" className="py-16 bg-gray-950">
                <div className="container mx-auto text-center">
                    <h1 className="text-4xl text-white font-bold mb-10">Nuestro Menú</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Map through the products array to render each product */}
                        {products.map((product) => (
                            <div key={product._id} className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
                                <img src={product.imagen} alt={product.nombre} className="rounded-lg mb-4" />
                                <h3 className="text-xl font-semibold">{product.nombre}</h3>
                                <p className="text-sm text-gray-400">{product.descripcion}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <p className="text-gray-50">${product.precio.toLocaleString()} COP</p> {/* Format price */}
                                    {/* Add to Cart Button */}
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                                    >
                                        Añadir al Carrito
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Empleados */}
            <div id="Empleados">
                <Empleados />
            </div> 

            {/* Promociones */}
            <div id="Promociones">
                <Promociones />
            </div>
            
            </section> 

            {/* Galería de imágenes */}
            <div id="galeria">
                <Slider2 />
            </div> 
        </section>
    );
}

export default Inicio;
