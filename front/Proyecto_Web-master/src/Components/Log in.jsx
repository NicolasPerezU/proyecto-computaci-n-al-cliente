import { useState } from "react";
import Error from "./Error";


function Login({ isVisible, onClose, onLoginSuccess }) {

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');
        setSuccessMessage('');

        if (!formData.email || !formData.password) {
            setError('Email y contraseña son obligatorios');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Inicio de sesión exitoso.');
                console.log('Inicio de sesión exitoso:', data);
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));

                
                if (onLoginSuccess) { 
                    onLoginSuccess(); 
                } else {
                   onClose(); 
                }

            } else {
                setError(data.error || 'Error en el inicio de sesión.');
                console.error('Error en el inicio de sesión:', data.error);
            }
        } catch (error) {
            console.error('Error de red al iniciar sesión:', error);
            setError('Error de conexión. Inténtalo de nuevo.');
        }
    };

    const handleClose = () => {
        setError('');
        setSuccessMessage('');
        setFormData({
            email: '',
            password: '',
        });
        onClose();
    };

    return (
        isVisible && (
            <div id="Login" className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg max-h-[90vh] overflow-auto">
                    <h2 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h2>

                    {error && <Error>{error}</Error>}
                    {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}


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
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300">
                            Iniciar Sesión
                        </button>
                        <button type="button" onClick={handleClose} className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-300 ml-4">
                            Cerrar
                        </button>
                    </div>
                </form>
            </div>
        )
    );
}

export default Login;
