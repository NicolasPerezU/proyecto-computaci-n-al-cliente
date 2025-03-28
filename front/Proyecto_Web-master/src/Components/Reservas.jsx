import { useState } from "react";
import Error from "./Error";

function Reservas({ isVisible, onClose }) {
  const [formData, setFormData] = useState({
    primerNombre: '',
    segundoNombre: '',
    primerApellido: '',
    segundoApellido: '',
    email: '',
    celular: '',
    cedula: '',
    diaReserva: '',
    numeroPersonas: '',
    infoAdicional: ''
  });

  const [error, setError] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.primerNombre ||
      !formData.primerApellido ||
      !formData.email ||
      !formData.celular ||
      !formData.cedula ||
      !formData.diaReserva ||
      !formData.numeroPersonas) {
      setError(true);
      return;

    }
    setError(false);
    console.log("Datos de la reserva: ", formData);
    onClose();
  };

  return (
    isVisible && (
      <div id="Reservas" className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg max-h-[90vh] overflow-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Reservar una Mesa</h2>

          {error && <Error>Todos los campos son obligatorios excepto información adicional</Error>}

          <div className="flex mb-4">
            <div className="w-1/2 pr-2">
              <label className="block text-gray-700 mb-2">Primer Nombre</label>
              <input
                type="text"
                name="primerNombre"
                value={formData.primerNombre}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
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
                required
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
              required
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
              required
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
            <label className="block text-gray-700 mb-2">Información Adicional</label>
            <textarea
              name="infoAdicional"
              value={formData.infoAdicional}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="text-center">
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300">
              Enviar
            </button>
            <button type="button" onClick={onClose} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 md:ml-4">Cerrar</button>
          </div>
        </form>
      </div>
    )
  );
}

export default Reservas
