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

router.post('/', verifyToken, async (req, res) => {
  const { productos } = req.body;
  
  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: "El carrito debe contener al menos un producto." });
  }
  
  const total = productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
  
  try {
    const order = new Order({
      userId: req.user.userId,
      productos,
      total,
      estado: "carrito"
    });
    
    await order.save();
    res.status(201).json({ message: "Orden creada exitosamente.", orderId: order._id });
  } catch (error) {
    console.error("Error al crear la orden:", error);
    res.status(500).json({ error: "Error al crear la orden." });
  }
});

router.get('/', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.user.userId, estado: "carrito" });
    if (!order) {
      return res.status(404).json({ error: "No se encontró un carrito activo." });
    }
    res.json(order);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito." });
  }
});

module.exports = router;
