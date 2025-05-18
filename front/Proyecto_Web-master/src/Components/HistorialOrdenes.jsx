import React, { useState } from 'react';

function HistorialOrdenes({ ordenes, cancelarOrden, editarOrden, esAdmin }) {
   const [editandoId, setEditandoId] = useState(null);
  const [editandoEstado, setEditandoEstado] = useState('');

  const handleEditClick = (orden) => {
    setEditandoId(orden._id);
    setEditandoEstado(orden.estado);
  };

  const handleSave = async (id) => {
    try {
      await editarOrden(id, { estado: editandoEstado });
      setEditandoId(null);
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };


  if (ordenes.length === 0) {
    return <p>No tienes órdenes registradas.</p>;
  }

  return (
    <ul className="space-y-4">
      {ordenes.map((orden) => (
        <li key={orden._id} className="p-4 bg-gray-800 rounded shadow">
          {esAdmin && orden.userId && (
            <p><strong>Usuario:</strong> {orden.userId.nombres} {orden.userId.apellidos}</p>
          )}
          
          <p><strong>Fecha:</strong> {new Date(orden.createdAt).toLocaleString()}</p>
          <p><strong>Total:</strong> ${orden.total.toLocaleString()} COP</p>
          
          {editandoId === orden._id ? (
            <div className="mt-2">
              <div className="mb-3">
                <label className="block text-sm">Estado:</label>
                <select
                  value={editandoEstado}
                  onChange={(e) => setEditandoEstado(e.target.value)}
                  className="w-full p-2 bg-gray-700 rounded"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleSave(orden._id)}
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
              <p className="flex items-center">
                <strong>Estado:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  orden.estado === 'pendiente' ? 'bg-yellow-500' :
                  orden.estado === 'completada' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {orden.estado}
                </span>
              </p>
              
              <div className="mt-2">
                <strong>Productos:</strong>
                <ul className="list-disc list-inside mt-1">
                  {orden.productos.map((prod, index) => (
                    <li key={prod.productoId || index}>
                      {prod.nombre} x {prod.cantidad} — ${prod.precio.toLocaleString()} COP
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="flex space-x-2 mt-3">
                {orden.estado !== 'cancelada' && (
                  <button
                    onClick={() => cancelarOrden(orden._id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
                  >
                    {orden.estado === 'pendiente' ? 'Cancelar' : 'Eliminar'}
                  </button>
                )}
                {/* Solo mostrar botón de editar si es admin */}
                {esAdmin && orden.estado === 'pendiente' && (
                  <button
                    onClick={() => handleEditClick(orden)}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                  >
                    Editar Estado
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

export default HistorialOrdenes;
