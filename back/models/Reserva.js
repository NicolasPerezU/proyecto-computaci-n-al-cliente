const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  celular: { 
    type: String, 
    required: true 
  },
  fechaReserva: { 
    type: Date, 
    required: true 
  },
  horaReserva: { 
    type: String, 
    required: true 
  },
  numeroPersonas: { 
    type: Number, 
    required: true 
  },
  comentario: { 
    type: String 
  }
}, { timestamps: true });

module.exports = mongoose.model('Reserva', reservaSchema);
