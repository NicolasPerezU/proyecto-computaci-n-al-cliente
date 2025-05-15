import React from 'react';
import { useCart } from '../Hooks/Carrito';
import { useProductos } from '../Hooks/Productos';

function CarritoModal({ isVisible, onClose }) {
  const {
    cart,
    loadingCart,
    error,
    updateItemQuantity,
    removeItemFromCart,
    fetchCart,
  } = useCart();

  const {
    productos,
    loading: loadingProductos,
    error: errorProductos,
  } = useProductos();

  if (!isVisible) return null;

  const findProductDetails = (productoId) =>
    productos.find((p) => p._id === productoId);

  const handleConfirmarOrden = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('❌ Usuario no autenticado');
        return;
      }

      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productos: cart.productos.map((item) => ({
            productoId: item.productoId,
            nombre: item.nombre,
            precio: item.precio,
            cantidad: item.cantidad,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al confirmar la orden');
      }

      alert('✅ Orden confirmada exitosamente');
      onClose();
      fetchCart(); 
    } catch (err) {
      console.error(err);
      alert('❌ Ocurrió un error al confirmar la orden');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[80vh] overflow-y-auto text-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold">Tu Carrito</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl font-semibold leading-none"
            aria-label="Cerrar carrito"
          >
            &times;
          </button>
        </div>

        {(loadingCart || loadingProductos) && (
          <p className="text-center">Cargando carrito...</p>
        )}
        {(error || errorProductos) && (
          <p className="text-red-500 text-center">
            Error: {error || errorProductos}
          </p>
        )}

        {!loadingCart &&
          !loadingProductos &&
          !error &&
          !errorProductos &&
          cart?.productos?.length > 0 && (
            <>
              <ul className="divide-y divide-gray-200">
                {cart.productos.map((item) => {
                  const productDetails = findProductDetails(item.productoId);
                  const imageUrl = productDetails?.imagen || 'placeholder.jpg';

                  return (
                    <li
                      key={item.productoId}
                      className="py-4 flex items-center"
                    >
                      <img
                        src={imageUrl}
                        alt={item.nombre}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold">
                          {item.nombre}
                        </h3>
                        {productDetails?.descripcion && (
                          <p className="text-sm text-gray-600">
                            {productDetails.descripcion}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 mt-1">
                          ${item.precio.toLocaleString()} COP
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.productoId,
                              item.cantidad - 1
                            )
                          }
                          disabled={item.cantidad <= 1}
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded disabled:opacity-50"
                          aria-label={`Disminuir cantidad de ${item.nombre}`}
                        >
                          -
                        </button>
                        <span>{item.cantidad}</span>
                        <button
                          onClick={() =>
                            updateItemQuantity(
                              item.productoId,
                              item.cantidad + 1
                            )
                          }
                          className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                          aria-label={`Aumentar cantidad de ${item.nombre}`}
                        >
                          +
                        </button>
                        <button
                          onClick={() =>
                            removeItemFromCart(item.productoId)
                          }
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                          aria-label={`Eliminar ${item.nombre} del carrito`}
                        >
                          Eliminar
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <h3 className="text-xl font-bold">Total:</h3>
                <p className="text-xl font-bold">
                  ${cart.total.toLocaleString()} COP
                </p>
              </div>

              <div className="mt-6 text-center">
                <button
                  onClick={handleConfirmarOrden}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition w-full"
                >
                  Confirmar el Pago
                </button>
              </div>
            </>
          )}

        {!loadingCart &&
          !loadingProductos &&
          (!cart?.productos || cart.productos.length === 0) && (
            <p className="text-center text-gray-600">
              Tu carrito está vacío.
            </p>
          )}
      </div>
    </div>
  );
}

export default CarritoModal;
