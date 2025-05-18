import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ productos: [], total: 0 });
  const [loadingCart, setLoadingCart] = useState(true);
  const [error, setError] = useState(null);
  const prevTokenRef = useRef(localStorage.getItem('token'));

  const getToken = () => localStorage.getItem('token');

  const fetchCart = async () => {
    const token = getToken();
    if (!token) {
      setCart({ productos: [], total: 0 });
      setLoadingCart(false);
      return;
    }

    setLoadingCart(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener el carrito.');
      }

      const data = await response.json();
      setCart(data.order || data); 
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError(err.message);
      setCart({ productos: [], total: 0 });
    } finally {
      setLoadingCart(false);
    }
  };

  useEffect(() => {
    fetchCart();

    const handleStorageChange = () => {
      const newToken = localStorage.getItem('token');
      const oldToken = prevTokenRef.current;

      if (newToken !== oldToken) {
        console.log("Token changed, refetching cart...");
        fetchCart();
        prevTokenRef.current = newToken;
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const addItemToCart = async (product) => {
    const token = getToken();
    if (!token) {
      setError("Usuario no autenticado.");
      return;
    }

    setError(null);
    try {
      const response = await fetch('http://localhost:3000/api/orders/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          productoId: product._id,
          nombre: product.nombre,
          precio: product.precio,
          cantidad: 1
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al añadir producto al carrito.');
      }

      const responseData = await response.json();
      setCart(responseData.order || responseData);
    } catch (err) {
      console.error("Error adding item to cart:", err);
      setError(err.message);
    }
  };

  const updateItemQuantity = async (productId, cantidad) => {
    const token = getToken();
    if (!token) {
      setError("Usuario no autenticado.");
      return;
    }
    if (cantidad < 0) {
      setError("La cantidad no puede ser negativa.");
      return;
    }

    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/orders/update-item/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ cantidad })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la cantidad.');
      }

      const responseData = await response.json();
      setCart(responseData.order || responseData);
    } catch (err) {
      console.error("Error updating item quantity:", err);
      setError(err.message);
    }
  };

  const removeItemFromCart = async (productId) => {
    const token = getToken();
    if (!token) {
      setError("Usuario no autenticado.");
      return;
    }

    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/orders/remove-item/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar el producto.');
      }

      const responseData = await response.json();
      setCart(responseData.order || responseData);
    } catch (err) {
      console.error("Error removing item from cart:", err);
      setError(err.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loadingCart,
        error,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
