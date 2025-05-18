require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(express.json());

app.use(cors({ origin: "http://localhost:5173" })); 



mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})


.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));


const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const reservaRoutes = require('./routes/reservas');
app.use('/api/reservas', reservaRoutes);

const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

const empleadosRoutes = require('./routes/empleados');
app.use('/api/empleados', empleadosRoutes);

const promocionesRoutes = require('./routes/promociones');
app.use('/api/promociones', promocionesRoutes);

const productosRoutes = require('./routes/producto');
app.use('/api/productos', productosRoutes);


app.get('/', (req, res) => {
  res.send('Backend funcionando correctamente');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);

});

