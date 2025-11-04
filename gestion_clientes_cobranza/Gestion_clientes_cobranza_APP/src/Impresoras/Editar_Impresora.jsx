import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, AlertTriangle, CheckCircle, ArrowLeft, Loader } from 'react-feather';

// URL de tu API
const API_URL = 'http://localhost:8080/api/impresoras';

function EditarImpresora() {
    // Hooks de React Router
    const { id } = useParams(); // Obtiene el "id" de la URL (ej: /editar-impresora/1)
    const navigate = useNavigate(); // Para redirigir al usuario

    // Estado del formulario
    const [formData, setFormData] = useState({
        nombre: '',
        marca: '',
        tamaño: '',
        velocidad: ''
    });

    // Estados de UI
    const [loading, setLoading] = useState(true); // Cargando datos iniciales
    const [saving, setSaving] = useState(false);  // Guardando actualización
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // --- 1. Cargar Datos de la Impresora (GET) ---
    useEffect(() => {
        const fetchImpresora = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                setFormData(response.data);
                setError(null);
            } catch (err) {
                setError('Error al cargar la impresora. ¿Existe?');
            } finally {
                setLoading(false);
            }
        };

        fetchImpresora();
    }, [id]); // Se ejecuta cada vez que el 'id' de la URL cambia

    // --- 2. Manejador de Cambios ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // --- 3. Enviar Actualización (PUT) ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación simple
        if (!formData.nombre || !formData.marca) {
            setError('El nombre y la marca son obligatorios.');
            setSuccess(null);
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            // Hacemos el PUT al backend con el ID
            await axios.put(`${API_URL}/${id}`, formData);
            
            setSuccess('¡Impresora actualizada con éxito!');
            
            // Opcional: Redirigir después de 2 segundos
            setTimeout(() => {
                navigate('/lista-impresoras'); // Ajusta esta ruta a tu listado
            }, 2000);

        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar la impresora.');
        } finally {
            setSaving(false);
        }
    };

    // --- Renderizado Condicional ---

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader className="animate-spin text-blue-500" size={40} />
                <span className="ml-3 text-gray-600 text-lg">Cargando datos...</span>
            </div>
        );
    }

    if (error && !formData.nombre) {
        // Error fatal (no se pudo cargar)
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg text-center">
                <AlertTriangle size={30} className="mx-auto mb-3" />
                <h2 className="text-xl font-semibold mb-2">Error</h2>
                <p>{error}</p>
                <button
                    onClick={() => navigate(-1)} // Volver atrás
                    className="mt-4 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition"
                >
                    Volver
                </button>
            </div>
        );
    }

    // --- Formulario Principal ---
    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            
            <button
                onClick={() => navigate(-1)} // Volver a la página anterior
                className="flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4 transition"
            >
                <ArrowLeft size={16} className="mr-1" />
                Volver
            </button>
            
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 border-b pb-4">
                Editar Impresora: <span className="text-blue-600">{formData.nombre || ''}</span>
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Campos (idénticos a los de "Agregar") */}
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre <span className="text-red-500">*</span></label>
                    <input
                        type="text" name="nombre" id="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="marca" className="block text-sm font-medium text-gray-700 mb-1">Marca <span className="text-red-500">*</span></label>
                    <input
                        type="text" name="marca" id="marca"
                        value={formData.marca}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="tamaño" className="block text-sm font-medium text-gray-700 mb-1">Tamaño (Cama)</label>
                    <input
                        type="text" name="tamaño" id="tamaño"
                        value={formData.tamaño}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="velocidad" className="block text-sm font-medium text-gray-700 mb-1">Velocidad</label>
                    <input
                        type="text" name="velocidad" id="velocidad"
                        value={formData.velocidad}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* --- Mensajes de Estado (Guardado) --- */}
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
                        disabled={saving}
                        className="flex items-center justify-center w-full sm:w-auto ml-auto bg-green-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-green-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? (
                            <>
                                <Loader className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <Save size={18} className="mr-2" />
                                Guardar Cambios
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditarImpresora;