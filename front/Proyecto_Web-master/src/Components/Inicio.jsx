import React, { useState } from "react";
import Slider from "../Components/Slider1";
import imagen7 from "../img/imagen4.jpg";
import Slider2 from "./slider2";
import { useCart } from "../Hooks/Carrito";
import { useProductos } from "../Hooks/Productos";
import axios from "axios";

function Inicio() {
  const { addItemToCart } = useCart();
  const { productos, loading, error } = useProductos();
  const [editandoProductoId, setEditandoProductoId] = useState(null);
  const [formularioProducto, setFormularioProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
  });

  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const esAdmin = usuario?.rol === "admin";

  const isAuthenticated = () => !!localStorage.getItem("token");

  const handleAddToCart = (product) => {
    if (!isAuthenticated()) {
      alert("Por favor, inicia sesión para añadir productos al carrito.");
      return;
    }
    addItemToCart(product);
  };

  const handleEditarClick = (producto) => {
    setEditandoProductoId(producto._id);
    setFormularioProducto({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
    });
  };

  const handleInputChange = (e) => {
    setFormularioProducto({
      ...formularioProducto,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardarCambios = async (productoId) => {
    const token = localStorage.getItem("token");

    try {
      await axios.put(
        `http://localhost:3000/api/productos/${productoId}`,
        formularioProducto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Producto actualizado correctamente.");
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Error al actualizar el producto.");
    }
  };

  return (
    <section id="Inicio" className="home-page bg-black text-white">
      <Slider />

      
      <div
        id="SobreNosotros"
        className="container mx-auto my-10 flex flex-wrap bg-gray-920 p-8 rounded-lg shadow-lg"
      >
        <div className="hidden lg:flex lg:w-1/2 justify-center">
          <img
            src={imagen7}
            className="w-1/2 border-4 border-yellow-700 shadow-lg rounded-lg transition-transform transform hover:scale-105"
            alt="about img"
          />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center text-center">
          <h2 className="text-4xl font-extrabold uppercase mb-5">
            Sobre nosotros
          </h2>
          <p className="mb-4 text-lg">
            En El Rey del Mambo, nos especializamos en llevar a tu mesa el sabor
            inigualable del pollo asado...
          </p>
          <p className="mb-5 text-lg">
            Desde nuestros inicios, nos hemos dedicado a perfeccionar cada
            receta...
          </p>
        </div>
      </div>

      
      <section id="menu" className="py-16 bg-gray-950">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl text-white font-bold mb-10">Nuestro Menú</h1>

          {loading && <p>Cargando productos...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productos.map((product) => (
                <div
                  key={product._id}
                  className="bg-gray-800 rounded-lg shadow-lg p-6 text-white"
                >
                  <img
                    src={product.imagen}
                    alt={product.nombre}
                    className="rounded-lg mb-4"
                  />

                  {editandoProductoId === product._id && esAdmin ? (
                    <>
                      <input
                        type="text"
                        name="nombre"
                        value={formularioProducto.nombre}
                        onChange={handleInputChange}
                        className="mb-2 w-full p-2 rounded text-black"
                      />
                      <textarea
                        name="descripcion"
                        value={formularioProducto.descripcion}
                        onChange={handleInputChange}
                        className="mb-2 w-full p-2 rounded text-black"
                      />
                      <input
                        type="number"
                        name="precio"
                        value={formularioProducto.precio}
                        onChange={handleInputChange}
                        className="mb-2 w-full p-2 rounded text-black"
                      />
                      <button
                        onClick={() => handleGuardarCambios(product._id)}
                        className="bg-green-600 hover:bg-green-700 px-3 py-2 rounded mr-2"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditandoProductoId(null)}
                        className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <h3 className="text-xl font-semibold">
                        {product.nombre}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {product.descripcion}
                      </p>
                      <div className="mt-4 flex justify-between items-center">
                        <p className="text-gray-50">
                          ${product.precio.toLocaleString()} COP
                        </p>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="bg-orange-700 text-white py-2 px-4 rounded hover:bg-green-600 transition"
                        >
                          Añadir al Carrito
                        </button>
                      </div>
                      {esAdmin && (
                        <div className="mt-3">
                          <button
                            onClick={() => handleEditarClick(product)}
                            className="w-full bg-blue-700 text-white py-2 px-4 rounded hover:bg-blue-800 transition duration-200"
                          >
                            Editar producto
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <div id="galeria">
        <Slider2 />
      </div>
    </section>
  );
}

export default Inicio;
