// routes/reservas.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Reserva = require('../models/Reserva');
const router = express.Router();


const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Debe iniciar sesión para crear una reserva." });
    req.user = decoded;
    next();
  });
};


router.post('/', verifyToken, async (req, res) => {
  const { celular, fechaReserva, horaReserva, numeroPersonas, comentario } = req.body;
  
  
  if (!celular || !fechaReserva || !horaReserva || !numeroPersonas) {
    return res.status(400).json({ error: "Se requieren celular, fechaReserva, horaReserva y numeroPersonas." });
  }
  
  try {
    
    const reserva = new Reserva({
      userId: req.user.userId, 
      celular,
      fechaReserva,
      horaReserva, 
      numeroPersonas,
      comentario
    });

    await reserva.save();
    res.status(201).json({ message: "Reserva creada exitosamente." });
  } catch (err) {
    console.error("Error al crear la reserva:", err);
    res.status(500).json({ error: "Error al crear la reserva." });
  }
});

module.exports = router;
