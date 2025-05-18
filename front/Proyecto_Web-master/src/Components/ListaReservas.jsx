import React, { useState } from 'react';

function ListaReservas({ reservas, cancelarReserva, editarReserva, esAdmin }) {
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({celular: '',
    fechaReserva: '',
    horaReserva: '',
    numeroPersonas: '',
    comentario: ''
  });

  const handleEditClick = (reserva) => {
    setEditandoId(reserva._id);
    setFormData({
      celular: reserva.celular,
      fechaReserva: reserva.fechaReserva.split('T')[0],
      horaReserva: reserva.horaReserva,
      numeroPersonas: reserva.numeroPersonas,
      comentario: reserva.comentario || ''
    });
  };

  const handleSave = async (id) => {
    try {
      await editarReserva(id, {
        ...formData,
        numeroPersonas: parseInt(formData.numeroPersonas)
      });
      setEditandoId(null);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  if (reservas.length === 0) {
    return <p>No hay reservas registradas.</p>;
  }

  return (
    <ul className="space-y-4">
      {reservas.map((reserva) => (
        <li key={reserva._id} className="p-4 bg-gray-800 rounded shadow">
          {esAdmin && reserva.userId && (
            <p><strong>Usuario:</strong> {reserva.userId.nombres} {reserva.userId.apellidos}</p>
          )}

          {editandoId === reserva._id ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm">Celular:</label>
                <input
                  type="text"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm">Fecha:</label>
                <input
                  type="date"
                  name="fechaReserva"
                  value={formData.fechaReserva}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm">Hora:</label>
                <input
                  type="time"
                  name="horaReserva"
                  value={formData.horaReserva}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm">Número de personas:</label>
                <input
                  type="number"
                  name="numeroPersonas"
                  value={formData.numeroPersonas}
                  onChange={handleChange}
                  min="1"
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm">Comentario (opcional):</label>
                <textarea
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  className="w-full p-2 bg-gray-700 rounded"
                />
              </div>

              <div className="flex space-x-2 mt-2">
                <button 
                  onClick={() => handleSave(reserva._id)}
                  className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
                >
                  Guardar
                </button>
                <button 
                  onClick={() => setEditandoId(null)}
                  className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <p><strong>Fecha:</strong> {new Date(reserva.fechaReserva).toLocaleDateString()}</p>
              <p><strong>Hora:</strong> {reserva.horaReserva}</p>
              <p><strong>Personas:</strong> {reserva.numeroPersonas}</p>
              {reserva.comentario && <p><strong>Comentario:</strong> {reserva.comentario}</p>}
              
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => cancelarReserva(reserva._id)}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                >
                  Cancelar
                </button>
                {!esAdmin && (
                  <button
                    onClick={() => handleEditClick(reserva)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                  >
                    Editar
                  </button>
                )}
              </div>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}


export default ListaReservas;
