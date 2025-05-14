import { useState } from "react";
import Error from "./Error";

function Registro({ isVisible, onClose }) {

    const [formData, setFormData] = useState({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        confirmarpassword: '',
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Added for success message

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => { // Made the function async
        e.preventDefault();

        // Reset messages
        setError('');
        setSuccessMessage('');

        if (Object.values(formData).some((field) => field === '')) {
            setError('Todos los campos son obligatorios');
            return;
        }

        if (formData.password !== formData.confirmarpassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/register', { // **Modified URL**
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombres: formData.nombres,
                    apellidos: formData.apellidos,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Registration successful
                setSuccessMessage(data.message || 'Usuario registrado exitosamente.'); // Use message from backend
                console.log('Usuario registrado exitosamente:', data);
                // Optionally clear form or redirect after a delay
                setFormData({
                    nombres: '',
                    apellidos: '',
                    email: '',
                    password: '',
                    confirmarpassword: '',
                });
                 // onClose(); // You might want to keep the modal open to show the success message
            } else {
                // Error in registration
                setError(data.error || 'Error en el registro.'); // Use error message from backend
                console.error('Error en el registro:', data.error);
            }
        } catch (error) {
            console.error('Error de red al registrar:', error);
            setError('Error de conexión. Inténtalo de nuevo.');
        }
    };

    const handleClose = () => {
        setError('');
        setSuccessMessage(''); // Also clear success message on close
        setFormData({
            email: '',
            password: '',
        });
        onClose();
    };

    return (
        isVisible && (
            <div id="Registro" className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg max-h-[90vh] overflow-auto">
                    <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>

                    {error && <Error>{error}</Error>}
                    {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>} {/* Display success message */}

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Nombres</label>
                        <input
                            type="text"
                            name="nombres"
                            value={formData.nombres}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Apellidos</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

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
                            name="password" // Ensure this matches the backend
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Confirmar Contraseña</label>
                        <input
                            type="password"
                            name="confirmarpassword"
                            value={formData.confirmarpassword}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                            required
                        />
                    </div>

                    <div className="text-center">
                        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300">
                            Registrarse
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

export default Registro;
