const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const Reserva = require('../models/Reserva');
const router = express.Router();


const User = require('../models/User'); 

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    req.user = {
      userId: user._id,
      role: user.rol,
      email: user.email
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
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


router.get('/reservasUsuario', verifyToken, async (req, res) => {
  try {
    const reservas = await Reserva.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(reservas);
  } catch (err) {
    console.error("Error al obtener reservas:", err);
    res.status(500).json({ error: "Error al obtener reservas." });
  }
});


router.get('/todas', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden ver todas las reservas.' });
  }

  try {
    const reservas = await Reserva.find().sort({ createdAt: -1 }).populate('userId', 'nombres apellidos email');
    res.json(reservas);
  } catch (err) {
    console.error('Error al obtener todas las reservas:', err);
    res.status(500).json({ error: 'Error al obtener todas las reservas.' });
  }
});

router.put('/:id', verifyToken, async (req, res) => {
  const { celular, fechaReserva, horaReserva, numeroPersonas, comentario } = req.body;
  const reservaId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(reservaId)) {
    return res.status(400).json({ error: "ID de reserva inválido" });
  }

  try {
    const reserva = await Reserva.findById(reservaId);
    
    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada" });
    }

    // Solo el dueño puede editar
    if (reserva.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "No tienes permiso para editar esta reserva" });
    }

    // Actualizar campos
    reserva.celular = celular || reserva.celular;
    reserva.fechaReserva = fechaReserva || reserva.fechaReserva;
    reserva.horaReserva = horaReserva || reserva.horaReserva;
    reserva.numeroPersonas = numeroPersonas || reserva.numeroPersonas;
    reserva.comentario = comentario || reserva.comentario;

    await reserva.save();
    res.json({ message: "Reserva actualizada exitosamente", reserva });
    
  } catch (err) {
    console.error("Error al actualizar reserva:", err);
    res.status(500).json({ error: "Error al actualizar reserva" });
  }
});

router.delete('/:id', verifyToken, async (req, res) => {
  const reservaId = req.params.id;

  try {
    const reserva = await Reserva.findById(reservaId); 

    if (!mongoose.Types.ObjectId.isValid(reservaId)) {
      return res.status(400).json({ error: "ID de reserva inválido" });
    }

    if (!reserva) {
      return res.status(404).json({ error: "Reserva no encontrada." });
    }

    if (reserva.userId.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "No autorizado para cancelar esta reserva" });
    }



    await Reserva.findByIdAndDelete(reservaId);
    res.json({ message: "Reserva cancelada correctamente." });
  } catch (err) {
    console.error("Error al eliminar la reserva:", err);
    res.status(500).json({ error: "Error al eliminar la reserva." });
  }
});



module.exports = router;
