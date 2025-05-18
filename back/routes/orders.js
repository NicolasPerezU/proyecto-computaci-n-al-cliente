const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User'); 

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    req.user = {
      userId: user._id,
      role: user.rol,
      email: user.email
    };

    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
};



router.post('/', verifyToken, async (req, res) => {
  const { productos } = req.body;

  if (!productos || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: "El pedido debe contener al menos un producto." });
  }

  const total = productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  try {
    const carrito = await Order.findOne({ userId: req.user.userId, estado: "carrito" });
    if (carrito) {
      
      carrito.productos = productos;
      carrito.total = total;
      carrito.estado = "pendiente";
      await carrito.save();
      return res.status(201).json(carrito); 
    }

    const nuevaOrden = new Order({
      userId: req.user.userId,
      productos,
      total,
      estado: "pendiente"
    });

    await nuevaOrden.save();
    res.status(201).json(nuevaOrden);

  } catch (error) {
    console.error("Error al registrar la orden:", error);
    res.status(500).json({ error: "Error al registrar la orden." });
  }
});


router.get('/todas', verifyToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden ver todas las órdenes.' });
  }

  try {
    const ordenes = await Order.find().sort({ createdAt: -1 }).populate('userId', 'nombres apellidos email');
    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener todas las órdenes:", error);
    res.status(500).json({ error: "Error al obtener todas las órdenes." });
  }
});


router.get('/mis-ordenes', verifyToken, async (req, res) => {
  try {
    const ordenes = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ error: "Error al obtener las órdenes." });
  }
});




router.post('/add-to-cart', verifyToken, async (req, res) => {
    const { productoId, nombre, precio, cantidad } = req.body;

    if (!productoId || !nombre || precio === undefined || cantidad === undefined || cantidad <= 0) {
        return res.status(400).json({ error: "Se requieren productoId, nombre, precio y una cantidad válida." });
    }

    try {
        let order = await Order.findOne({ userId: req.user.userId, estado: "carrito" });

        if (!order) {
            
            order = new Order({
                userId: req.user.userId,
                productos: [{ productoId, nombre, precio, cantidad }],
                total: precio * cantidad,
                estado: "carrito"
            });
        } else {
            
            const itemIndex = order.productos.findIndex(item => item.productoId === productoId);

            if (itemIndex > -1) {
                
                order.productos[itemIndex].cantidad += cantidad;
            } else {
                
                order.productos.push({ productoId, nombre, precio, cantidad });
            }

            
            order.total = order.productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
        }

        await order.save();
        res.json({ message: "Producto añadido al carrito exitosamente.", order });

    } catch (error) {
        console.error("Error al añadir producto al carrito:", error);
        res.status(500).json({ error: "Error al añadir producto al carrito." });
    }
});


router.put('/update-item/:productId', verifyToken, async (req, res) => {
    const { productId } = req.params;
    const { cantidad } = req.body;

    if (cantidad === undefined || cantidad < 0) {
        return res.status(400).json({ error: "Se requiere una cantidad válida (mayor o igual a 0)." });
    }

    try {
        const order = await Order.findOne({ userId: req.user.userId, estado: "carrito" });

        if (!order) {
            return res.status(404).json({ error: "No se encontró un carrito activo." });
        }

        const itemIndex = order.productos.findIndex(item => item.productoId === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ error: "Producto no encontrado en el carrito." });
        }

        if (cantidad === 0) {
            
            order.productos.splice(itemIndex, 1);
        } else {
            
            order.productos[itemIndex].cantidad = cantidad;
        }

        
        order.total = order.productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        await order.save();
        res.json({ message: "Cantidad del producto actualizada.", order });

    } catch (error) {
        console.error("Error al actualizar cantidad del producto en el carrito:", error);
        res.status(500).json({ error: "Error al actualizar cantidad del producto en el carrito." });
    }
});


router.delete('/remove-item/:productId', verifyToken, async (req, res) => {
    const { productId } = req.params;

    try {
        const order = await Order.findOne({ userId: req.user.userId, estado: "carrito" });

        if (!order) {
            return res.status(404).json({ error: "No se encontró un carrito activo." });
        }

        const initialProductCount = order.productos.length;
        order.productos = order.productos.filter(item => item.productoId !== productId);

        if (order.productos.length === initialProductCount) {
             return res.status(404).json({ error: "Producto no encontrado en el carrito." });
        }


        
        order.total = order.productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

        await order.save();
        res.json({ message: "Producto eliminado del carrito.", order });

    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ error: "Error al eliminar producto del carrito." });
    }
});



router.get('/', verifyToken, async (req, res) => {
  try {
    const order = await Order.findOne({ userId: req.user.userId, estado: "carrito" });
    if (!order) {
        
      return res.json({ userId: req.user.userId, productos: [], total: 0, estado: "carrito" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito." });
  }
});


router.get('/ordenesUsuario', verifyToken, async (req, res) => {
  try {
    const ordenes = await Order.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(ordenes);
  } catch (error) {
    console.error("Error al obtener órdenes del usuario:", error);
    res.status(500).json({ error: "Error al obtener las órdenes del usuario." });
  }
});

router.put('/:orderId', verifyToken, async (req, res) => {
  const { orderId } = req.params;
  const { productos, estado } = req.body;

  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    return res.status(400).json({ error: "ID de orden inválido" });
  }

  try {
    const orden = await Order.findById(orderId);
    
    if (!orden) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    if (estado && req.user.role !== 'admin') {
      return res.status(403).json({ error: "Solo administradores pueden cambiar el estado" });
    }

     // El dueño puede actualizar productos
    if (productos && orden.userId.toString() !== req.user.userId.toString()) {
      return res.status(403).json({ error: "No tienes permiso para editar esta orden" });
    }

    const estadosValidos = ['pendiente', 'completada', 'cancelada'];
    if (estado && !estadosValidos.includes(estado)) {
      return res.status(400).json({ error: "Estado no válido" });
    }

    if (productos) {
      orden.productos = productos;
      orden.total = productos.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);
    }
    
    if (estado) {
      orden.estado = estado;
    }

    await orden.save();
    res.json({ message: "Orden actualizada exitosamente", orden });

  } catch (error) {
    console.error("Error al actualizar orden:", error);
    res.status(500).json({ error: "Error al actualizar orden" });
  }
});

router.delete('/:orderId', verifyToken, async (req, res) => {
  const { orderId } = req.params;
    try {
    const orden = await Order.findById({ _id: orderId }); 

    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "ID de orden inválido" });
    }

    if (!orden) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    // Permitir al admin o al dueño de la orden cancelarla
    if (orden.userId.toString() !== req.user.userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: "No tienes permiso para cancelar esta orden" });
    }

    await Order.findByIdAndDelete({ _id: orderId });
    res.json({ message: "Orden cancelada/eliminada correctamente" });
  } catch (error) {
    console.error("Error al cancelar la orden:", error);
    res.status(500).json({ error: "Error al cancelar la orden" });
  }
});



module.exports = router;
