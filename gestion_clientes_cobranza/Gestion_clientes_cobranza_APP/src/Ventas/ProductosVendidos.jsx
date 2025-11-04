import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// --- Iconos SVG ---
const IconShoppingCart = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
);

const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const IconCalendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
    </svg>
);

const IconCube = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
    </svg>
);

const IconHashtag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" clipRule="evenodd" />
    </svg>
);

const IconFilter = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
    </svg>
);

const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);

const IconCash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
    </svg>
);

export default function ProductosVendidos() {
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const API_EVENTOS = `${API_BASE}/api/eventos`;
    const API_PRODUCTOS = `${API_BASE}/api/productos`;
    const API_EMPLEADOS = `${API_BASE}/api/empleados`;

    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Estados para búsqueda y filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDateFrom, setFilterDateFrom] = useState("");
    const [filterDateTo, setFilterDateTo] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Estados para estadísticas
    const [stats, setStats] = useState({
        totalVentas: 0,
        totalUnidades: 0,
        ventasHoy: 0
    });

    useEffect(() => {
        cargarVentas();
    }, []);

    const cargarVentas = async () => {
        setLoading(true);
        setError(null);
        try {
            // Obtener todos los eventos (alertas)
            const resEventos = await axios.get(API_EVENTOS);
            const eventos = resEventos.data;

            // Enriquecer cada evento con información del producto y cliente
            const ventasEnriquecidas = await Promise.all(
                eventos.map(async (evento) => {
                    try {
                        // Obtener información del producto
                        let producto = null;
                        if (evento.productoId) {
                            const resProd = await axios.get(`${API_PRODUCTOS}/${evento.productoId}`);
                            producto = resProd.data;
                        }

                        // Obtener información del cliente
                        let cliente = null;
                        if (evento.usuarioId) {
                            const resCli = await axios.get(`${API_EMPLEADOS}/${evento.usuarioId}`);
                            cliente = resCli.data;
                        }

                        return {
                            ...evento,
                            producto,
                            cliente
                        };
                    } catch (err) {
                        console.warn(`Error enriqueciendo evento ${evento.id}:`, err);
                        return {
                            ...evento,
                            producto: null,
                            cliente: null
                        };
                    }
                })
            );

            setVentas(ventasEnriquecidas);
            calcularEstadisticas(ventasEnriquecidas);
        } catch (err) {
            console.error("Error cargando ventas:", err);
            setError("No se pudieron cargar los datos de ventas.");
        } finally {
            setLoading(false);
        }
    };

    const calcularEstadisticas = (ventasData) => {
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        const totalUnidades = ventasData.reduce((sum, v) => sum + (v.cantidad || 0), 0);
        const ventasHoy = ventasData.filter(v => {
            const fechaVenta = new Date(v.fechaNotificacion);
            fechaVenta.setHours(0, 0, 0, 0);
            return fechaVenta.getTime() === hoy.getTime();
        }).length;

        setStats({
            totalVentas: ventasData.length,
            totalUnidades,
            ventasHoy
        });
    };

    // Filtrar ventas
    const ventasFiltradas = ventas.filter(venta => {
        const matchSearch = 
            !searchTerm ||
            venta.producto?.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venta.cliente?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            venta.id?.toString().includes(searchTerm);

        const fechaVenta = new Date(venta.fechaNotificacion);
        const matchDateFrom = !filterDateFrom || fechaVenta >= new Date(filterDateFrom);
        const matchDateTo = !filterDateTo || fechaVenta <= new Date(filterDateTo + "T23:59:59");

        return matchSearch && matchDateFrom && matchDateTo;
    });

    const limpiarFiltros = () => {
        setSearchTerm("");
        setFilterDateFrom("");
        setFilterDateTo("");
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
                
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .animate-slide-in {
                    animation: slideIn 0.4s ease-out;
                }
            `}</style>

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl overflow-hidden">
                            <div className="relative p-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                                <div className="relative flex items-center gap-4">
                                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                        <IconShoppingCart />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg mb-2">
                                            Productos Vendidos
                                        </h1>
                                        <p className="text-blue-100 text-base md:text-lg font-medium">
                                            🛒 Historial completo de ventas y salidas de inventario
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Estadísticas */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
                    >
                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-blue-100 text-sm font-medium mb-1">Total Ventas</p>
                                    <p className="text-3xl font-bold">{stats.totalVentas}</p>
                                </div>
                                <IconShoppingCart />
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-purple-100 text-sm font-medium mb-1">Unidades Vendidas</p>
                                    <p className="text-3xl font-bold">{stats.totalUnidades}</p>
                                </div>
                                <IconCube />
                            </div>
                        </div>
                        
                        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-sm font-medium mb-1">Ventas Hoy</p>
                                    <p className="text-3xl font-bold">{stats.ventasHoy}</p>
                                </div>
                                <IconCalendar />
                            </div>
                        </div>
                    </motion.div>

                    {/* Filtros y búsqueda */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8"
                    >
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <IconSearch />
                                    Búsqueda y Filtros
                                </h2>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
                                >
                                    <IconFilter />
                                    {showFilters ? "Ocultar" : "Mostrar"} Filtros
                                </button>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Barra de búsqueda */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Buscar por producto, cliente o ID..."
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>

                            {/* Filtros avanzados */}
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Desde</label>
                                        <input
                                            type="date"
                                            value={filterDateFrom}
                                            onChange={(e) => setFilterDateFrom(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha Hasta</label>
                                        <input
                                            type="date"
                                            value={filterDateTo}
                                            onChange={(e) => setFilterDateTo(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    
                                    <div className="flex items-end">
                                        <button
                                            onClick={limpiarFiltros}
                                            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-semibold"
                                        >
                                            Limpiar Filtros
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>

                    {/* Tabla de ventas */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
                    >
                        {loading ? (
                            <div className="p-16 text-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600 font-semibold">Cargando ventas...</p>
                            </div>
                        ) : error ? (
                            <div className="p-16 text-center">
                                <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-red-600 font-semibold">{error}</p>
                            </div>
                        ) : ventasFiltradas.length === 0 ? (
                            <div className="p-16 text-center">
                                <IconShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron ventas</h3>
                                <p className="text-gray-500">No hay ventas que coincidan con los filtros aplicados.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gradient-to-r from-gray-800 via-gray-900 to-black">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">
                                                <div className="flex items-center gap-2">
                                                    <IconHashtag className="h-4 w-4" />
                                                    ID Venta
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">
                                                <div className="flex items-center gap-2">
                                                    <IconCube className="h-4 w-4" />
                                                    Producto
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">
                                                <div className="flex items-center gap-2">
                                                    <IconUser className="h-4 w-4" />
                                                    Cliente
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase">Cantidad</th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase">
                                                <div className="flex items-center justify-end gap-2">
                                                    <IconCash className="h-4 w-4" />
                                                    Precio Unitario
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase">
                                                <div className="flex items-center justify-end gap-2">
                                                    <IconShoppingCart className="h-4 w-4" />
                                                    Total
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase">
                                                <div className="flex items-center gap-2">
                                                    <IconCalendar className="h-4 w-4" />
                                                    Fecha
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        <AnimatePresence>
                                            {ventasFiltradas.map((venta, index) => (
                                                <motion.tr
                                                    key={venta.id}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, x: -50 }}
                                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                                    className="odd:bg-white even:bg-gradient-to-r even:from-blue-50 even:to-purple-50 hover:bg-gradient-to-r hover:from-blue-100 hover:to-purple-100 transition-all"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                                                                {venta.id}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            {venta.producto?.descripcion || `Producto #${venta.productoId}`}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            ID: {venta.productoId}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {venta.cliente?.nombre || `Cliente #${venta.usuarioId}`}
                                                        </div>
                                                        {venta.cliente?.departamento && (
                                                            <div className="text-xs text-gray-500">
                                                                {venta.cliente.departamento}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                                                            {venta.cantidad} unidades
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="text-sm font-semibold text-gray-900">
                                                            ${venta.producto?.precio ? Number(venta.producto.precio).toFixed(2) : "—"}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            por unidad
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <div className="text-lg font-bold text-green-700">
                                                            ${venta.producto?.precio && venta.cantidad 
                                                                ? (Number(venta.producto.precio) * Number(venta.cantidad)).toFixed(2) 
                                                                : "—"}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900">
                                                            {format(new Date(venta.fechaNotificacion), "dd 'de' MMMM, yyyy", { locale: es })}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {format(new Date(venta.fechaNotificacion), "HH:mm")} hrs
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.div>

                    {/* Resumen de resultados */}
                    {!loading && !error && ventasFiltradas.length > 0 && (
                        <div className="mt-6 text-center text-sm text-gray-600">
                            Mostrando <span className="font-semibold text-blue-600">{ventasFiltradas.length}</span> de{" "}
                            <span className="font-semibold text-blue-600">{ventas.length}</span> ventas totales
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}