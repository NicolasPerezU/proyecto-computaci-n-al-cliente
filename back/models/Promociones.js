const mongoose = require('mongoose');

const PromocionSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  fechaInicio: {
    type: Date,
    required: true
  },
  fechaFin: {
    type: Date,
    required: true
  },
  descuento: {
    type: Number,
    required: true
  }
}, {timestamps: true});

module.exports = mongoose.model('Promociones', PromocionSchema);