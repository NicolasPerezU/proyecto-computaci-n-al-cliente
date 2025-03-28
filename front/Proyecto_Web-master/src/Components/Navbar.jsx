import React, { useState } from 'react';
import Registro from './Registro';
import Login from './Log in';

function Navbar({ onReservasClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [showInicioSesion, setShowInicioSesion] = useState(false);
  
  const emailRegistrado = 'usuario@ejemplo.com';
  const contraseñaRegistrada = 'contraseña123';

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-black p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <a href="#Inicio" className="text-white text-3xl font-bold">
            Mambo Kings
          </a>
          <div className="hidden md:flex space-x-6">
            <a href="#Inicio" className="text-gray-300 hover:text-white transition duration-200">
              Inicio
            </a>
            <a href="#SobreNosotros" className="text-gray-300 hover:text-white transition duration-200">
              Sobre nosotros
            </a>
            <a href="#menu" className="text-gray-300 hover:text-white transition duration-200">
              Menú
            </a>
            <a href="#galeria" className="text-gray-300 hover:text-white transition duration-200">
              Galeria de imagenes
            </a>
            <a
              href="#Reservas"
              onClick={(e) => {
                e.preventDefault();
                onReservasClick();
              }}
              className="text-gray-300 hover:text-white transition duration-200"
            >
              Reservas
            </a>
          </div>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          <button
            onClick={() => setShowRegistro(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-400 transition"
          >
            Registro
          </button>
          <Registro isVisible={showRegistro} onClose={() => setShowRegistro(false)} />

          <button
            onClick={() => setShowInicioSesion(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-400 transition"
          >
            Inicio de sesión
          </button>
          <Login
            isVisible={showInicioSesion}
            onClose={() => setShowInicioSesion(false)}
            emailRegistrado={emailRegistrado}
            contraseñaRegistrada={contraseñaRegistrada}
          />
        </div>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 p-4">
          <a href="#Inicio" className="block text-gray-300 hover:text-white p-2 transition duration-200">
            Inicio
          </a>
          <a href="#SobreNosotros" className="block text-gray-300 hover:text-white p-2 transition duration-200">
            Sobre nosotros
          </a>
          <a href="#Menu" className="block text-gray-300 hover:text-white p-2 transition duration-200">
            Menú
          </a>
          <a
            href="#Reservas"
            onClick={(e) => {
              e.preventDefault();
              onReservasClick();
            }}
            className="block text-gray-300 hover:text-white p-2 transition duration-200"
          >
            Reservas
          </a>
          <button
            onClick={() => setShowRegistro(true)}
            className="block w-full bg-green-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-green-400 transition"
          >
            Registro
          </button>
          <Registro isVisible={showRegistro} onClose={() => setShowRegistro(false)} />

          <button
            onClick={() => setShowInicioSesion(true)}
            className="block w-full bg-blue-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-blue-400 transition"
          >
            Inicio de sesión
          </button>
          <Login
            isVisible={showInicioSesion}
            onClose={() => setShowInicioSesion(false)}
            emailRegistrado={emailRegistrado}
            contraseñaRegistrada={contraseñaRegistrada}
          />
        </div>
      )}
    </nav>
  );
}

export default Navbar;
