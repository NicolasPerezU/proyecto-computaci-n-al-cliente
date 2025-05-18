import React, { useState } from 'react';
import { FaEdit, FaTrash, FaPlus, FaTimes, FaCheck } from 'react-icons/fa';

function Empleados({ empleados, onCreate, onUpdate, onDelete }) {
   const [editandoId, setEditandoId] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    puesto: '',
    salario: '',
    fechaContratacion: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditarClick = (empleado) => {
    setEditandoId(empleado._id);
    setFormData({
      nombre: empleado.nombre,
      puesto: empleado.puesto,
      salario: empleado.salario.toString(),
      fechaContratacion: empleado.fechaContratacion.split('T')[0]
    });
  };

  const handleCancelarEdicion = () => {
    setEditandoId(null);
    setFormData({
      nombre: '',
      puesto: '',
      salario: '',
      fechaContratacion: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const empleadoData = {
      ...formData,
      salario: parseFloat(formData.salario),
      fechaContratacion: new Date(formData.fechaContratacion).toISOString()
    };

    try {
      let result;
      if (editandoId) {
        result = await onUpdate(editandoId, empleadoData);
      } else {
        result = await onCreate(empleadoData);
      }

      if (result.success) {
        setEditandoId(null);
        setMostrarFormulario(false);
        setFormData({
          nombre: '',
          puesto: '',
          salario: '',
          fechaContratacion: ''
        });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error');
    }
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este empleado?')) {
      const result = await onDelete(id);
      if (!result.success) {
        setError(result.error);
      }
    }
  };

  return (
    <div className="mb-8">
      {error && <div className="mb-4 p-2 bg-red-600 text-white rounded">{error}</div>}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Lista de Empleados</h3>
        <button
          onClick={() => {
            setMostrarFormulario(!mostrarFormulario);
            setEditandoId(null);
          }}
          className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          {mostrarFormulario ? <FaTimes className="mr-1" /> : <FaPlus className="mr-1" />}
          {mostrarFormulario ? 'Cancelar' : 'Nuevo Empleado'}
        </button>
      </div>

      {(mostrarFormulario || editandoId) && (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-800 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm mb-1">Nombre:</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Puesto:</label>
              <input
                type="text"
                name="puesto"
                value={formData.puesto}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Salario:</label>
              <input
                type="number"
                name="salario"
                value={formData.salario}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Fecha de Contratación:</label>
              <input
                type="date"
                name="fechaContratacion"
                value={formData.fechaContratacion}
                onChange={handleInputChange}
                className="w-full p-2 bg-gray-700 rounded"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            {editandoId && (
              <button
                type="button"
                onClick={handleCancelarEdicion}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 rounded text-white flex items-center"
              >
                <FaTimes className="mr-1" /> Cancelar
              </button>
            )}
            <button
              type="submit"
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white flex items-center"
            >
              <FaCheck className="mr-1" /> {editandoId ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Puesto</th>
              <th className="px-4 py-2 text-left">Salario</th>
              <th className="px-4 py-2 text-left">Fecha Contratación</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {Empleados.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-2 text-center text-gray-400">No hay empleados registrados</td>
              </tr>
            ) : (
              empleados.map(empleado => (
                <tr key={empleado._id} className="border-t border-gray-700 hover:bg-gray-750">
                  <td className="px-4 py-2">{empleado.nombre}</td>
                  <td className="px-4 py-2">{empleado.puesto}</td>
                  <td className="px-4 py-2">${parseFloat(empleado.salario).toFixed(2)}</td>
                  <td className="px-4 py-2">{new Date(empleado.fechaContratacion).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditarClick(empleado)}
                        className="p-1 text-blue-400 hover:text-blue-300"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleEliminar(empleado._id)}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Empleados;
