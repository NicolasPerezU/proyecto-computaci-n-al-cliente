import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatosUsuario from '../components/DatosUsuario'; 
import ListaReservas from '../components/ListaReservas';
import HistorialOrdenes from '../components/HistorialOrdenes';



function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombres: '', apellidos: '', email: '' });
  const [reservas, setReservas] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [loadingOrdenes, setLoadingOrdenes] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
  const user = JSON.parse(localStorage.getItem('usuario'));
  setUsuario(user);
  setForm(user);

  const token = localStorage.getItem('token');

  
  const fetchReservas = async () => {
    try {
      
      const url = user.rol === 'admin'
        ? 'http://localhost:3000/api/reservas/todas' 
        : 'http://localhost:3000/api/reservas/reservasUsuario'; 

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Error al obtener reservas');
      const data = await res.json();
      setReservas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingReservas(false);
    }
  };

  
  const fetchOrdenes = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/orders/mis-ordenes', { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Error al obtener órdenes');
      const data = await res.json();
      setOrdenes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingOrdenes(false);
    }
  };

  fetchReservas();
  fetchOrdenes();
}, []);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:3000/api/auth/actualizar', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Error al actualizar');

      const data = await res.json();
      setUsuario(data.usuario);
      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      setEditando(false);
      alert('Datos actualizados correctamente');
    } catch (error) {
      console.error('Error al actualizar:', error);
      alert('Ocurrió un error al guardar los cambios');
    }
  };

  const cancelarReserva = async (id) => {
    const confirmacion = window.confirm("¿Está seguro que desea cancelar esta reserva?");
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/reservas/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Error al cancelar la reserva');

      setReservas(reservas.filter(reserva => reserva._id !== id));
      alert("Reserva cancelada correctamente.");
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al cancelar la reserva.");
    }
  };

  const cancelarOrden = async (orderId) => {
    const confirmacion = window.confirm("¿Seguro que deseas cancelar este pedido?");
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Error al cancelar la orden');
      alert('Pedido cancelado correctamente');
      setOrdenes(ordenes.filter(o => o._id !== orderId));
    } catch (error) {
      console.error(error);
      alert('No se pudo cancelar el pedido');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Perfil del Usuario</h1>

      {usuario && (
  <DatosUsuario
    usuario={usuario}
    form={form}
    setForm={setForm}
    editando={editando}
    setEditando={setEditando}
    handleGuardar={handleGuardar}
  />
)}


      <h2 className="text-2xl font-semibold mb-4">
  {usuario?.rol === 'admin' ? 'Todas las reservas' : 'Mis reservas'}
</h2>

{loadingReservas ? (
  <p>Cargando...</p>
) : (
  <ListaReservas reservas={reservas} cancelarReserva={cancelarReserva} />
)}


      <h2 className="text-2xl font-semibold mt-8 mb-4">Historial de órdenes</h2>
{loadingOrdenes ? (
  <p>Cargando órdenes...</p>
) : (
  <HistorialOrdenes ordenes={ordenes} cancelarOrden={cancelarOrden} />
)}


      <button
        onClick={() => navigate('/')}
        className="mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
      >
        Volver a la página principal
      </button>
    </div>
  );
}

export default Perfil;
