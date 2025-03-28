import { useState } from 'react'
import Navbar from './Components/Navbar'
import Inicio from './Components/Inicio'
import Reservas from './Components/Reservas'
import Footer from './Components/Footer'



function App() { 

  const [isReservasOpen, setReservasOpen] = useState(false);

  const handleReservasToggle = () => {
    setReservasOpen(!isReservasOpen);
  };
  return (
    <>
      <Navbar onReservasClick={handleReservasToggle} />
      <Inicio/> 
      {isReservasOpen && <Reservas isVisible={isReservasOpen} onClose={handleReservasToggle} />}
      <Footer/> 
    </>
  )
}

export default App
