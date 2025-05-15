import { useState } from "react";
import Error from "./Error";

function Reservas({ isVisible, onClose }) {

  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    cedula: '',
    
    celular: '', 
    diaReserva: '', 
    horaReserva: '', 
    numeroPersonas: '', 
    infoAdicional: '' 
  });

  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(''); 


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    
    if (!token) { 
      alert("Por favor, inicia sesión para realizar una reserva."); 
      return; 
    }

    
    if (
      !formData.celular ||
      !formData.diaReserva || 
      !formData.horaReserva || 
      !formData.numeroPersonas ||
      parseInt(formData.numeroPersonas, 10) <= 0 
    ) {
      setError(true);
      setSuccessMessage(''); 
      return;
    }
    setError(false);
    setSuccessMessage(''); 
    setSubmitting(true); 

    
    const dataToSend = {
      celular: formData.celular,
      fechaReserva: formData.diaReserva, 
      horaReserva: formData.horaReserva, 
      numeroPersonas: parseInt(formData.numeroPersonas, 10), 
      comentario: formData.infoAdicional 
    };

    
    try {
    
      const response = await fetch('http://localhost:3000/api/reservas', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json(); 

      if (response.ok) { 
        console.log("Reserva creada exitosamente:", result);
        setSuccessMessage(result.message || "Reserva creada exitosamente."); 
        setError(false); 

        
        setFormData({
            primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
            email: '', cedula: '', celular: '', diaReserva: '', horaReserva: '',
            numeroPersonas: '', infoAdicional: ''
        });

        

      } else { 
        console.error("Error al crear la reserva:", result.error);
        setError(true); 
        setSuccessMessage(''); 
         alert(result.error || "Error al crear la reserva.");
      }

    } catch (err) {
      console.error("Error en la solicitud de reserva:", err);
      setError(true); 
      setSuccessMessage('');
      alert("Ocurrió un error al intentar reservar. Intenta de nuevo más tarde.");
    } finally {
      setSubmitting(false); 
    }
  };

  return (
    isVisible && (
      <div id="Reservas" className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        
        <div className="relative w-full max-w-lg max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
           <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
              
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-semibold leading-none"
                aria-label="Cerrar"
              >
                &times; 
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center">Reservar una Mesa</h2>

              
              {error && <Error>Todos los campos obligatorios deben ser completados. (Campos obligatorios: Celular, Fecha, Hora, N° Personas)</Error>}
               
               {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                     <span className="block sm:inline">{successMessage}</span>
                  </div>
               )}

              

              

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Número de Celular</label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required 
                />
              </div>

              

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Día de Reserva</label>
                <input
                  type="date"
                  name="diaReserva"
                  value={formData.diaReserva}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required 
                />
              </div>

               
               <div className="mb-4">
                 <label className="block text-gray-700 mb-2">Hora de Reserva</label>
                 <input
                   type="time" 
                   name="horaReserva"
                   value={formData.horaReserva}
                   onChange={handleChange}
                   className="w-full p-2 border border-gray-300 rounded-md"
                   required 
                 />
               </div>


              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Número de Personas</label>
                <input
                  type="number"
                  name="numeroPersonas"
                  value={formData.numeroPersonas}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  min="1"
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Información Adicional (Opcional)</label>
                <textarea
                  name="infoAdicional" 
                  value={formData.infoAdicional}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className={`bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={submitting} 
                >
                  {submitting ? 'Enviando...' : 'Enviar Reserva'}
                </button>
                
              </div>
            </form>
        </div>
      </div>
    )
  );
}

export default Reservas;
