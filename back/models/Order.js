const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productoId: { type: String, required: false }, 
  nombre: { type: String, required: true },
  precio: { type: Number, required: true },
  cantidad: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  productos: [orderItemSchema],
  total: { type: Number, required: true },
  estado: { type: String, default: "carrito" } 
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
