import React, { useState, useEffect } from 'react';

function Empleados() {
  const [empleados, setEmpleados] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  useEffect(() => {
    const fetchEmpleados = async () => {
      try {
        
        const response = await fetch('http://localhost:3000/api/empleados');

        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        setEmpleados(data); 
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employees:", error);
        setError(error); 
        setLoading(false); 
      }
    };

    fetchEmpleados(); 
  }, []);

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white"> 
        <div className="text-xl font-semibold">Cargando empleados...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-red-500"> 
        <div className="text-xl font-semibold">Error al cargar los empleados: {error.message}</div>
      </div>
    );
  }

  return (
    <div id="Empleados" className="container mx-auto p-8 bg-gray-920 shadow-lg rounded-lg my-10 text-white"> 
      <h1 className="text-4xl font-extrabold uppercase mb-8 text-center text-white">Nuestro Personal</h1> 

      
      {empleados.length > 0 ? (
        <div className="overflow-x-auto border border-yellow-700 rounded-lg"> 
          <table className="min-w-full divide-y divide-gray-700"><thead className="bg-gray-800"><tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Puesto</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Salario</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Contratación</th>
                 
              </tr></thead><tbody className="bg-gray-900 divide-y divide-gray-700">
              {empleados.map((empleado, index) => (
                <tr key={empleado._id} className={index % 2 === 0 ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-900 hover:bg-gray-800'}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{empleado.nombre}</td> {/* Texto blanco */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{empleado.puesto}</td> {/* Texto gris claro */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{parseFloat(empleado.salario).toFixed(2)}</td> {/* Asegura que sea un número antes de formatear */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(empleado.fechaContratacion).toLocaleDateString()}</td> {/* Formatea la fecha, texto gris claro */}
                
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
