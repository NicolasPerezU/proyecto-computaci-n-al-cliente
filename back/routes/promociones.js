const express = require('express');
const router = express.Router();
const Promociones = require('../models/Promociones');


router.get('/', async (req, res) => {
  try {
    const promociones = await Promociones.find();
    res.json(promociones);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const promocion = await Promociones.findById(req.params.id);
    if (promocion == null) {
      return res.status(404).json({ message: 'Cannot find promotion' });
    }
    res.json(promocion);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post('/', async (req, res) => {
  const promocion = new Promociones({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    fechaInicio: req.body.fechaInicio,
    fechaFin: req.body.fechaFin,
    descuento: req.body.descuento
  });

  try {
    const newPromocion = await promocion.save();
    res.status(201).json(newPromocion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.patch('/:id', async (req, res) => {
  try {
    const promocion = await Promociones.findById(req.params.id);
    if (promocion == null) {
      return res.status(404).json({ message: 'Cannot find promotion' });
    }

    if (req.body.nombre != null) {
      promocion.nombre = req.body.nombre;
    }
    if (req.body.descripcion != null) {
      promocion.descripcion = req.body.descripcion;
    }
    if (req.body.fechaInicio != null) {
      promocion.fechaInicio = req.body.fechaInicio;
    }
    if (req.body.fechaFin != null) {
      promocion.fechaFin = req.body.fechaFin;
    }
    if (req.body.descuento != null) {
      promocion.descuento = req.body.descuento;
    }

    const updatedPromocion = await promocion.save();
    res.json(updatedPromocion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const promocion = await Promociones.findByIdAndDelete(req.params.id);
    if (promocion == null) {
      return res.status(404).json({ message: 'Cannot find promotion' });
    }
    res.json({ message: 'Deleted promotion' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;