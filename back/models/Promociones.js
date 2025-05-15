const mongoose = require('mongoose');

const PromocionesSchema = mongoose.Schema({
    nombre: {
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
});

module.exports = mongoose.model('Promociones', PromocionesSchema);