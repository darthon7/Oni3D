import React, { useEffect, useState, useCallback } from "react"; // Importar useCallback
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom"; // Importar hooks de router
import { format } from 'date-fns'; // Importar format

export default function AgregarAlerta2({ onCreated }) {
    // --- NUEVO: Detectar si estamos en modo Edición ---
    const { id: eventoId } = useParams(); // Obtener el ID de la URL
    const navigate = useNavigate(); // Hook para navegar
    const isEditMode = Boolean(eventoId); // true si hay un ID, false si no

    // Estados del Formulario (sin cambios)
    const [productId, setProductId] = useState("");
    const [product, setProduct] = useState(null);
    const [cantidad, setCantidad] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [fecha, setFecha] = useState("");
    const [titulo, setTitulo] = useState(""); // Añadido para edición
    
    // Estados de Carga y Mensajes (sin cambios)
    const [loading, setLoading] = useState(false); // Ahora se usa para cargar y enviar
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    // Estados de Empleados (sin cambios)
    const [empleados, setEmpleados] = useState([]);
    const [empleadosLoading, setEmpleadosLoading] = useState(false);
    const [empleadosError, setEmpleadosError] = useState("");
    const [selectedEmpleadoId, setSelectedEmpleadoId] = useState("");

    // Constantes de API (sin cambios)
    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const PRODUCT_API = `${API_BASE}/api/productos`;
    const EVENT_API = `${API_BASE}/api/eventos`;
    const EMPLEADO_API = `${API_BASE}/api/empleados`;

    // --- Lógica de Cargar Producto (Usada por ambos modos) ---
    // (Usar useCallback para optimizar)
    const handleLoadProduct = useCallback(async (id) => {
        if (!id || !String(id).trim()) {
            setError("Ingresa un ID de producto válido");
            return;
        }
        setError(""); setSuccessMessage(""); setProduct(null);
        try {
            const res = await axios.get(`${PRODUCT_API}/${id}`);
            setProduct(res.data);
        } catch (err) {
            console.error("Error cargando producto:", err?.response || err);
            setError("Producto no encontrado con ese ID.");
        }
    }, [PRODUCT_API]); // Dependencia

    // --- NUEVO: useEffect para Cargar Datos en Modo Edición ---
    useEffect(() => {
        const fetchEmpleados = async () => {
             // ... (Lógica para cargar empleados sin cambios)
             setEmpleadosLoading(true); setEmpleadosError("");
             try {
                 const res = await axios.get(EMPLEADO_API);
                 setEmpleados(Array.isArray(res.data) ? res.data : []);
             } catch (err) { setEmpleadosError("No se pudieron cargar los empleados/clientes"); } 
             finally { setEmpleadosLoading(false); }
        };
        
        const fetchEventoParaEditar = async () => {
            if (isEditMode) {
                console.log("Modo Edición: Cargando evento ID", eventoId);
                setLoading(true); // Activar carga general
                setError(""); setSuccessMessage("");
                try {
                    const res = await axios.get(`${EVENT_API}/${eventoId}`);
                    const evento = res.data;
                    
                    // Formatear fecha para el input
                    const fechaFormato = evento.fechaNotificacion
                        ? format(new Date(evento.fechaNotificacion), "yyyy-MM-dd'T'HH:mm")
                        : "";
                    
                    // Llenar todos los estados del formulario
                    setProductId(String(evento.productoId || ''));
                    setCantidad(String(evento.cantidad || ''));
                    setDescripcion(evento.descripcion || '');
                    setTitulo(evento.titulo || ''); // Llenar el título
                    setFecha(fechaFormato);
                    setSelectedEmpleadoId(String(evento.usuarioId || ''));
                    
                    // Cargar los detalles del producto asociado
                    if (evento.productoId) {
                        // Llamar a handleLoadProduct (que está en useCallback)
                        await handleLoadProduct(String(evento.productoId)); 
                    }
                    
                } catch (err) {
                    console.error("Error al cargar el evento:", err);
                    setError("No se pudo cargar la alerta para editar. Verifica el ID.");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchEmpleados(); // Cargar empleados en ambos modos
        fetchEventoParaEditar(); // Cargar datos del evento SOLO si hay un ID

    }, [isEditMode, eventoId, EVENT_API, EMPLEADO_API, handleLoadProduct]); // Incluir handleLoadProduct en deps

    // --- Funciones de Formulario (Modificadas) ---
    const resetForm = () => {
        setProductId(""); setProduct(null); setCantidad("");
        setDescripcion(""); setFecha(""); setSelectedEmpleadoId("");
        setError(""); setTitulo("");
        
        // Limpiar input de ID de producto
        const inputId = document.getElementById("notif-product-id");
        if(inputId) inputId.value = "";
    };

    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        if (error) setError("");
        if (successMessage) setSuccessMessage("");
    };

    // --- Implementación de getMinDateTime ---
    const getMinDateTime = () => {
        const now = new Date();
        // Ajustar a la zona horaria local (restar el offset en minutos)
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        // Formatear a ISO string y tomar la parte YYYY-MM-DDTHH:mm
        return now.toISOString().slice(0, 16);
    };

    
    // Validación de fecha (línea ~130 aprox)
const handleFechaChange = (e) => {
    const selectedDate = e.target.value;
    const minDate = getMinDateTime();
    
    // Validar fecha futura en AMBOS modos
    if (selectedDate && selectedDate < minDate) {
        setError("❌ No puedes seleccionar una fecha anterior a la actual");
        setFecha("");
        return;
    }
    
    setFecha(selectedDate);
    if (error) setError("");
    if (successMessage) setSuccessMessage("");
};


    // --- handleSubmit AHORA DECIDE QUÉ HACER ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setSuccessMessage("");

        // --- Validaciones (iguales para ambos modos) ---
        if (!product) { setError("Carga primero un producto válido (por ID)."); return; }
        const qty = Number(cantidad);
        if (!cantidad || isNaN(qty) || qty <= 0) { setError("Ingrese una cantidad válida (> 0)."); return; }
        if (!selectedEmpleadoId) { setError("Selecciona un empleado/cliente."); return; }
        if (!fecha) { setError("Selecciona fecha y hora."); return; }
        
        // No validar stock en modo edición (backend lo maneja)
        if (!isEditMode) {
            const currentStock = Number(product.stock ?? product.cantidad ?? 0);
            if (isFinite(currentStock) && qty > currentStock) {
                setError(`Cantidad solicitada (${qty}) es mayor al stock actual (${currentStock}).`);
                return;
            }
             // Volver a validar la fecha en el submit por si acaso
             const selectedDateTime = new Date(fecha);
             const now = new Date();
             // Permitir un pequeño margen de 1 minuto para clics lentos
             if (selectedDateTime < (now - 60000)) { 
                 setError("❌ La fecha y hora no pueden ser anteriores a la fecha actual");
                 return;
             }

             
        }
        
        setLoading(true);

        // --- DECISIÓN: CREAR (POST) O ACTUALIZAR (PUT) ---

        if (isEditMode) {
            // --- LÓGICA DE ACTUALIZACIÓN (PUT) ---
            try {
                const payload = {
                    id: Number(eventoId),
                    titulo: titulo || `Venta / Salida de producto #${productId}`, // Usar el título editable
                    descripcion: descripcion || `Se registraron ${qty} unidades...`,
                    fechaNotificacion: new Date(fecha).toISOString(), // Convertir a ISO
                    notificado: product.notificado || false, // Mantener estado de notificación
                    usuarioId: Number(selectedEmpleadoId),
                    productoId: Number(productId),
                    cantidad: qty,
                };
                
                await axios.put(`${EVENT_API}/${eventoId}`, payload);
                setSuccessMessage("✅ Alerta actualizada correctamente.");
                
                // Redirigir de vuelta al calendario
                setTimeout(() => navigate('/calendario'), 1500); 

            } catch (err) {
                console.error('Error actualizando evento:', err);
                setError(err.response?.data?.message || "Error al guardar los cambios.");
            } finally {
                setLoading(false);
            }

        } else {
            // --- LÓGICA DE CREACIÓN (POST) (Tu código original) ---
            const originalStock = Number(product.stock ?? product.cantidad ?? 0);
            try {
                // 1. Decrementar stock
                await axios.post(`${PRODUCT_API}/${productId}/decrease-stock`, { cantidad: qty }, { headers: { "Content-Type": "application/json" } });

                // 2. Crear evento
                const eventoPayload = {
                    titulo: `Venta / Salida de producto #${productId}`, // Título por defecto
                    descripcion: descripcion || `Se registraron ${qty} unidades del producto ${product.descripcion ?? ""}`,
                    fechaNotificacion: fecha,
                    notificado: false,
                    usuarioId: Number(selectedEmpleadoId),
                    productoId: Number(productId),
                    cantidad: qty,
                };
                const eventoRes = await axios.post(EVENT_API, eventoPayload, { headers: { "Content-Type": "application/json" } });
                
                if (onCreated && typeof onCreated === "function") onCreated(eventoRes.data);
                setSuccessMessage("✅ Alerta creada y stock actualizado correctamente.");
                resetForm();

            } catch (err) {
                 console.error("Error al crear alerta:", err?.response || err);
                 const errResp = err?.response;
                 const status = errResp?.status;
                 if (status === 409) {
                     setError("No hay suficiente stock o producto no encontrado.");
                 } else {
                     setError(errResp?.data?.message || err.message || "Ocurrió un error al crear la alerta.");
                 }
                 // Intentar Rollback
                 try {
                     if (Number.isFinite(originalStock)) {
                         await axios.patch(`${PRODUCT_API}/${productId}/stock`, { stock: originalStock }, { headers: { "Content-Type": "application/json" } });
                         console.warn("Se intentó rollback del stock al valor original:", originalStock);
                     }
                 } catch (rollbackErr) { console.error("Error intentando revertir el stock:", rollbackErr?.response || rollbackErr); }
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            {/* Estilos (sin cambios) */}
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideIn { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes pulse-success { 0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.4); } 50% { box-shadow: 0 0 0 10px rgba(34, 197, 94, 0); } }
                @keyframes pulse-error { 0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); } 50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); } }
                .animate-fade-in { animation: fadeIn 0.5s ease-out; }
                .animate-slide-in { animation: slideIn 0.3s ease-out; }
                .pulse-success { animation: pulse-success 2s infinite; }
                .pulse-error { animation: pulse-error 2s infinite; }
            `}</style>

            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-4 sm:p-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header (Título dinámico) */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl overflow-hidden mb-8 animate-fade-in">
                        <div className="relative p-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                            <div className="relative flex items-center gap-4">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                    {/* Icono dinámico */}
                                    {isEditMode ? (
                                         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                    ) : (
                                         <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                    )}
                                </div>
                                <div>
                                    {/* Título dinámico */}
                                    <h3 className="text-3xl sm:text-4xl font-bold drop-shadow-lg mb-2">
                                        {isEditMode ? `Editar Alerta (ID: ${eventoId})` : "Agregar Alerta de Inventario"}
                                    </h3>
                                    <p className="text-blue-100 text-base sm:text-lg font-medium">
                                        {isEditMode ? "Modifica los detalles de la alerta seleccionada." : "Registra salidas de productos y actualiza el stock."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenedor del formulario */}
                    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-white/10 animate-fade-in">
                        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                            
                            {/* Mensajes de Estado */}
                            {successMessage && (
                                <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500 text-white px-6 py-4 rounded-xl relative pulse-success animate-slide-in flex items-center gap-3">
                                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className="font-semibold">{successMessage}</span>
                                </div>
                            )}
                            {error && (
                                <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-2 border-red-500 text-white px-6 py-4 rounded-xl relative pulse-error animate-slide-in flex items-center gap-3">
                                    <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    <span className="font-semibold">{error}</span>
                                </div>
                            )}

                            {/* Sección de Producto */}
                            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-xl p-6 border border-blue-500/20">
                                <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                    Información del Producto
                                </h4>
                                
                                <div>
                                    <label htmlFor="notif-product-id" className="block mb-2 font-semibold text-gray-300">ID del producto</label>
                                    <div className="flex gap-3">
                                        <input
                                            id="notif-product-id"
                                            value={productId}
                                            onChange={handleInputChange(setProductId)}
                                            className="flex-1 bg-gray-700/50 border border-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all hover:bg-gray-700/70"
                                            placeholder="Ingresa ID del producto"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleLoadProduct(productId)} // Usar el estado productId
                                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg cursor-pointer"
                                        >
                                            <svg className="w-5 h-5 " fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                            Cargar
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Carga la información del producto para verificar stock disponible
                                    </p>
                                </div>

                                {product && (
                                    <div className="mt-4 bg-gradient-to-br from-gray-700/50 to-gray-800/50 border border-white/10 p-5 rounded-xl animate-slide-in">
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Descripción</p>
                                                <p className="text-white font-semibold">{product.descripcion ?? product.nombre ?? "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Precio</p>
                                                <p className="text-green-400 font-bold text-lg">${product.precio ?? "—"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Stock actual</p>
                                                <p className="text-blue-400 font-bold text-lg">{product.stock ?? product.cantidad ?? 0} unidades</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Campo Título (Solo para Edición) */}
                            {isEditMode && (
                                <div>
                                    <label htmlFor="titulo" className="block mb-2 font-semibold text-white flex items-center gap-2">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm2 1h1v1H6V5zm0 2h1v1H6V7z" clipRule="evenodd" /></svg>
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        id="titulo" // Añadido id
                                        name="titulo"
                                        value={titulo}
                                        onChange={handleInputChange(setTitulo)}
                                        className="w-full bg-gray-700/50 border border-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all hover:bg-gray-700/70"
                                        placeholder="Ej: Venta especial cliente X"
                                        required // Hacerlo requerido como en EditarAlerta
                                    />
                                </div>
                            )}

                            {/* Grid de inputs (Cantidad y Cliente/Empleado) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="cantidad" className="block mb-2 font-semibold text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>
                                        Cantidad
                                    </label>
                                    <input
                                        id="cantidad" // Añadido id
                                        type="number" min="1" step="1"
                                        value={cantidad}
                                        onChange={handleInputChange(setCantidad)}
                                        className="w-full bg-gray-700/50 border border-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-white placeholder-gray-400 transition-all hover:bg-gray-700/70"
                                        placeholder="Número de unidades"
                                        required // Añadido required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="selectedEmpleadoId" className="block mb-2 font-semibold text-white flex items-center gap-2">
                                        <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        Cliente
                                    </label>
                                    {empleadosLoading ? (
                                        <div className="text-sm text-gray-400 flex items-center gap-2 py-3">
                                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500"></div>
                                            Cargando clientes...
                                        </div>
                                    ) : empleadosError ? (
                                        <div className="text-sm text-red-400">{empleadosError}</div>
                                    ) : (
                                        <select
                                            id="selectedEmpleadoId" // Añadido id
                                            value={selectedEmpleadoId}
                                            onChange={handleInputChange(setSelectedEmpleadoId)}
                                            className="w-full bg-gray-700/50 border border-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white cursor-pointer transition-all hover:bg-gray-700/70"
                                            required // Añadido required
                                        >
                                            <option value="">-- Selecciona un cliente --</option>
                                            {empleados.map((emp) => (
                                                <option key={emp.idEmpleado} value={emp.idEmpleado}>
                                                    {emp.nombre} {emp.departamento ? `(${emp.departamento})` : ""}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </div>
                            </div>

                            {/* Fecha y hora */}
                            <div>
                                <label htmlFor="fecha" className="block mb-2 font-semibold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    Fecha y hora de la salida
                                </label>
                                <input
                                     id="fecha"
                                        type="datetime-local"
                                        value={fecha}
                                        onChange={handleFechaChange}
                                        min={getMinDateTime()} // <-- Aplicar en AMBOS modos
                                        className="w-full bg-gray-700/50 border border-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-white cursor-pointer transition-all hover:bg-gray-700/70"
                                        required
                                    />
                                    {/* Mensaje siempre visible */}
                                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                        <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        ⚠️ Solo puedes seleccionar fechas desde la fecha y hora actual en adelante
                                    </p>
                                
                            </div>

                            {/* Descripción */}
                            <div>
                                <label htmlFor="descripcion" className="block mb-2 font-semibold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    Descripción (opcional)
                                </label>
                                <textarea
                                    id="descripcion" // Añadido id
                                    value={descripcion}
                                    onChange={handleInputChange(setDescripcion)}
                                    className="w-full bg-gray-700/50 border border-gray-600 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all hover:bg-gray-700/7D resize-none"
                                    placeholder="Agrega detalles adicionales sobre esta salida de inventario..."
                                    rows={3}
                                />
                            </div>

                            {/* --- Botón de envío (Dinámico) --- */}
                            <div className="flex justify-end pt-4 border-t border-white/10">
                                {isEditMode && (
                                     <Link
                                        to="/calendario"
                                        className="px-6 py-3 mr-4 bg-gray-700/50 text-gray-300 font-bold rounded-xl shadow-md border border-gray-600 hover:bg-gray-700 transition-all duration-300 transform hover:scale-105 cursor-pointer"
                                    >
                                        Cancelar
                                    </Link>
                                )}
                                <button
                                    type="submit"
                                    disabled={loading || empleadosLoading} // Deshabilitar si se está cargando CUALQUIER cosa
                                    className={`px-8 py-4 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 text-lg cursor-pointer ${
                                        isEditMode 
                                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
                                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                    }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                                            Procesando...
                                        </>
                                    ) : (
                                        isEditMode ? (
                                            <>
                                                <svg className="w-6 h-6 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                Guardar Cambios
                                            </>
                                        ) : (
                                            <>
                                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Crear alerta y descontar stock
                                            </>
                                        )
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

