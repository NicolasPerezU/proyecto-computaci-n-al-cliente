import React from 'react';
import { useCart } from '../Hooks/Carrito'; // Import useCart hook - Corrected path capitalization

// Import product data to find image URLs by product ID
import { products as allProducts } from './Inicio'; // Assuming you can import the products array from Inicio.jsx


function CarritoModal({ isVisible, onClose }) {
  // Get cart data and functions from the context
  const { cart, loadingCart, error, updateItemQuantity, removeItemFromCart } = useCart();

  // If the modal is not visible, return null
  if (!isVisible) return null;

  // Function to find product details (especially image) from the main products list
  const findProductDetails = (productoId) => {
      // Find the product in the full list by its _id (which is productoId in the cart item)
      return allProducts.find(p => p._id === productoId);
  };


  // Basic modal structure
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose} // Close modal when clicking outside the content
    >
      <div
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md md:max-w-lg lg:max-w-xl max-h-[80vh] overflow-y-auto text-gray-800" // Added max-h and overflow
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the content
      >
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h2 className="text-2xl font-bold">Tu Carrito</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-3xl font-semibold leading-none"
          >
            &times; {/* Times symbol for close */}
          </button>
        </div>

        {/* Loading and Error States */}
        {loadingCart && <p>Cargando carrito...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* Cart Content */}
        {!loadingCart && !error && (
           // Added checks to ensure cart and cart.productos exist and it's an array
           cart && cart.productos && Array.isArray(cart.productos) && cart.productos.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-200">
                {/* Iterate directly over the items returned by the backend */}
                {cart.productos.map(item => {
                     // Find the full product details (including image) from the imported list
                     const productDetails = findProductDetails(item.productoId);
                     const imageUrl = productDetails ? productDetails.imagen : 'placeholder.jpg'; // Use a placeholder if product not found

                    return (
                      <li key={item.productoId} className="py-4 flex items-center"> {/* Use productoId as key */}
                        {/* Product Image - Use the image URL from the imported list */}
                        <img
                          src={imageUrl}
                          alt={item.nombre} // Use item.nombre from backend data
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div className="flex-grow">
                          {/* Product Name and Description - Use data from backend item */}
                          <h3 className="text-lg font-semibold">{item.nombre}</h3>
                          {/* Description is not in the backend cart item, you might need to get it from productDetails if desired */}
                          {productDetails && productDetails.descripcion && (
                                <p className="text-sm text-gray-600">{productDetails.descripcion}</p>
                          )}

                          {/* Price - Use item.precio from backend data */}
                          <p className="text-sm text-gray-700 mt-1">${item.precio.toLocaleString()} COP</p>
                        </div>
                        {/* Quantity Controls and Remove Button */}
                        <div className="flex items-center space-x-2">
                          <button
                             // Pass item.productoId to update function
                             onClick={() => updateItemQuantity(item.productoId, item.cantidad - 1)}
                             disabled={item.cantidad <= 1} // Disable if quantity is 1
                             className="bg-gray-200 text-gray-700 px-2 py-1 rounded disabled:opacity-50"
                           >
                             -
                           </button>
                           <span>{item.cantidad}</span> {/* Use item.cantidad */}
                           <button
                              // Pass item.productoId to update function
                             onClick={() => updateItemQuantity(item.productoId, item.cantidad + 1)}
                             className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
                           >
                             +
                           </button>
                           <button
                              // Pass item.productoId to remove function
                             onClick={() => removeItemFromCart(item.productoId)}
                             className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                           >
                             Eliminar
                           </button>
                        </div>
                      </li>
                    );
                })}
              </ul>
              {/* Cart Total */}
              <div className="mt-6 pt-4 border-t flex justify-between items-center">
                <h3 className="text-xl font-bold">Total:</h3>
                 {/* Use cart.total from backend data */}
                <p className="text-xl font-bold">${cart.total.toLocaleString()} COP</p> {/* Format total price */}
              </div>
              {/* Checkout Button */}
              <div className="mt-6 text-center">
                <button className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-green-600 transition w-full">
                  Proceder al Pago
                </button>
              </div>
            </>
          ) : (
            <p className="text-center text-gray-600">Tu carrito está vacío.</p>
          )
        )}

      </div>
    </div>
  );
}

export default CarritoModal;
