import React from 'react';
import Slider from '../Components/Slider1';


import imagen7 from '../img/imagen4.jpg'
import favoritos from '../img/favoritos.jpg';
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


function Inicio() {
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
          {/* Platillo 1 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
            <img src={producto1} alt="Platillo 1" className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold">Pollo Asado Entero</h3>
            <p className="text-sm text-gray-400">Acompañado de papas francesas, ensalada, arroz, arepas, plátanos fritos.</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-50">$35.000 COP</p>
              <button className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition">Comprar</button>
            </div>
          </div>

          {/* Platillo 2 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
            <img src={producto2} alt="Platillo 2" className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold">Pollo Broaster Entero</h3>
            <p className="text-sm text-gray-400">Acompañado de papas francesas, ensalada, arroz, arepas, plátanos fritos.</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-50">$30.000 COP</p>
              <button className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition">Comprar</button>
            </div>
          </div>

          {/* Platillo 3 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
            <img src={producto3} alt="Platillo 3" className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold">Alitas de Pollo</h3>
            <p className="text-sm text-gray-400">Acompañadas con maduritos, ensalada, papa salada y dos salsas a elección</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-50">$18.000 COP</p>
              <button className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition">Comprar</button>
            </div>
          </div>

          {/* Otros platillos pueden seguir el mismo patrón */}

          {/* Platillo 4 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
            <img src={producto4} alt="Platillo 3" className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold">Brochetas de Pollo</h3>
            <p className="text-sm text-gray-400">Pinchos de pollo asado a la parrilla con vegetales, marinados en salsa de ajo y limón.</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-50">$22.000 COP</p>
              <button className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition">Comprar</button>
            </div>
          </div>

          {/* Platillo 5 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
            <img src={producto5} alt="Platillo 3" className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold">Costillas BBQ</h3>
            <p className="text-sm text-gray-400">Costillas de cerdo cocidas lentamente y bañadas en salsa barbacoa acompañadas de papas francesas.</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-50">$25.000 COP</p>
              <button className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition">Comprar</button>
            </div>
          </div>

          {/* Platillo 6 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
            <img src={producto6} alt="Platillo 3" className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold">Churrasco de Pollo</h3>
            <p className="text-sm text-gray-400">Filetes de pechuga de pollo marinados y asados, servidos con chimichurri.</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-50">$25.000 COP</p>
              <button className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition">Comprar</button>
            </div>
          </div>

          {/* Platillo 7 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
            <img src={producto7} alt="Platillo 3" className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold">Combo fiesta (6 personas)</h3>
            <p className="text-sm text-gray-400">Dos pollos asados enteros con seis acompañamientos, salsas y bebidas.</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-50">$65.000 COP</p>
              <button className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition">Comprar</button>
            </div>
          </div>


          {/* Platillo 8 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
            <img src={producto8} alt="Platillo 3" className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold">Combo de pollo frito (4 personas)</h3>
            <p className="text-sm text-gray-400">12 piezas de pollo frito, acompañadas de patatas fritas, ensalada de col y refrescos.</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-50">$70.000 COP</p>
              <button className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition">Comprar</button>
            </div>
          </div>

            {/* Platillo 9 */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 text-white">
            <img src={producto9} alt="Platillo 3" className="rounded-lg mb-4" />
            <h3 className="text-xl font-semibold">Combo Tacos de Pollo</h3>
            <p className="text-sm text-gray-400">Tres tacos de pollo desmenuzado, con guacamole, salsa picante y cebolla.</p>
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-50">$30.000 COP</p>
              <button className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition">Comprar</button>
            </div>
          </div>











        </div>
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
