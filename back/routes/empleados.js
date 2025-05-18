const express = require('express');
const router = express.Router();
const Empleado = require('../models/Empleados');
const { authenticateJWT, authorizeAdmin } = require('../jwt/logic');

// Aplicar middleware a todas las rutas
router.use(authenticateJWT, authorizeAdmin);

// Obtener todos los empleados
router.get('/', async (req, res) => {
  try {
    const empleados = await Empleado.find().sort({ fechaContratacion: -1 });
    res.json(empleados);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear nuevo empleado
router.post('/', async (req, res) => {
  try {
    // Validación básica
    if (!req.body.nombre || !req.body.puesto || !req.body.salario) {
      return res.status(400).json({ message: 'Nombre, puesto y salario son requeridos' });
    }

    const empleado = new Empleado({
      nombre: req.body.nombre,
      puesto: req.body.puesto,
      salario: req.body.salario,
      fechaContratacion: req.body.fechaContratacion || new Date()
    });

    const nuevoEmpleado = await empleado.save();
    res.status(201).json(nuevoEmpleado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar empleado
router.patch('/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    if (req.body.nombre) empleado.nombre = req.body.nombre;
    if (req.body.puesto) empleado.puesto = req.body.puesto;
    if (req.body.salario) empleado.salario = req.body.salario;
    if (req.body.fechaContratacion) empleado.fechaContratacion = req.body.fechaContratacion;

    const empleadoActualizado = await empleado.save();
    res.json(empleadoActualizado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar empleado
router.delete('/:id', async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) {
      return res.status(404).json({ message: 'Empleado no encontrado' });
    }

    await empleado.deleteOne();
    res.json({ message: 'Empleado eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;