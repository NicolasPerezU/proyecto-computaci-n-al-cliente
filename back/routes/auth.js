const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();


const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado o mal formato' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};


const authorizeAdmin = (req, res, next) => {
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado: solo administradores' });
  }
  next();
};


router.post('/register', async (req, res) => {
  const { nombres, apellidos, email, password } = req.body;

  if (!nombres || !apellidos || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      nombres,
      apellidos,
      email,
      password: hashedPassword,
      rol: 'user',  
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, usuario: { nombres: user.nombres, apellidos:user.apellidos, email: user.email, rol: user.rol } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
});


router.get('/usuarios', authenticateJWT, authorizeAdmin, async (req, res) => {
  try {
    const usuarios = await User.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
});


router.put('/actualizar', authenticateJWT, async (req, res) => {
  const { nombres, apellidos, email } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    
    if (nombres) user.nombres = nombres;
    if (apellidos) user.apellidos = apellidos;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: 'Datos actualizados correctamente',
      usuario: {
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({ error: 'Error al actualizar los datos del usuario' });
  }
});


module.exports = router;
