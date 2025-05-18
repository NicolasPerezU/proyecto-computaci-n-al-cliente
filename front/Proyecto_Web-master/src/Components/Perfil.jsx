import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ListaReservas from '../components/ListaReservas';
import HistorialOrdenes from '../components/HistorialOrdenes';
import Empleados from '../Components/Empleados';

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ nombres: '', apellidos: '', email: '' });
  const [reservas, setReservas] = useState([]);
  const [ordenes, setOrdenes] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [loadingOrdenes, setLoadingOrdenes] = useState(true);
  const [empleados, setEmpleados] = useState([]);
  const [loadingEmpleados, setLoadingEmpleados] = useState(false);
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
          headers: { Authorization: `Bearer ${token}` },
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
        const url = user.rol === 'admin'
          ? 'http://localhost:3000/api/orders/todas'
          : 'http://localhost:3000/api/orders/mis-ordenes';
        const res = await fetch(url, { 
          headers: { Authorization: `Bearer ${token}` },
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

    const fetchEmpleados = async () => {
      if (user?.rol !== 'admin') return;
      
      setLoadingEmpleados(true);
      try {
        const res = await fetch('http://localhost:3000/api/empleados', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Error al obtener empleados');
        const data = await res.json();
        setEmpleados(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingEmpleados(false);
      }
    };

    fetchReservas();
    fetchOrdenes();
    if (user?.rol === 'admin') {
      fetchEmpleados();
    }
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

  const editarReserva = async (id, datos) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/reservas/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al editar reserva');
      }
      setReservas(prev => prev.map(r => r._id === id ? { ...r, ...datos } : r));
      alert("Reserva actualizada correctamente");
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al actualizar reserva");
      throw error;
    }
  };

  const cancelarReserva = async (id) => {
    const confirmacion = window.confirm("¿Está seguro que desea cancelar esta reserva?");
    if (!confirmacion) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:3000/api/reservas/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al cancelar la reserva');
      } 

      setReservas(reservas.filter(reserva => reserva._id !== id));
      alert("Reserva cancelada correctamente.");
    } catch (error) {
      console.error(error);
      alert("Hubo un problema al cancelar la reserva.");
    }
  };

  const editarOrden = async (id, datos) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/orders/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(datos),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Error al editar orden');
      }
      setOrdenes(prev => prev.map(o => o._id === id ? { ...o, ...datos } : o));
      alert("Orden actualizada correctamente");
    } catch (error) {
      console.error(error);
      alert(error.message || "Error al actualizar orden");
      throw error;
    }
  };

  const cancelarOrden = async (orderId) => {
    const confirmacion = window.confirm("¿Seguro que deseas cancelar este pedido?");
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const errorData = await res.json();
      if (!res.ok) {
        throw new Error(errorData.error || 'Error al cancelar la orden');
      } 
      setOrdenes(ordenes.filter(o => o._id !== orderId));
      alert('Pedido cancelado correctamente');
    } catch (error) {
      console.error(error);
      alert(error.message || 'No se pudo cancelar el pedido');
    }
  };

  const crearEmpleado = async (empleadoData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/empleados', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(empleadoData),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al crear empleado');
      }

      const nuevoEmpleado = await res.json();
      setEmpleados(prev => [...prev, nuevoEmpleado]);
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const actualizarEmpleado = async (id, empleadoData) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/empleados/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(empleadoData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al actualizar empleado');
      }

      const empleadoActualizado = await res.json();
      setEmpleados(prev => prev.map(e => e._id === id ? empleadoActualizado : e));
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  const eliminarEmpleado = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/empleados/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Error al eliminar empleado');
      }

      setEmpleados(prev => prev.filter(e => e._id !== id));
      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false, error: error.message };
    }
  };

  // Componente DatosUsuario integrado
  const DatosUsuario = ({ usuario, form, setForm, editando, setEditando, handleGuardar }) => {
    return (
      <div>
        <div className="flex items-center space-x-4 mb-6">
          <div className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold">
            {usuario.nombres.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold">{usuario.nombres} {usuario.apellidos}</h3>
            <p className="text-gray-400">{usuario.email}</p>
            <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-blue-900 text-blue-100">
              {usuario.rol === 'admin' ? 'Administrador' : 'Usuario'}
            </span>
          </div>
        </div>

        {!editando ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombres</label>
              <p className="bg-gray-700 px-4 py-2 rounded-lg">{usuario.nombres}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Apellidos</label>
              <p className="bg-gray-700 px-4 py-2 rounded-lg">{usuario.apellidos}</p>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <p className="bg-gray-700 px-4 py-2 rounded-lg">{usuario.email}</p>
            </div>
            <button
              onClick={() => setEditando(true)}
              className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg transition-all duration-300"
            >
              Editar Perfil
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nombres</label>
              <input
                type="text"
                name="nombres"
                value={form.nombres}
                onChange={(e) => setForm({...form, nombres: e.target.value})}
                className="w-full bg-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Apellidos</label>
              <input
                type="text"
                name="apellidos"
                value={form.apellidos}
                onChange={(e) => setForm({...form, apellidos: e.target.value})}
                className="w-full bg-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-gray-700 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleGuardar}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 rounded-lg transition-all duration-300"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => setEditando(false)}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 rounded-lg transition-all duration-300"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              Panel de Usuario
            </h1>
            <p className="text-gray-400 mt-2">
              {usuario?.rol === 'admin' ? 'Panel de Administrador' : 'Mi cuenta'}
            </p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <span>Volver al inicio</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl shadow-xl p-6 h-full">
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
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-orange-600 to-orange-800 px-6 py-4">
                <h2 className="text-2xl font-bold">
                  {usuario?.rol === 'admin' ? 'Todas las reservas' : 'Mis reservas'}
                </h2>
              </div>
              <div className="p-6">
                {loadingReservas ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
                  </div>
                ) : (
                  <ListaReservas 
                    reservas={reservas} 
                    cancelarReserva={cancelarReserva} 
                    editarReserva={editarReserva} 
                    esAdmin={usuario?.rol === 'admin'} 
                  />
                )}
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4">
                <h2 className="text-2xl font-bold">
                  {usuario?.rol === 'admin' ? 'Todas las órdenes' : 'Mis órdenes'}
                </h2>
              </div>
              <div className="p-6">
                {loadingOrdenes ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
                  </div>
                ) : (
                  <HistorialOrdenes 
                    ordenes={ordenes} 
                    cancelarOrden={cancelarOrden} 
                    editarOrden={editarOrden} 
                    esAdmin={usuario?.rol === 'admin'} 
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {usuario?.rol === 'admin' && (
          <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 px-6 py-4">
              <h2 className="text-2xl font-bold">Gestión de Empleados</h2>
            </div>
            <div className="p-6">
              {loadingEmpleados ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <Empleados 
                  empleados={empleados} 
                  onCreate={crearEmpleado}
                  onUpdate={actualizarEmpleado}
                  onDelete={eliminarEmpleado}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Perfil;