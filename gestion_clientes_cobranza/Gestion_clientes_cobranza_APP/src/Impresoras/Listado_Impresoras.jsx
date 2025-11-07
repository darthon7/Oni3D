import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, X, Printer, Search } from 'lucide-react';

const API_URL = 'http://localhost:8080/api/impresoras';

const initialState = {
    nombre: '',
    marca: '',
    tamaño: '',
    velocidad: ''
};

function ImpresorasManager() {
    const [impresoras, setImpresoras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState(initialState);
    const [currentId, setCurrentId] = useState(null);
    const [formError, setFormError] = useState(null);
    const [deleteAnimation, setDeleteAnimation] = useState(null);

    useEffect(() => {
        fetchImpresoras();
    }, []);

    const fetchImpresoras = async () => {
        try {
            setLoading(true);
            const response = await axios.get(API_URL);
            setImpresoras(response.data);
            setError(null);
        } catch (err) {
            setError(err.message || 'Ocurrió un error al cargar los datos.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (impresora = null) => {
        setIsModalOpen(true);
        setFormError(null);
        if (impresora) {
            setFormData(impresora);
            setCurrentId(impresora.id);
        } else {
            setFormData(initialState);
            setCurrentId(null);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setFormData(initialState);
        setCurrentId(null);
        setFormError(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(null);

        try {
            if (currentId) {
                await axios.put(`${API_URL}/${currentId}`, formData);
            } else {
                await axios.post(API_URL, formData);
            }
            
            fetchImpresoras();
            handleCloseModal();

        } catch (err) {
            setFormError(err.response?.data?.message || 'Error al guardar. Revisa los campos.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar esta impresora?')) {
            setDeleteAnimation(id);
            setTimeout(async () => {
                try {
                    await axios.delete(`${API_URL}/${id}`);
                    setImpresoras(impresoras.filter(imp => imp.id !== id));
                    setDeleteAnimation(null);
                } catch (err) {
                    setError(err.message || 'No se pudo eliminar la impresora.');
                    setDeleteAnimation(null);
                }
            }, 300);
        }
    };

    const filteredImpresoras = impresoras.filter(imp =>
        imp.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        imp.marca.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mb-4"></div>
                    <p className="text-xl text-gray-600 font-medium">Cargando impresoras...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            <div className="max-w-7xl mx-auto">
                
                {/* Header con animación */}
                <div className="mb-8 animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-2xl shadow-xl p-6 backdrop-blur-lg bg-opacity-90">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
                                <Printer className="text-white" size={28} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Gestor de Impresoras
                                </h1>
                                <p className="text-gray-500 text-sm">{impresoras.length} impresoras registradas</p>
                            </div>
                        </div>
                        
                        <button
                            onClick={() => handleOpenModal()}
                            className="group relative overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                        >
                            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative flex items-center gap-2">
                                <Plus size={20} />
                                Añadir Impresora
                            </span>
                        </button>
                    </div>
                </div>

                {/* Barra de búsqueda */}
                <div className="mb-6 animate-slideDown">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o marca..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 shadow-sm bg-white"
                        />
                    </div>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="mb-6 animate-shake bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-4 rounded-xl shadow-lg">
                        <strong className="font-bold">Error: </strong>
                        <span>{error}</span>
                    </div>
                )}

                {/* Grid de Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredImpresoras.length === 0 ? (
                        <div className="col-span-full text-center py-20">
                            <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
                                <Printer className="mx-auto text-gray-300 mb-4" size={64} />
                                <p className="text-gray-500 text-lg">
                                    {searchTerm ? 'No se encontraron impresoras' : 'No hay impresoras registradas'}
                                </p>
                            </div>
                        </div>
                    ) : (
                        filteredImpresoras.map((imp, index) => (
                            <div
                                key={imp.id}
                                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden animate-fadeInUp ${
                                    deleteAnimation === imp.id ? 'animate-slideOut' : ''
                                }`}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Gradiente decorativo */}
                                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                                
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-3 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                                            <Printer className="text-indigo-600" size={24} />
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleOpenModal(imp)}
                                                className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-all duration-200 hover:scale-110"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(imp.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {imp.nombre}
                                    </h3>
                                    
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500 font-medium">Marca:</span>
                                            <span className="text-gray-700 font-semibold">{imp.marca}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2 border-b border-gray-100">
                                            <span className="text-gray-500 font-medium">Tamaño:</span>
                                            <span className="text-gray-700 font-semibold">{imp.tamaño}</span>
                                        </div>
                                        <div className="flex items-center justify-between py-2">
                                            <span className="text-gray-500 font-medium">Velocidad:</span>
                                            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-bold">
                                                {imp.velocidad}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform animate-scaleIn">
                            
                            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 rounded-t-2xl">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        <Printer size={28} />
                                        {currentId ? 'Editar Impresora' : 'Nueva Impresora'}
                                    </h2>
                                    <button 
                                        onClick={handleCloseModal} 
                                        className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-all duration-200"
                                    >
                                        <X size={24} />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                {formError && (
                                    <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 animate-shake" role="alert">
                                        <p className="font-medium">{formError}</p>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="group">
                                        <label htmlFor="nombre" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Nombre
                                        </label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            id="nombre"
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                                            placeholder="Ej: HP LaserJet Pro"
                                        />
                                    </div>
                                    
                                    <div className="group">
                                        <label htmlFor="marca" className="block text-sm font-semibold text-gray-700 mb-2">
                                            Marca
                                        </label>
                                        <input
                                            type="text"
                                            name="marca"
                                            id="marca"
                                            value={formData.marca}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                                            placeholder="Ej: HP"
                                        />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group">
                                            <label htmlFor="tamaño" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Tamaño
                                            </label>
                                            <input
                                                type="text"
                                                name="tamaño"
                                                id="tamaño"
                                                value={formData.tamaño}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                                                placeholder="30x30"
                                            />
                                        </div>
                                        
                                        <div className="group">
                                            <label htmlFor="velocidad" className="block text-sm font-semibold text-gray-700 mb-2">
                                                Velocidad
                                            </label>
                                            <input
                                                type="text"
                                                name="velocidad"
                                                id="velocidad"
                                                value={formData.velocidad}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-300"
                                                placeholder="10ppm"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="flex-1 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 hover:scale-105"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
                                        >
                                            {currentId ? 'Actualizar' : 'Guardar'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideDown {
                    from { 
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes scaleIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                
                @keyframes slideOut {
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
                
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-10px); }
                    75% { transform: translateX(10px); }
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .animate-slideDown {
                    animation: slideDown 0.6s ease-out;
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                }
                
                .animate-scaleIn {
                    animation: scaleIn 0.3s ease-out;
                }
                
                .animate-slideOut {
                    animation: slideOut 0.3s ease-out forwards;
                }
                
                .animate-shake {
                    animation: shake 0.4s ease-out;
                }
            `}</style>
        </div>
    );
}

export default ImpresorasManager;