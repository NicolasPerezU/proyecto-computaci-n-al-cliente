import fondo from '../img/fondo.jpg'; 

function Footer() {
  return (
    <footer
      className="relative bg-gray-900 text-gray-200 py-16"
      style={{ backgroundImage: `url(${fondo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      
      <div className="absolute inset-0 bg-black bg-opacity-80 filter blur-sm"></div> 

      <div className="relative container mx-auto text-center space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-white">¿Quieres enterarte de nuestros descuentos?</h2>
          <p className="text-gray-300">Déjanos tu correo electrónico.</p>
          <form className="mt-4 flex justify-center">
            <input
              type="email"
              placeholder="tu correo electrónico"
              className="px-4 py-2 rounded-l-lg focus:outline-none"
            />
            <button className="bg-green-500 text-white px-4 py-2 rounded-r-lg hover:bg-green-600 transition">
              Enviar
            </button>
          </form>
          <p className="text-orange-700 mt-4" id="confirmationMessage">
            ¡Gracias por suscribirte a nuestros descuentos!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <ul className="space-y-4">
            <li><a href="#" className="text-gray-300 hover:underline">Inicio</a></li>
            <li><a href="#SobreNosotros" className="text-gray-300 hover:underline">Sobre nosotros</a></li>
            <li><a href="#menu" className="text-gray-300 hover:underline">Menú</a></li>
            <li><a href="#galeria" className="text-gray-300 hover:underline">Galeria de imagenes</a></li>
          </ul>

          <ul className="space-y-4">
            <li><a href="https://www.facebook.com" className="text-gray-300 hover:underline">Facebook</a></li>
            <li><a href="https://www.instagram.com" className="text-gray-300 hover:underline">Instagram</a></li>
            <li><a href="https://www.twitter.com" className="text-gray-300 hover:underline">Twitter</a></li>
          </ul>

          <ul className="space-y-4">
            <li><a href="tel:+88123123456" className="text-gray-300 hover:underline">Llámanos : 3133523289</a></li>
            <li><a href="https://g.co/kgs/HpVFnXw" className="text-gray-300 hover:underline">Google Maps</a></li>
            <li><p className="text-gray-300">Abierto 5pm - 12 pm</p></li>
          </ul>
        </div>

        <div className="mt-8">
          <p className="text-gray-500">&copy; 2024 Mambo Kings. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
