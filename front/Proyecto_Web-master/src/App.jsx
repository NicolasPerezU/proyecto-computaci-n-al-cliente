import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './Components/Navbar';
import Inicio from './Components/Inicio';
import Reservas from './Components/Reservas';
import Footer from './Components/Footer';
import Perfil from './Components/Perfil';
import { CartProvider } from './Hooks/Carrito';

function AppContent() {
  const location = useLocation();
  const [isReservasOpen, setReservasOpen] = useState(false);

  const handleReservasToggle = () => {
    setReservasOpen(!isReservasOpen);
  };

  const isPerfilRoute = location.pathname === '/perfil';

  return (
    <>
      {!isPerfilRoute && <Navbar onReservasClick={handleReservasToggle} />}
      {isReservasOpen && <Reservas isVisible={isReservasOpen} onClose={handleReservasToggle} />}
      
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>

      {!isPerfilRoute && <Footer />}
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
