const express = require('express');
const router = express.Router();
const Promocion = require('../models/Promociones'); 

// Obtener todas las promociones
router.get('/', async (req, res) => {
  try {
    const promociones = await Promocion.find();
    res.json(promociones);
  } catch (err) {
    res.status(500).json({ message: "No hay promociones" });
  }
});

// Crear una nueva promoción
router.post('/', async (req, res) => {
  const nuevaPromocion = new Promocion({
    titulo: req.body.titulo,
    descripcion: req.body.descripcion,
    fechaInicio: req.body.fechaInicio,
    fechaFin: req.body.fechaFin,
    descuento: req.body.descuento
  });

  try {
    const promocionGuardada = await nuevaPromocion.save();
    res.status(201).json(promocionGuardada);
  } catch (err) {
    res.status(400).json({ message: "No se pudo crear la promoción", error: err.message });
  }
});

// Obtener una promoción por ID
router.get('/:id', getPromocion, (req, res) => {
  res.json(res.promocion);
});

// Actualizar una promoción
router.patch('/:id', getPromocion, async (req, res) => {
  if (req.body.titulo != null) res.promocion.titulo = req.body.titulo;
  if (req.body.descripcion != null) res.promocion.descripcion = req.body.descripcion;
  if (req.body.fechaInicio != null) res.promocion.fechaInicio = req.body.fechaInicio;
  if (req.body.fechaFin != null) res.promocion.fechaFin = req.body.fechaFin;
  if (req.body.descuento != null) res.promocion.descuento = req.body.descuento;

  try {
    const promocionActualizada = await res.promocion.save();
    res.json(promocionActualizada);
  } catch (err) {
    res.status(400).json({ message: "No se pudo actualizar la promoción" });
  }
});

// Eliminar una promoción
router.delete('/:id', getPromocion, async (req, res) => {
  try {
    await res.promocion.remove();
    res.json({ message: 'Promoción eliminada' });
  } catch (err) {
    res.status(500).json({ message: "No se pudo eliminar la promoción" });
  }
});

// Middleware para obtener promoción por ID
async function getPromocion(req, res, next) {
  let promocion;
  try {
    promocion = await Promocion.findById(req.params.id);
    if (promocion == null) {
      return res.status(404).json({ message: 'No se encontró la promoción' });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error al buscar la promoción" });
  }

  res.promocion = promocion;
  next();
}

module.exports = router;
