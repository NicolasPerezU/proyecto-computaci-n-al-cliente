const express = require('express');
const router = express.Router();
const Empleado = require('../models/Empleados'); 

// Obtener informacion de todos los empleados
router.get('/', async (req, res) => {
  try {
    const empleados = await Empleado.find();
    res.json(empleados);
  } catch (err) {
    res.status(500).json({ message: "No se pudo obtener la información" });
  }
});

// Crear un nuevo empleado
router.post('/', async (req, res) => {
  const nuevoEmpleado = new Empleado({
    nombre: req.body.nombre,
    puesto: req.body.puesto,
    fecha_contratacion: req.body.fecha_contratacion,
    salario: req.body.salario
  });

  try {
    const empleadoGuardado = await nuevoEmpleado.save();
    res.status(201).json(empleadoGuardado);
  } catch (err) {
    res.status(400).json({ message: "No se pudo registrar al empleado" });
  }
});

// Obtener un empleado por su ID
router.get('/:id', getEmpleado, (req, res) => {
  res.json(res.empleado);
});

// Actualizar un empleado
router.patch('/:id', getEmpleado, async (req, res) => {
  if (req.body.nombre != null) {
    res.empleado.nombre = req.body.nombre;
  }
  if (req.body.puesto != null) {
    res.empleado.puesto = req.body.puesto;
  }
  if (req.body.fecha_contratacion != null) {
    res.empleado.fecha_contratacion = req.body.fecha_contratacion;
  }
  if (req.body.salario != null) {
    res.empleado.salario = req.body.salario;
  }

  try {
    const empleadoActualizado = await res.empleado.save();
    res.json(empleadoActualizado);
  } catch (err) {
    res.status(400).json({ message: "No se pudo actualizar la información" });
  }
});

// Eliminar un empleado
router.delete('/:id', getEmpleado, async (req, res) => {
  try {
    await res.empleado.remove();
    res.json({ message: 'Empleado eliminado' });
  } catch (err) {
    res.status(500).json({ message: "No se pudo eliminar al empleado" });
  }
});

// Middleware para obtener un empleado por ID
async function getEmpleado(req, res, next) {
  let empleado;
  try {
    empleado = await Empleado.findById(req.params.id);
    if (empleado == null) {
      return res.status(404).json({ message: 'No se encontró el empleado' });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error al buscar el empleado" });
  }

  res.empleado = empleado;
  next();
}

module.exports = router;
