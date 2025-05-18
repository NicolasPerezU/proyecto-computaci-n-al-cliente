const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
  },
  puesto: {
    type: String,
    required: [true, 'El puesto es requerido'],
    trim: true,
    maxlength: [100, 'El puesto no puede exceder los 100 caracteres']
  },
  salario: {
    type: Number,
    required: [true, 'El salario es requerido'],
    min: [0, 'El salario no puede ser negativo']
  },
  fechaContratacion: {
    type: Date,
    default: Date.now
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar fecha de actualización
empleadoSchema.pre('save', function(next) {
  this.fechaActualizacion = Date.now();
  next();
});

const Empleado = mongoose.model('Empleado', empleadoSchema);

module.exports = Empleado;