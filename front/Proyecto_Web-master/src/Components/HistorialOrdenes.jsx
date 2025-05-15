import React from 'react';

function HistorialOrdenes({ ordenes, cancelarOrden }) {
  if (ordenes.length === 0) {
    return <p>No tienes órdenes registradas.</p>;
  }

  return (
    <ul className="space-y-4">
      {ordenes.map((orden) => (
        <li key={orden._id} className="p-4 bg-gray-800 rounded shadow">
          <p><strong>Fecha:</strong> {new Date(orden.createdAt).toLocaleString()}</p>
          <p><strong>Total:</strong> ${orden.total.toLocaleString()} COP</p>
          <div className="mt-2">
            <strong>Productos:</strong>
            <ul className="list-disc list-inside mt-1">
              {orden.productos.map((prod) => (
                <li key={prod.productoId}>
                  {prod.nombre} x {prod.cantidad} — ${prod.precio.toLocaleString()} COP
                </li>
              ))}
            </ul>
          </div>
          <button
            onClick={() => cancelarOrden(orden._id)}
            className="mt-3 px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-white"
          >
            Cancelar pedido
          </button>
        </li>
      ))}
    </ul>
  );
}

export default HistorialOrdenes;
