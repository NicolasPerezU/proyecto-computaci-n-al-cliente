import React from 'react';

const DatosUsuario = ({ usuario, form, setForm, editando, setEditando, handleGuardar }) => {
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md">
      {editando ? (
        <>
          <label className="block mb-2">
            <strong>Nombre:</strong>
            <input
              type="text"
              name="nombres"
              value={form.nombres}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-black"
            />
          </label>
          <label className="block mb-2">
            <strong>Apellido:</strong>
            <input
              type="text"
              name="apellidos"
              value={form.apellidos}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-black"
            />
          </label>
          <label className="block mb-2">
            <strong>Email:</strong>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full mt-1 p-2 rounded text-black"
            />
          </label>
          <div className="mt-4 space-x-2">
            <button
              onClick={handleGuardar}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
            >
              Guardar
            </button>
            <button
              onClick={() => {
                setForm(usuario);
                setEditando(false);
              }}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Cancelar
            </button>
          </div>
        </>
      ) : (
        <>
          <p><strong>Nombre:</strong> {usuario.nombres}</p>
          <p><strong>Apellido:</strong> {usuario.apellidos}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <button
            onClick={() => setEditando(true)}
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Editar datos
          </button>
        </>
      )}
    </div>
  );
};

export default DatosUsuario;
