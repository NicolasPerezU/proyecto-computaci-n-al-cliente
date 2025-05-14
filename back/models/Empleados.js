const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  puesto: {
    type: String,
    required: true
  },
  salario: {
    type: Number,
    required: true
  },
  fechaContratacion: {
    type: Date,
    default: Date.now
  }
});

const Empleado = mongoose.model('Empleado', empleadoSchema);

module.exports = Empleado;