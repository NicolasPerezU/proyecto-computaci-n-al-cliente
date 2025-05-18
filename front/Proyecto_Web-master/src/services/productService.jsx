export const obtenerProductos = async () => {
  const res = await fetch('http://localhost:3000/api/productos');
  if (!res.ok) throw new Error('Error al obtener productos');
  return res.json();
};
