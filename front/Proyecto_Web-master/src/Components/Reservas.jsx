import { useState } from "react";
import Error from "./Error";

function Reservas({ isVisible, onClose }) {
  // Obtenemos el token directamente de localStorage
  // Esto nos indica si el usuario está autenticado
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    // Campos que no se envían al backend de reservas, pero puedes mantener para el front-end si los usas para algo más
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    cedula: '',
    // Campos que sí se envían al backend
    celular: '', // Coincide con el backend
    diaReserva: '', // Corresponde a fechaReserva en el backend
    horaReserva: '', // Nuevo campo para la hora
    numeroPersonas: '', // Coincide con el backend
    infoAdicional: '' // Corresponde a comentario en el backend (opcional)
  });

  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false); // Estado para deshabilitar el botón durante el envío
  const [successMessage, setSuccessMessage] = useState(''); // Estado para mensaje de éxito


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => { // Agregamos async aquí
    e.preventDefault();

    // 1. *** Verificar Autenticación Primero usando localStorage ***
    if (!token) { // Si no hay token en localStorage, el usuario no está logueado
      alert("Por favor, inicia sesión para realizar una reserva."); // O usa una notificación más amigable
      // onClose(); // Opcional: cerrar el modal si no está logueado
      return; // Detener el envío del formulario
    }

    // 2. *** Validación Básica Front-end (Ajustada) ***
    // Validar solo los campos que el backend requiere como obligatorios
    if (
      !formData.celular ||
      !formData.diaReserva || // Corresponde a fechaReserva en el backend
      !formData.horaReserva || // Campo de hora (ahora requerido por el backend)
      !formData.numeroPersonas ||
      parseInt(formData.numeroPersonas, 10) <= 0 // Asegurar que el número de personas sea válido
    ) {
      setError(true);
      setSuccessMessage(''); // Limpiar mensaje de éxito si hay error
      return;
    }
    setError(false);
    setSuccessMessage(''); // Limpiar mensaje de éxito si se valida correctamente
    setSubmitting(true); // Indicar que se está enviando

    // 3. *** Preparar Datos para el Backend (Ajustados) ***
    const dataToSend = {
      celular: formData.celular,
      fechaReserva: formData.diaReserva, // Backend espera fechaReserva
      horaReserva: formData.horaReserva, // Backend espera horaReserva
      numeroPersonas: parseInt(formData.numeroPersonas, 10), // Convertir a número entero
      comentario: formData.infoAdicional // Backend espera comentario (opcional)
    };

    // 4. *** Enviar Solicitud POST al Backend ***
    try {
      // Asegúrate de que esta URL coincida con la de tu backend de reservas
      const response = await fetch('http://localhost:3000/api/reservas', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Incluir el token JWT del localStorage
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json(); // Obtener la respuesta JSON

      if (response.ok) { // Si la respuesta es 2xx
        console.log("Reserva creada exitosamente:", result);
        setSuccessMessage(result.message || "Reserva creada exitosamente."); // Mostrar mensaje de éxito del backend
        setError(false); // Asegurar que no haya mensaje de error visible

        // Opcional: Resetear el formulario después de un envío exitoso
        setFormData({
            primerNombre: '', segundoNombre: '', primerApellido: '', segundoApellido: '',
            email: '', cedula: '', celular: '', diaReserva: '', horaReserva: '',
            numeroPersonas: '', infoAdicional: ''
        });

        // Puedes cerrar el modal aquí o esperar un poco
        // onClose();

      } else { // Si la respuesta no es 2xx (ej: 400, 401, 500)
        console.error("Error al crear la reserva:", result.error);
        setError(true); // Mostrar el componente de error
        setSuccessMessage(''); // Limpiar mensaje de éxito
        // Mostrar el mensaje de error que viene del backend si está disponible
         alert(result.error || "Error al crear la reserva.");
      }

    } catch (err) {
      console.error("Error en la solicitud de reserva:", err);
      setError(true); // Mostrar el componente de error
      setSuccessMessage(''); // Limpiar mensaje de éxito
      alert("Ocurrió un error al intentar reservar. Intenta de nuevo más tarde.");
    } finally {
      setSubmitting(false); // Siempre restablecer el estado de envío
    }
  };

  return (
    isVisible && (
      <div id="Reservas" className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        {/* Cierra el modal si haces clic fuera del contenido del formulario */}
        <div className="relative w-full max-w-lg max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
           <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
              {/* Botón de cerrar en la esquina superior derecha */}
              <button
                type="button"
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-semibold leading-none"
                aria-label="Cerrar"
              >
                &times; {/* Times symbol for close */}
              </button>

              <h2 className="text-2xl font-bold mb-6 text-center">Reservar una Mesa</h2>

              {/* Mostrar Error */}
              {error && <Error>Todos los campos obligatorios deben ser completados. (Campos obligatorios: Celular, Fecha, Hora, N° Personas)</Error>}
               {/* Mostrar Mensaje de Éxito */}
               {successMessage && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                     <span className="block sm:inline">{successMessage}</span>
                  </div>
               )}

              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <label className="block text-gray-700 mb-2">Primer Nombre</label>
                  <input
                    type="text"
                    name="primerNombre"
                    value={formData.primerNombre}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    // Note: Not required here as backend doesn't use it for the Reserva model
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-gray-700 mb-2">Segundo Nombre</label>
                  <input
                    type="text"
                    name="segundoNombre"
                    value={formData.segundoNombre}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="flex mb-4">
                <div className="w-1/2 pr-2">
                  <label className="block text-gray-700 mb-2">Primer Apellido</label>
                  <input
                    type="text"
                    name="primerApellido"
                    value={formData.primerApellido}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    // Note: Not required here
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label className="block text-gray-700 mb-2">Segundo Apellido</label>
                  <input
                    type="text"
                    name="segundoApellido"
                    value={formData.segundoApellido}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                   // Note: Not required here
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Número de Celular</label>
                <input
                  type="tel"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required // Required for frontend and backend
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Número de Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                   // Note: Not required here
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
                  required // Required for frontend and backend
                />
              </div>

               {/* Campo para la Hora de Reserva */}
               <div className="mb-4">
                 <label className="block text-gray-700 mb-2">Hora de Reserva</label>
                 <input
                   type="time" // Use type="time"
                   name="horaReserva"
                   value={formData.horaReserva}
                   onChange={handleChange}
                   className="w-full p-2 border border-gray-300 rounded-md"
                   required // Required for frontend and backend
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
                  required // Required for frontend and backend
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Información Adicional (Opcional)</label>
                <textarea
                  name="infoAdicional" // Corresponds to comentario in backend
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
                {/* Mover el botón de cerrar dentro del formulario si quieres */}
                {/* <button type="button" onClick={onClose} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 md:ml-4">Cerrar</button> */}
              </div>
            </form>
        </div>
      </div>
    )
  );
}

export default Reservas;
