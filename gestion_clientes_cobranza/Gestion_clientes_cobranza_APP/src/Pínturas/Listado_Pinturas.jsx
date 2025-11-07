import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// --- Iconos SVG ---
const IconPaintBrush = () => ( // Icono para Pinturas
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
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
// --- Fin Iconos SVG ---

// --- Estilos CSS en línea para Animaciones (de Codigo 1) ---
const animationStyles = `
    @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
    .animate-fade-in { animation: fadeIn 0.6s ease-out; }
    .animate-slide-in { animation: slideIn 0.4s ease-out; }
`;
// --- Fin Estilos ---

export default function Listado_Pinturas() {
    const urlBase = "http://localhost:8080/api/pinturas";
    const [pinturas, setPinturas] = useState([]);
    const [searchParams, setSearchParams] = useState({ marca: "", color: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [notFound, setNotFound] = useState(false);

    // --- Lógica de Carga y CRUD (de Codigo 2) ---
    useEffect(() => {
        cargarPinturas(); // Cargar todo al inicio
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    const cargarPinturas = async (params = { marca: null, color: null }) => {
        setLoading(true); setError(null); setNotFound(false);
        try {
            // Usar siempre el endpoint de búsqueda
            const resultado = await axios.get(`${urlBase}/buscar`, {
                params: {
                    marca: params.marca || null,
                    color: params.color || null,
                }
            });
            const data = Array.isArray(resultado.data) ? resultado.data : [];
            setPinturas(data);
            // Si hay filtros aplicados y no hay resultados, marcar notFound
            if (data.length === 0 && (params.marca || params.color)) {
                setNotFound(true);
            }
        } catch (err) {
            console.error("Error al cargar pinturas: ", err);
            setError("Ocurrió un error al cargar los datos. Intenta de nuevo.");
            setPinturas([]);
        } finally { setLoading(false); }
    };

    const onBuscar = (e) => {
        e.preventDefault();
        cargarPinturas({
             marca: searchParams.marca.trim(),
             color: searchParams.color.trim()
        });
    };

    const limpiarBusqueda = () => {
        setSearchParams({ marca: "", color: "" });
        setError(null); setNotFound(false);
        cargarPinturas(); // Cargar todo
    };

    const onSearchInputChange = (e) => {
        setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
        setError(null); setNotFound(false);
    };

    const eliminarPintura = async (id) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar esta pintura?")) return;
        try {
            await axios.delete(`${urlBase}/${id}`);
            // Recargar con filtros actuales
            cargarPinturas({ 
                marca: searchParams.marca.trim(), 
                color: searchParams.color.trim() 
            });
        } catch (err) {
            console.error("Error al eliminar pintura: ", err);
            setError("No se pudo eliminar la pintura. Intenta de nuevo.");
        }
    };

    const isValidColor = (strColor) => {
        if (!strColor) return false;
        const s = new Option().style;
        s.color = strColor;
        return s.color !== '';
    };
    // --- Fin Lógica ---

    // --- Renderizado con Estilos Replicados de Codigo 1 ---
    return (
        <>
            <style>{animationStyles}</style>
            <div className="min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header Mejorado */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                         {/* Paleta oscura para header, adaptada para Pinturas */}
                        <div className="bg-gradient-to-r from-gray-700 via-gray-800 to-black rounded-2xl shadow-2xl overflow-hidden text-white">
                            <div className="relative p-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/10">
                                        <IconPaintBrush className="h-6 w-6 text-indigo-300"/> {/* Icono Pintura */}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
                                            Stock de Pinturas
                                        </h1>
                                        <p className="text-gray-300 text-base md:text-lg font-medium mt-1">
                                            🎨 Administra el inventario de pinturas y colores
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                     {/* Barra de Búsqueda (Adaptada para 2 campos) */}
                    <motion.form
                        onSubmit={onBuscar}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                             <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
                                 <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                     <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                     Búsqueda de Pinturas
                                 </h2>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                    {/* Input Marca */}
                                    <div className="relative md:col-span-1">
                                        <label htmlFor="marca" className="block text-sm font-semibold text-gray-700 mb-2">Marca</label>
                                        <input
                                            type="text" id="marca" name="marca"
                                            value={searchParams.marca} onChange={onSearchInputChange}
                                            placeholder="Ej: ModelColor..."
                                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                     {/* Input Color */}
                                     <div className="relative md:col-span-1">
                                        <label htmlFor="color" className="block text-sm font-semibold text-gray-700 mb-2">Color</label>
                                        <input
                                            type="text" id="color" name="color"
                                            value={searchParams.color} onChange={onSearchInputChange}
                                            placeholder="Ej: #FF0000 o Rojo..."
                                            className="w-full pl-4 pr-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                    </div>
                                    {/* Botones */}
                                    <div className="flex gap-3 md:col-span-2">
                                        <button type="submit" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-sm font-bold rounded-xl shadow-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all transform hover:scale-105">
                                            <IconSearch /> Buscar
                                        </button>
                                        <button type="button" onClick={limpiarBusqueda} className="flex-1 inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-sm font-bold rounded-xl shadow-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 transition-all transform hover:scale-105">
                                            Limpiar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.form>

                    {/* Mensajes de Estado Mejorados */}
                    <AnimatePresence>
                         {loading && ( <motion.div key="loading" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4 shadow-md"><div className="flex items-center gap-3"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div><p className="text-blue-800 font-semibold">Cargando pinturas...</p></div></motion.div> )}
                         {error && ( <motion.div key="error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md"><div className="flex items-center gap-3"><svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg><p className="text-red-800 font-semibold">{error}</p></div></motion.div> )}
                    </AnimatePresence>

                    {/* Tabla Mejorada */}
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                    >
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gradient-to-r from-gray-800 via-gray-900 to-black">
                                     <tr>
                                         <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider"><div className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg> ID</div></th>
                                         <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider"><div className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg> Marca</div></th>
                                         <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider"><div className="flex items-center gap-2"><IconPaintBrush className="h-4 w-4"/> Color</div></th>
                                         <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider"><div className="flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg> Descripción</div></th>
                                         <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider"><div className="flex items-center justify-end gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg> Acciones</div></th>
                                     </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    <AnimatePresence>
                                        {!loading && pinturas.length > 0 ? (
                                            pinturas.map((pintura, index) => (
                                                <motion.tr
                                                    key={pintura.id}
                                                    className="odd:bg-white even:bg-gradient-to-r even:from-blue-50 even:to-purple-50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all"
                                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                >
                                                     {/* ID con Estilo */}
                                                     <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center"><div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white font-bold shadow-md">{pintura.id}</div></div></td>
                                                     {/* Marca */}
                                                     <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-semibold text-gray-900">{pintura.marca}</div></td>
                                                     {/* Color (con recuadro) */}
                                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                                         <div className="flex items-center gap-2">
                                                             {isValidColor(pintura.color) && (
                                                                <div className="w-4 h-4 rounded border border-gray-300 shrink-0" style={{ backgroundColor: pintura.color }} title={pintura.color}></div>
                                                             )}
                                                             <span>{pintura.color}</span>
                                                         </div>
                                                     </td>
                                                     {/* Descripción */}
                                                     <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={pintura.descripcion}>{pintura.descripcion || 'N/A'}</td>
                                                     {/* Acciones */}
                                                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                         <div className="flex justify-end items-center gap-3">
                                                             <Link
                                                                  to={`/Editar_Pintura/${pintura.id}`} // Ruta de Codigo 2
                                                                  className="inline-flex items-center gap-1 px-3 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all transform hover:scale-105 shadow-md" title="Editar"
                                                             > <IconPencil /> Editar </Link>
                                                             <button
                                                                 onClick={() => eliminarPintura(pintura.id)}
                                                                 className="inline-flex items-center gap-1 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all transform hover:scale-105 shadow-md" title="Eliminar"
                                                             > <IconTrash /> Eliminar </button>
                                                         </div>
                                                     </td>
                                                </motion.tr>
                                            ))
                                        ) : null }
                                    </AnimatePresence>
                                </tbody>
                            </table>

                             {/* Estados Vacíos Mejorados */}
                             {!loading && !error && pinturas.length === 0 && !notFound && (
                                 <div className="text-center p-16 bg-gradient-to-br from-gray-50 to-blue-50">
                                     <svg className="mx-auto h-24 w-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" /></svg>
                                     <h3 className="text-2xl font-bold text-gray-700 mb-2">No hay pinturas registradas</h3>
                                     <p className="text-gray-500">¡Agrega la primera pintura usando el enlace en la barra lateral!</p>
                                 </div>
                             )}
                             {!loading && !error && pinturas.length === 0 && notFound && (
                                 <div className="text-center p-16 bg-gradient-to-br from-red-50 to-orange-50">
                                     <svg className="mx-auto h-24 w-24 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                     <h3 className="text-2xl font-bold text-gray-700 mb-2">No se encontraron pinturas</h3>
                                     <p className="text-gray-500">Intenta con otros filtros de búsqueda.</p>
                                 </div>
                             )}
                        </div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}

