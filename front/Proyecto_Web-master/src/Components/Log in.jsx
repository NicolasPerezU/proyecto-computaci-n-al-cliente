import { useState } from "react";
import Error from "./Error";


function Login({ isVisible, onClose, emailRegistrado, contraseñaRegistrada }) {

    const [formData, setFormData] = useState({
        email: '',
        contraseña: '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.contraseña) {
            setError('Todos los campos son obligatorios');
            return;
        }
        if (formData.email !== emailRegistrado || formData.contraseña !== contraseñaRegistrada) {
            setError('Email o contraseña incorrectos');
            return;
        }
        setError('');
        console.log('Iniciando sesión...');
        handleCloseClose();
    };

    const handleClose = () => {
        setError('');
        setFormData({
            email: '',
            contraseña: '',
        });
        onClose();
    };




    return (
        isVisible && (
            <div id="Login" className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg max-h-[90vh] overflow-auto">
                    <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

                    {error && <Error>{error}</Error>}

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Contraseña</label>
                        <input
                            type="password"
                            name="contraseña"
                            value={formData.contraseña}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300">
                            Iniciar Sesión
                        </button>
                        <button type="button" onClick={handleClose} className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300 ml-4">
                            Cerrar
                        </button>
                    </div>
                </form>
            </div>
        )
    );
}

export default Login