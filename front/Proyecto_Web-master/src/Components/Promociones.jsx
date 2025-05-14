import React, { useState, useEffect } from 'react';

function Promociones() {
  const [promociones, setPromociones] = useState([]); // Estado para almacenar la lista de promociones
  const [loading, setLoading] = useState(true); // Estado para indicar si los datos se están cargando
  const [error, setError] = useState(null); // Estado para manejar errores

  // useEffect se ejecuta después de que el componente se renderiza por primera vez
  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        // Realiza la solicitud GET a la ruta de tu back-end para promociones
        // Asegúrate de que la URL y el puerto coincidan con tu configuración del back-end
        const response = await fetch('http://localhost:3000/api/promociones'); // Usar la ruta de promociones

        // Verifica si la respuesta fue exitosa (status 200-299)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); // Parsea la respuesta JSON
        setPromociones(data); // Actualiza el estado con las promociones
        setLoading(false); // Indica que la carga ha terminado
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setError(error); // Almacena el error en el estado
        setLoading(false); // Indica que la carga ha terminado (con error)
      }
    };

    fetchPromociones(); // Llama a la función para obtener las promociones cuando el componente se monte
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar

  // Renderizado condicional basado en el estado
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white"> {/* Fondo oscuro y texto blanco */}
        <div className="text-xl font-semibold">Cargando promociones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-red-500"> {/* Fondo oscuro y texto de error rojo */}
        <div className="text-xl font-semibold">Error al cargar las promociones: {error.message}</div>
      </div>
    );
  }

  return (
    <div id="Promociones" className="container mx-auto p-8 bg-gray-920 shadow-lg rounded-lg my-10 text-white"> {/* Contenedor con fondo oscuro, sombra, bordes redondeados y margen */}
      <h1 className="text-4xl font-extrabold uppercase mb-8 text-center text-white">Nuestras Promociones</h1> {/* Título con estilo similar al de "Sobre Nosotros" */}

      {/* Botón para agregar nueva promoción (comentado por ahora) */}
       {/* <div className="text-center mb-6"> */}
          {/* <button className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md"> */}
              {/* Agregar Nueva Promoción */}
          {/* </button> */}
      {/* </div> */}

      {/* Tabla para mostrar la lista de promociones */}
      {promociones.length > 0 ? (
        <div className="overflow-x-auto border border-yellow-700 rounded-lg"> {/* Borde con color de destaque */}
          <table className="min-w-full divide-y divide-gray-700"><thead className="bg-gray-800"><tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th> {/* Texto gris claro para el encabezado */}
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Inicio</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Fin</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descuento (%)</th>
                 {/* <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Acciones</th> */} {/* Comentado el encabezado de Acciones */}
              </tr></thead><tbody className="bg-gray-900 divide-y divide-gray-700">
              {promociones.map((promocion, index) => (
                <tr
                  key={promocion._id}
                  className={index % 2 === 0 ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-900 hover:bg-gray-800'} // Alterna colores de fila con tonos oscuros y hover
                ><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{promocion.nombre}</td> {/* Texto blanco */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{promocion.descripcion}</td> {/* Texto gris claro */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(promocion.fechaInicio).toLocaleDateString()}</td> {/* Formatea la fecha, texto gris claro */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(promocion.fechaFin).toLocaleDateString()}</td> {/* Formatea la fecha, texto gris claro */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{promocion.descuento}%</td> {/* Texto gris claro */}
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
        <p className="text-center text-gray-400 text-lg mt-8">No hay promociones disponibles.</p>
      )}
    </div>
  );
}

export default Promociones;
