import React, { useState, useEffect } from 'react';

function Empleados() {
  const [empleados, setEmpleados] = useState([]); // Estado para almacenar la lista de empleados
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos se están cargando
  const [error, setError] = useState(null); // Estado para manejar errores
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        // Realiza la solicitud GET a la ruta de tu back-end
        // Asegúrate de que la URL y el puerto coincidan con tu configuración del back-end
        const response = await fetch('http://localhost:3000/api/empleados'); // Usa el puerto 3000

        // Verifica si la respuesta fue exitosa (status 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parsea la respuesta JSON
        setEmpleados(data); // Actualiza el estado con los empleados
        setLoading(false); // Indica que la carga ha terminado
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(error); // Almacena el error en el estado
        setLoading(false); // Indica que la carga ha terminado (con error)
      }
    };

    fetchEmpleados(); // Llama a la función para obtener los empleados cuando el componente se monte
  }, []);

  // Renderizado condicional basado en el estado
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white"> {/* Fondo oscuro y texto blanco */}
        <div className="text-xl font-semibold">Cargando empleados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-red-500"> {/* Fondo oscuro y texto de error rojo */}
        <div className="text-xl font-semibold">Error al cargar los empleados: {error.message}</div>
      </div>
    );
  }

  return (
    <div id="Empleados" className="container mx-auto p-8 bg-gray-920 shadow-lg rounded-lg my-10 text-white"> {/* Contenedor con fondo oscuro, sombra, bordes redondeados y margen */}
      <h1 className="text-4xl font-extrabold uppercase mb-8 text-center text-white">Nuestro Personal</h1> {/* Título con estilo similar al de "Sobre Nosotros" */}

      {/* Botón para agregar nuevo empleado */}
       {/* <div className="text-center mb-6"> {/* Margen ajustado */}
          {/* <button className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md"> */}
              {/* Agregar Nuevo Empleado */}
          {/* </button> */}
      {/* </div> */}

      {/* Tabla para mostrar la lista de empleados */}
      {empleados.length > 0 ? (
        <div className="overflow-x-auto border border-yellow-700 rounded-lg"> {/* Borde con color de destaque */}
          <table className="min-w-full divide-y divide-gray-700"><thead className="bg-gray-800"><tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th> {/* Texto gris claro para el encabezado */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Puesto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Salario</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Contratación</th>
                 {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th> */} {/* Comentado el encabezado de Acciones */}
              </tr></thead><tbody className="bg-gray-900 divide-y divide-gray-700">
              {empleados.map((empleado, index) => (
                <tr key={empleado._id} className={index % 2 === 0 ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-900 hover:bg-gray-800'}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{empleado.nombre}</td> {/* Texto blanco */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{empleado.puesto}</td> {/* Texto gris claro */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{parseFloat(empleado.salario).toFixed(2)}</td> {/* Asegura que sea un número antes de formatear */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(empleado.fechaContratacion).toLocaleDateString()}</td> {/* Formatea la fecha, texto gris claro */}
                  {/* Celdas para acciones */}
                   {/* <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"> */}
                    {/* <a href="#" className="text-blue-400 hover:text-blue-300 mr-4">Editar</a> */} {/* Enlaces de acción con estilo azul claro */}
                    {/* <a href="#" className="text-red-400 hover:text-red-300">Eliminar</a> */} {/* Enlaces de acción con estilo rojo claro */}
                  {/* </td> */} {/* Comentada la celda de Acciones */}
                </tr>
              ))}
            </tbody></table>
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg mt-8">No hay empleados disponibles.</p>
      )}
    </div>
  );
}

export default Empleados;
