import React, { useState } from 'react';
import axios from 'axios';
import { Save, AlertTriangle, CheckCircle } from 'react-feather'; // Iconos

// URL de tu API
const API_URL = 'http://localhost:8080/api/impresoras';

// Estado inicial para limpiar el formulario
const initialState = {
    nombre: '',
    marca: '',
    tamaño: '',
    velocidad: ''
};

function AgregarImpresora() {
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    
    // Estados para los mensajes al usuario
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Manejador de cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Manejador del envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que la página se recargue

        // Validación simple
        if (!formData.nombre || !formData.marca) {
            setError('El nombre y la marca son obligatorios.');
            setSuccess(null);
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            // Hacemos el POST al backend
            const response = await axios.post(API_URL, formData);
            
            setSuccess(`¡Impresora "${response.data.nombre}" agregada con éxito!`);
            setFormData(initialState); // Limpiamos el formulario

        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar la impresora. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
                Agregar Nueva Impresora
            </h2>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Campo Nombre */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="nombre"
                        id="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ej: Ender 3 Pro"
                    />
                </div>

                {/* Campo Marca */}
                <div>
                    <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">
                        Marca <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="marca"
                        id="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ej: Creality"
                    />
                </div>

                {/* Campo Tamaño */}
                <div>
                    <label htmlFor="tamaño" className="block text-sm font-medium text-gray-700 mb-1">
                        Tamaño (Cama)
                    </label>
                    <input
                        type="text"
                        name="tamaño"
                        id="tamaño"
                        value={formData.tamaño}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ej: 220x220x250mm"
                    />
                </div>

                {/* Campo Velocidad */}
                <div>
                    <label htmlFor="velocidad" className="block text-sm font-medium text-gray-700 mb-1">
                        Velocidad de Impresión
                    </label>
                    <input
                        type="text"
                        name="velocidad"
                        id="velocidad"
                        value={formData.velocidad}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Ej: 60mm/s"
                    />
                </div>

                {/* --- Mensajes de Estado --- */}
                {error && (
                    <div className="flex items-center bg-red-100 text-red-700 p-3 rounded-md text-sm" role="alert">
                        <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
                {success && (
                    <div className="flex items-center bg-green-100 text-green-700 p-3 rounded-md text-sm" role="alert">
                        <CheckCircle size={18} className="mr-2 flex-shrink-0" />
                        <span>{success}</span>
                    </div>
                )}

                {/* --- Botón de Envío --- */}
                <div className="pt-4 text-right">
                    <button
                        type="submit"
                        disabled={loading} // Deshabilita el botón mientras carga
                        className="flex items-center justify-center w-full sm:w-auto ml-auto bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Guardar Impresora
                            </>
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}

export default AgregarImpresora;