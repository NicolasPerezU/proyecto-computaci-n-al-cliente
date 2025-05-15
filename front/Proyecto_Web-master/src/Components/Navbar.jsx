import React, { useState, useEffect } from 'react';
import Registro from './Registro';
import Login from './Log in';
import { useCart } from '../Hooks/Carrito'; 
import CarritoModal from './Carritomodal';
import { useNavigate } from 'react-router-dom';


function Navbar({ onReservasClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegistro, setShowRegistro] = useState(false);
  const [showInicioSesion, setShowInicioSesion] = useState(false);
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false); 
  const [isCartModalOpen, setCartModalOpen] = useState(false);


  
  const { cart, loadingCart, error, fetchCart } = useCart();

  const getNombreUsuario = () => {
  const usuario = JSON.parse(localStorage.getItem('usuario'));
  return usuario?.nombres || 'Usuario';
};



  
  const isAuthenticated = () => {
      return !!localStorage.getItem('token');
  };

  const navigate = useNavigate();

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const currentlyAuthenticated = !!token;
    setIsAuthenticatedState(currentlyAuthenticated); 


    if (currentlyAuthenticated) {
        fetchCart(); 
    }


    
    window.addEventListener('storage', handleStorageChange);

    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); 


   
  const handleStorageChange = () => {
    const token = localStorage.getItem('token');
    const currentlyAuthenticated = !!token;

    
    if (isAuthenticatedState !== currentlyAuthenticated) { 
        setIsAuthenticatedState(currentlyAuthenticated); 
        if (currentlyAuthenticated) {
            fetchCart(); 
        } 
    }
  };


  
  const handleLoginSuccess = () => {
      setIsAuthenticatedState(true); 
      setShowInicioSesion(false); 
      fetchCart(); 
  };


  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setIsAuthenticatedState(false); 
  };

  const handleCartClick = () => {
      if (isAuthenticated()) { 
         setCartModalOpen(!isCartModalOpen);
      } else {
     
         alert("Por favor, inicia sesión para ver tu carrito.");
         setShowInicioSesion(true); 
      }
  };


  const handleCloseCartModal = () => {
      setCartModalOpen(false);
  };


  const totalItemsInCart = cart && cart.productos ? cart.productos.reduce((acc, item) => acc + item.cantidad, 0) : 0;


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

           
           {isAuthenticated() && ( 
                <div className="relative cursor-pointer" onClick={handleCartClick}>
                    
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-gray-300 hover:text-white transition duration-200"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    
                    {totalItemsInCart > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {totalItemsInCart}
                        </span>
                    )}
                </div>
           )}


          
            {isAuthenticated() ? (
  <>
          
          <button
          onClick={() => navigate('/perfil')}
          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
          >
          Hola, {getNombreUsuario()}
          </button>

        <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          >
          Cerrar Sesión
        </button>
        </>
        ) : (

            <>
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
                onLoginSuccess={handleLoginSuccess} 
              />
            </>
          )}
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
           <a href="#galeria" className="block text-gray-300 hover:text-white p-2 transition duration-200">
              Galeria de imagenes
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

           
           {isAuthenticated() && ( 
                 <div className="relative cursor-pointer block text-gray-300 hover:text-white p-2 transition duration-200" onClick={handleCartClick}>
                    <div className="flex items-center">
                         
                         <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        Carrito
                        
                        {totalItemsInCart > 0 && (
                            <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                                {totalItemsInCart}
                            </span>
                        )}
                    </div>
                </div>
           )}

           
          {isAuthenticated() ? ( 
            <button
              onClick={handleLogout}
              className="block w-full bg-red-500 text-white px-4 py-2 mt-2 rounded-lg hover:bg-red-600 transition"
            >
              Cerrar Sesión
            </button>
          ) : (
            <>
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
                onLoginSuccess={handleLoginSuccess} 
              />
            </>
          )}
        </div>
      )}
       
       {isCartModalOpen && <CarritoModal isVisible={isCartModalOpen} onClose={handleCloseCartModal} />}
    </nav>
  );
}

export default Navbar;
