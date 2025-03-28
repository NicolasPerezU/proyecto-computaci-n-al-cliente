const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();


router.post('/register', async (req, res) => {
  const { nombres, apellidos, email, contraseña } = req.body;

  if (!nombres || !apellidos || !email || !contraseña) {
    return res.status(400).json({ error: 'Todos los campos son requeridos.' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(contraseña, 10);

    const newUser = new User({
      nombres,
      apellidos,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Usuario registrado exitosamente.' });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
});

module.exports = router;

const jwt = require('jsonwebtoken');


router.post('/login', async (req, res) => {
  const { email, contraseña } = req.body;

  
  if (!email || !contraseña) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  try {
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    
    const isMatch = await bcrypt.compare(contraseña, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciales inválidas.' });
    }

    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, usuario: { nombres: user.nombres, email: user.email } });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión.' });
  }
});

module.exports = router;