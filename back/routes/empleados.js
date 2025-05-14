const express = require('express');
const router = express.Router();
const Empleados = require('../models/Empleados');

// Get all employees
router.get('/', async (req, res) => {
  try {
    const empleados = await Empleados.find();
    res.json(empleados);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single employee by ID
router.get('/:id', async (req, res) => {
  try {
    const empleado = await Empleados.findById(req.params.id);
    if (empleado == null) {
      return res.status(404).json({ message: 'Cannot find employee' });
    }
    res.json(empleado);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new employee
router.post('/', async (req, res) => {
  const empleado = new Empleados({
    nombre: req.body.nombre,
    puesto: req.body.puesto,
    salario: req.body.salario,
    fechaContratacion: req.body.fechaContratacion
  });

  try {
    const nuevoEmpleado = await empleado.save();
    res.status(201).json(nuevoEmpleado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update an employee by ID
router.patch('/:id', async (req, res) => {
  try {
    const empleado = await Empleados.findById(req.params.id);
    if (empleado == null) {
      return res.status(404).json({ message: 'Cannot find employee' });
    }

    if (req.body.nombre != null) {
      empleado.nombre = req.body.nombre;
    }
    if (req.body.puesto != null) {
      empleado.puesto = req.body.puesto;
    }
    if (req.body.salario != null) {
      empleado.salario = req.body.salario;
    }
    if (req.body.fechaContratacion != null) {
      empleado.fechaContratacion = req.body.fechaContratacion;
    }

    const updatedEmpleado = await empleado.save();
    res.json(updatedEmpleado);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an employee by ID
router.delete('/:id', async (req, res) => {
  try {
    const empleado = await Empleados.findById(req.params.id);
    if (empleado == null) {
      return res.status(404).json({ message: 'Cannot find employee' });
    }

    await empleado.remove();
    res.json({ message: 'Deleted employee' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;