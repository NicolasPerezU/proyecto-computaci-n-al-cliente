import React, { createContext, useState, useContext, useEffect, useRef } from 'react'; // Import useRef

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState({ productos: [], total: 0 });
    const [loadingCart, setLoadingCart] = useState(true);
    const [error, setError] = useState(null);

    // Use useRef to store the *previous* token value
    const prevTokenRef = useRef(localStorage.getItem('token'));


    // Function to get the token (still useful internally)
    const getToken = () => localStorage.getItem('token');

    // Function to fetch the cart from the backend
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
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status === 404) {
                     // Backend now returns { productos: [], total: 0 } for 404 on GET /, so maybe this is redundant,
                     // but good to handle explicitly if needed.
                     // For now, let's rely on the backend's 404 response returning the empty structure.
                     const emptyCartResponse = await response.json(); // Read the response body for the empty cart
                     setCart(emptyCartResponse);

                 } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al obtener el carrito.');
                 }
            } else {
                const data = await response.json();
                setCart(data);
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError(err.message);
            setCart({ productos: [], total: 0 }); // Reset cart on error
        } finally {
            setLoadingCart(false);
        }
    };

    // Effect to fetch cart on mount and handle storage changes
    useEffect(() => {
        // Fetch cart initially when the component mounts
        fetchCart();

        // Handler for storage changes
        const handleStorageChange = () => {
            const newToken = localStorage.getItem('token');
            const oldToken = prevTokenRef.current; // Get the token value *before* this storage event

            // Only refetch if the token value has actually changed
            if (newToken !== oldToken) {
                console.log("Token changed in localStorage, refetching cart...");
                fetchCart();
                 // Update the ref with the new token value
                prevTokenRef.current = newToken;
            } else {
                 // If the storage event wasn't about the token, or the token didn't change,
                 // we might still want to re-fetch the cart if the cart data itself
                 // was potentially modified in another tab (e.g., adding/removing items).
                 // This is a bit more complex as storage event doesn't tell you *what* changed.
                 // A common pattern is to store a "cart version" or timestamp in localStorage
                 // when the cart is updated, and listen for changes to that version/timestamp.
                 // For now, let's keep it simpler and only refetch on token changes,
                 // as login/logout is the primary cross-tab sync need for fetching the *initial* cart state.
                 // Updates to the cart within the same tab are handled by the API call responses.
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Clean up the event listener
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };

        // No dependencies in this useEffect because we manually check localStorage
        // and only call fetchCart based on the comparison.
        // This prevents the effect from re-running on every render.
    }, []); // Empty dependency array ensures this effect runs only once on mount


    // Function to add an item to the cart
    const addItemToCart = async (product) => {
        const token = getToken();
        if (!token) {
            setError("Usuario no autenticado.");
            // Maybe also redirect to login or open login modal here
            return;
        }

        setError(null);
        try {
            const response = await fetch('http://localhost:3000/api/orders/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                // Ensure we send the correct product data structure
                body: JSON.stringify({
                    productoId: product._id, // Use _id from your product data
                    nombre: product.nombre,
                    precio: product.precio,
                    cantidad: 1 // Assuming adding one item at a time
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al añadir producto al carrito.');
            }

            const responseData = await response.json();
            // Update the cart state with the order returned from the backend
            // Ensure the backend response structure matches what setCart expects
            if (responseData.order) {
                 setCart(responseData.order);
            } else {
                 // If backend doesn't return the full order, maybe refetch?
                 console.warn("Backend did not return 'order' in add-to-cart response. Refetching cart.");
                 fetchCart(); // Refetch as fallback
            }


        } catch (err) {
            console.error("Error adding item to cart:", err);
            setError(err.message);
        }
    };

    // Function to update item quantity in the cart
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
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ cantidad })
            });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.error || 'Error al actualizar la cantidad.');
            }

            const responseData = await response.json();
             // Update the cart state with the order returned from the backend
             if (responseData.order) {
                 setCart(responseData.order);
             } else {
                 console.warn("Backend did not return 'order' in update-item response. Refetching cart.");
                 fetchCart(); // Refetch as fallback
             }


        } catch (err) {
             console.error("Error updating item quantity:", err);
             setError(err.message);
        }
    };

    // Function to remove an item from the cart
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
                    'Authorization': `Bearer ${token}`
                }
             });

            if (!response.ok) {
                 const errorData = await response.json();
                 throw new Error(errorData.error || 'Error al eliminar el producto.');
            }

            const responseData = await response.json();
            // Update the cart state with the order returned from the backend
            if (responseData.order) {
                 setCart(responseData.order);
            } else {
                 console.warn("Backend did not return 'order' in remove-item response. Refetching cart.");
                 fetchCart(); // Refetch as fallback
            }


        } catch (err) {
            console.error("Error removing item from cart:", err);
            setError(err.message);
        }
    };

    // Function to clear the cart (optional, but useful)
    // This would require a new backend route to set estado to something else or delete the cart
    // For now, let's not implement a backend route for clearing the cart entirely,
    // but you could remove all items one by one or implement a specific backend endpoint later.


    return (
        <CartContext.Provider value={{ cart, loadingCart, error, addItemToCart, updateItemQuantity, removeItemFromCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
