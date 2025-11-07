import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Iconos SVG
const IconUsers = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
);

const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

const IconPencil = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

export default function Listado_Empleados() {
    const urlBase = "http://localhost:8080/api/empleados";
    const [empleados, setEmpleados] = useState([]);
    const [idQuery, setIdQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);

    const cargarEmpleados = async (id = "") => {
        setLoading(true);
        setError(null);
        setNotFound(false);
        try {
            let resultado;
            if (id === "" || id === null) {
                resultado = await axios.get(urlBase);
            } else {
                resultado = await axios.get(`${urlBase}/${id}`);
            }

            const data = Array.isArray(resultado.data) 
                ? resultado.data 
                : (resultado.data ? [resultado.data] : []);

            setEmpleados(data);
            if (data.length === 0 && id) {
                 setNotFound(true);
            }
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setEmpleados([]);
                setNotFound(true);
            } else {
                console.error("Error al cargar empleados: ", err);
                setError("Ocurrió un error al cargar los empleados. Intenta de nuevo.");
                setEmpleados([]);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        cargarEmpleados();
    }, []);

    const onBuscarPorId = (e) => {
        if (e) e.preventDefault();
        setError(null);
        setNotFound(false);
        const trimmed = idQuery.trim();
        if (trimmed === "") {
            cargarEmpleados();
        } else {
            if (!/^\d+$/.test(trimmed)) {
                setError("El ID debe ser numérico.");
                setEmpleados([]);
                return;
            }
            cargarEmpleados(trimmed);
        }
    };

    const limpiarBusqueda = () => {
        setIdQuery("");
        setError(null);
        setNotFound(false);
        cargarEmpleados();
    };

    const eliminarEmpleado = async (id) => {
         if (!window.confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
             return;
         }
        try {
            await axios.delete(`${urlBase}/${id}`);
            cargarEmpleados(); 
        } catch (err) {
            console.error("Error al eliminar empleado: ", err);
            setError("No se pudo eliminar el cliente. Intenta de nuevo.");
        }
    };

    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes pulse-border {
                    0%, 100% { border-color: rgba(59, 130, 246, 0.3); }
                    50% { border-color: rgba(59, 130, 246, 0.6); }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .animate-slide-in {
                    animation: slideIn 0.4s ease-out;
                }
                
                .gradient-text {
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
            `}</style>

            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header Mejorado */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 rounded-2xl shadow-2xl overflow-hidden">
                            <div className="relative p-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                        <IconUsers />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                                            Gestión de Clientes
                                        </h1>
                                        <p className="text-blue-100 text-base md:text-lg font-medium mt-1">
                                            📋 Administra la información de tus clientes de forma eficiente
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Estadísticas rápidas */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                    >
                        
                        
                    </motion.div>

                    {/* Barra de Búsqueda Mejorada */}
                    <motion.form
                        onSubmit={onBuscarPorId}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    Búsqueda de Cliente
                                </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                    <div className="relative md:col-span-2">
                                        <label htmlFor="searchId" className="block text-sm font-semibold text-gray-700 mb-2">
                                            ID del Cliente
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="searchId"
                                                value={idQuery}
                                                onChange={(e) => {
                                                    setIdQuery(e.target.value);
                                                    setError(null);
                                                    setNotFound(false);
                                                }}
                                                placeholder="Ingresa el ID exacto del cliente..."
                                                className="w-full pl-4 pr-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                aria-label="Buscar cliente por ID"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-gray-500">💡 Usa el ID exacto para buscar (ej: 12)</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            type="submit"
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105"
                                        >
                                            <IconSearch />
                                            Buscar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={limpiarBusqueda}
                                            className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-sm font-bold rounded-xl shadow-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all transform hover:scale-105"
                                        >
                                            Limpiar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.form>

                    {/* Mensajes de Estado Mejorados */}
                    <AnimatePresence>
                        {loading && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    <p className="text-blue-800 font-semibold">Cargando clientes...</p>
                                </div>
                            </motion.div>
                        )}
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md"
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-red-800 font-semibold">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Tabla Mejorada */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-800 via-gray-900 to-black">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                                                </svg>
                                                ID Cliente
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Nombre
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Correo
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                </svg>
                                                Teléfono
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">
                                            <div className="flex items-center justify-end gap-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                                                </svg>
                                                Acciones
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <AnimatePresence>
                                        {!loading && empleados.length > 0 ? (
                                            empleados.map((empleado, index) => (
                                                <motion.tr
                                                    key={empleado.idEmpleado}
                                                    className="odd:bg-white even:bg-gradient-to-r even:from-blue-50 even:to-purple-50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all"
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -50 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                                {empleado.idEmpleado}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-semibold text-gray-900">{empleado.nombre}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600">{empleado.correo ?? empleado.departamento ?? 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-600">{empleado.sueldo ?? 'N/A'}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex justify-end items-center gap-3">
                                                            <Link
                                                                to={`/editar/${empleado.idEmpleado}`}
                                                                className="inline-flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-md"
                                                                title="Editar"
                                                            >
                                                                <IconPencil />
                                                                Editar
                                                            </Link>
                                                            <button
                                                                onClick={() => eliminarEmpleado(empleado.idEmpleado)}
                                                                className="inline-flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-md"
                                                                title="Eliminar"
                                                            >
                                                                <IconTrash />
                                                                Eliminar
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : null }
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* Estados Vacíos Mejorados */}
                        {!loading && !error && empleados.length === 0 && !notFound && (
                            <div className="text-center p-16 bg-gradient-to-br from-gray-50 to-blue-50">
                                <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay clientes registrados</h3>
                                <p className="text-gray-500">¡Agrega el primer cliente usando el enlace en la barra lateral!</p>
                            </div>
                        )}
                        {!loading && !error && empleados.length === 0 && notFound && (
                            <div className="text-center p-16 bg-gradient-to-br from-red-50 to-orange-50">
                                <svg className="mx-auto h-24 w-24 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="text-2xl font-bold text-gray-700 mb-2">No se encontró cliente</h3>
                                <p className="text-gray-500">El ID buscado no existe en el sistema.</p>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </>
    );
}