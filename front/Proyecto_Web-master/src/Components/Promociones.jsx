import React, { useState, useEffect } from 'react';

function Promociones() {
  const [promociones, setPromociones] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  
  useEffect(() => {
    const fetchPromociones = async () => {
      try {
        
        const response = await fetch('http://localhost:3000/api/promociones'); 

        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json(); 
        setPromociones(data); 
        setLoading(false); 
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setError(error); 
        setLoading(false); 
      }
    };

    fetchPromociones(); 
  }, []); 

  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-white"> 
        <div className="text-xl font-semibold">Cargando promociones...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-950 text-red-500"> 
        <div className="text-xl font-semibold">Error al cargar las promociones: {error.message}</div>
      </div>
    );
  }

  return (
    <div id="Promociones" className="container mx-auto p-8 bg-gray-920 shadow-lg rounded-lg my-10 text-white"> 
      <h1 className="text-4xl font-extrabold uppercase mb-8 text-center text-white">Nuestras Promociones</h1> 

      
      {promociones.length > 0 ? (
        <div className="overflow-x-auto border border-yellow-700 rounded-lg"> 
          <table className="min-w-full divide-y divide-gray-700"><thead className="bg-gray-800"><tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nombre</th> 
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descripción</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Inicio</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Fecha de Fin</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Descuento (%)</th>
                
              </tr></thead><tbody className="bg-gray-900 divide-y divide-gray-700">
              {promociones.map((promocion, index) => (
                <tr
                  key={promocion._id}
                  className={index % 2 === 0 ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-900 hover:bg-gray-800'} 
                ><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{promocion.nombre}</td> {/* Texto blanco */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{promocion.descripcion}</td> {/* Texto gris claro */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(promocion.fechaInicio).toLocaleDateString()}</td> {/* Formatea la fecha, texto gris claro */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{new Date(promocion.fechaFin).toLocaleDateString()}</td> {/* Formatea la fecha, texto gris claro */}<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{promocion.descuento}%</td> {/* Texto gris claro */}
                 
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
