const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');


router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});


router.post('/', async (req, res) => {
  try {
    const nuevoProducto = new Producto(req.body);
    await nuevoProducto.save();
    res.status(201).json({ message: 'Producto creado correctamente' });
  } catch (err) {
    res.status(400).json({ error: 'Error al crear producto' });
  }
});


router.put('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const productoActualizado = await Producto.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto actualizado correctamente', producto: productoActualizado });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Error al actualizar el producto' });
  }
});

module.exports = router;
