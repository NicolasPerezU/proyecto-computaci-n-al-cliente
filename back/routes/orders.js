const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const router = express.Router();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
};

// Existing POST route (could be used for initial order creation or perhaps refactored)
router.post('/', verifyToken, async (req, res) => {
  const { productos } = req.body;

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: "El carrito debe contener al menos un producto." });
  }

  const total = productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  try {
    // Check if the user already has an active cart
    let order = await Order.findOne({ userId: req.user.userId, estado: "carrito" });

    if (order) {
        // If a cart exists, you might want to merge or replace.
        // For now, let's assume this route is primarily for initial creation,
        // and add-to-cart handles subsequent additions.
         return res.status(400).json({ error: "Ya existe un carrito activo para este usuario. Use la ruta /add-to-cart para añadir productos." });

    } else {
       // If no cart exists, create a new one
        order = new Order({
            userId: req.user.userId,
            productos,
            total,
            estado: "carrito"
        });

        await order.save();
        res.status(201).json({ message: "Carrito creado exitosamente.", orderId: order._id });
    }

  } catch (error) {
    console.error("Error al crear/obtener la orden:", error);
    res.status(500).json({ error: "Error al crear/obtener la orden." });
  }
});


// New route to add a product to the cart
router.post('/add-to-cart', verifyToken, async (req, res) => {
    const { productoId, nombre, precio, cantidad } = req.body;

    if (!productoId || !nombre || precio === undefined || cantidad === undefined || cantidad <= 0) {
        return res.status(400).json({ error: "Se requieren productoId, nombre, precio y una cantidad válida." });
    }

    try {
        let order = await Order.findOne({ userId: req.user.userId, estado: "carrito" });

        if (!order) {
            // If no cart exists, create a new one
            order = new Order({
                userId: req.user.userId,
                productos: [{ productoId, nombre, precio, cantidad }],
                total: precio * cantidad,
                estado: "carrito"
            });
        } else {
            // If a cart exists, check if the product is already in it
            const itemIndex = order.productos.findIndex(item => item.productoId === productoId);

            if (itemIndex > -1) {
                // Product exists, update the quantity
                order.productos[itemIndex].cantidad += cantidad;
            } else {
                // Product does not exist, add it as a new item
                order.productos.push({ productoId, nombre, precio, cantidad });
            }

            // Recalculate the total for the updated cart
            order.total = order.productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        }

        await order.save();
        res.json({ message: "Producto añadido al carrito exitosamente.", order });

    } catch (error) {
        console.error("Error al añadir producto al carrito:", error);
        res.status(500).json({ error: "Error al añadir producto al carrito." });
    }
});

// New route to update the quantity of a product in the cart
router.put('/update-item/:productId', verifyToken, async (req, res) => {
    const { productId } = req.params;
    const { cantidad } = req.body;

    if (cantidad === undefined || cantidad < 0) {
        return res.status(400).json({ error: "Se requiere una cantidad válida (mayor o igual a 0)." });
    }

    try {
        const order = await Order.findOne({ userId: req.user.userId, estado: "carrito" });

        if (!order) {
            return res.status(404).json({ error: "No se encontró un carrito activo." });
        }

        const itemIndex = order.productos.findIndex(item => item.productoId === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito." });
        }

        if (cantidad === 0) {
            // If quantity is 0, remove the item
            order.productos.splice(itemIndex, 1);
        } else {
            // Otherwise, update the quantity
            order.productos[itemIndex].cantidad = cantidad;
        }

        // Recalculate the total
        order.total = order.productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        await order.save();
        res.json({ message: "Cantidad del producto actualizada.", order });

    } catch (error) {
        console.error("Error al actualizar cantidad del producto en el carrito:", error);
        res.status(500).json({ error: "Error al actualizar cantidad del producto en el carrito." });
    }
});

// New route to remove a product from the cart
router.delete('/remove-item/:productId', verifyToken, async (req, res) => {
    const { productId } = req.params;

    try {
        const order = await Order.findOne({ userId: req.user.userId, estado: "carrito" });

        if (!order) {
            return res.status(404).json({ error: "No se encontró un carrito activo." });
        }

        const initialProductCount = order.productos.length;
        order.productos = order.productos.filter(item => item.productoId !== productId);

        if (order.productos.length === initialProductCount) {
             return res.status(404).json({ error: "Producto no encontrado en el carrito." });
        }


        // Recalculate the total
        order.total = order.productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        await order.save();
        res.json({ message: "Producto eliminado del carrito.", order });

    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ error: "Error al eliminar producto del carrito." });
    }
});


// Existing GET route to get the current cart
router.get('/', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.user.userId, estado: "carrito" });
    if (!order) {
        // Return an empty cart instead of 404 if no cart is found
      return res.json({ userId: req.user.userId, productos: [], total: 0, estado: "carrito" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito." });
  }
});


module.exports = router;
