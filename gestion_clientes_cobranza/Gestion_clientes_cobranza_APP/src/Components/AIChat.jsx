import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function AIChat() {
    const [mensaje, setMensaje] = useState('');
    const [conversacion, setConversacion] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [modo, setModo] = useState('general'); // 'general', 'database', 'crud'
    const chatEndRef = useRef(null);
    const messagesContainerRef = useRef(null);

    const enviarMensaje = async (e) => {
        e.preventDefault();
        
        if (!mensaje.trim()) return;
        
        const nuevoMensaje = { tipo: 'usuario', texto: mensaje };
        setConversacion([...conversacion, nuevoMensaje]);
        const mensajeTemp = mensaje;
        setMensaje('');
        setCargando(true);
        
        try {
            // Seleccionar endpoint según el modo
            let endpoint = 'http://localhost:8080/api/ai/chat/general'; // Por defecto
            
            if (modo === 'database') {
                endpoint = 'http://localhost:8080/api/ai/chat/database';
            } else if (modo === 'crud') {
                endpoint = 'http://localhost:8080/api/ai/chat/actions';
            }
            
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ mensaje: mensajeTemp })
            });
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }
            
            const data = await response.json();
            
            // Manejar respuesta según el tipo
            let respuestaTexto = '';
            let tipoMensaje = 'ia';
            
            if (data.tipo === 'accion') {
                respuestaTexto = data.mensaje;
                tipoMensaje = data.resultado?.exito ? 'exito' : 'error';
                
                if (data.resultado?.datos) {
                    respuestaTexto += '\n\n📋 Detalles:\n' + 
                        JSON.stringify(data.resultado.datos, null, 2);
                }
            } else if (data.respuesta) {
                respuestaTexto = data.respuesta;
            } else if (data.mensaje) {
                respuestaTexto = data.mensaje;
            } else {
                respuestaTexto = 'Respuesta procesada correctamente';
            }
            
            setConversacion(prev => [...prev, { 
                tipo: tipoMensaje, 
                texto: respuestaTexto 
            }]);
            
        } catch (error) {
            console.error('Error:', error);
            setConversacion(prev => [...prev, { 
                tipo: 'error', 
                texto: 'Error al conectar con la IA. Verifica que el servidor esté corriendo.' 
            }]);
        } finally {
            setCargando(false);
        }
    };

    // Auto-scroll al final cuando hay nuevos mensajes
    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [conversacion, cargando]);

    const limpiarChat = () => {
        setConversacion([]);
    };

    const cambiarModo = (nuevoModo) => {
        setModo(nuevoModo);
        setConversacion([]);
    };

    const getModoConfig = () => {
        switch(modo) {
            case 'general':
                return {
                    titulo: 'Chat General',
                    subtitulo: '💬 Conversación Libre',
                    descripcion: 'Chatea libremente sobre cualquier tema sin restricciones',
                    color: 'purple',
                    gradiente: 'from-purple-500 to-pink-600',
                    bgClaro: 'bg-purple-100',
                    textColor: 'text-purple-700',
                    borderColor: 'border-purple-300',
                    hoverBg: 'hover:bg-purple-200',
                    ejemplos: [
                        '• Explícame qué es la inteligencia artificial',
                        '• Cuéntame un chiste',
                        '• ¿Cómo funciona Java?',
                        '• Dame consejos para programar mejor',
                        '• Ayúdame con una tarea de matemáticas'
                    ]
                };
            case 'database':
                return {
                    titulo: 'Consultas DB',
                    subtitulo: '🔍 Solo Lectura',
                    descripcion: 'Pregunta sobre los datos en tu base de datos',
                    color: 'blue',
                    gradiente: 'from-blue-500 to-indigo-600',
                    bgClaro: 'bg-blue-100',
                    textColor: 'text-blue-700',
                    borderColor: 'border-blue-300',
                    hoverBg: 'hover:bg-blue-200',
                    ejemplos: [
                        '• ¿Cuántas pinturas hay?',
                        '• Muéstrame todos los productos',
                        '• ¿Qué empleados trabajan aquí?',
                        '• Lista los materiales disponibles',
                        '• ¿Cuál es el inventario total?'
                    ]
                };
            case 'crud':
                return {
                    titulo: 'Modo CRUD',
                    subtitulo: '⚙️ Crear, Actualizar, Eliminar',
                    descripcion: 'Modifica datos en tu base de datos',
                    color: 'orange',
                    gradiente: 'from-orange-500 to-red-600',
                    bgClaro: 'bg-orange-100',
                    textColor: 'text-orange-700',
                    borderColor: 'border-orange-300',
                    hoverBg: 'hover:bg-orange-200',
                    ejemplos: [
                        '• Crea una pintura roja Comex precio 150 stock 10',
                        '• Actualiza el precio de la pintura ID 5 a 200',
                        '• Agrega un empleado Juan Ventas sueldo 5000',
                        '• Elimina el producto ID 3',
                        '• Modifica el stock del material ID 2 a 50'
                    ]
                };
        }
    };

    const config = getModoConfig();

    return (
        <>
            <style>{`
                @keyframes slideInFromTop {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes fadeInScale {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                
                .scrollbar-thin::-webkit-scrollbar {
                    width: 6px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 10px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-thumb {
                    background: #888;
                    border-radius: 10px;
                }
                
                .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                    background: #555;
                }
            `}</style>
            <div className="min-h-screen ">
                <div className="max-w-5xl mx-auto">
                    {/* Header Mejorado */}
                    <motion.div
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-t-2xl shadow-2xl overflow-hidden"
                    >
                        <div className="px-6 py-5">
                            <div className="flex items-center justify-between mb-4">
                                <motion.div 
                                    className="flex items-center space-x-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <motion.div 
                                        className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg bg-white/20 backdrop-blur-sm`}
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </motion.div>
                                    <div>
                                        <h2 className="text-3xl font-bold drop-shadow-lg">Asistente IA Oni3D</h2>
                                        <p className="text-blue-100 text-sm font-medium mt-1">{config.subtitulo}</p>
                                    </div>
                                </motion.div>
                                <AnimatePresence>
                                    {conversacion.length > 0 && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={limpiarChat}
                                            className="px-5 py-2.5 text-sm font-bold text-white bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all shadow-lg hover:shadow-xl"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Limpiar Chat
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                            {/* Selector de Modo Mejorado */}
                            <motion.div 
                                className="flex space-x-2"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {['general', 'database', 'crud'].map((m, index) => {
                                    const isActive = modo === m;
                                    const configModo = m === 'general' ? { grad: 'from-purple-500 to-pink-600', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' } :
                                       m === 'database' ? { grad: 'from-blue-500 to-indigo-600', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' } :
                                       { grad: 'from-orange-500 to-red-600', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z' };
                                    return (
                                        <motion.button
                                            key={m}
                                            onClick={() => cambiarModo(m)}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.3 + (index * 0.1) }}
                                            whileHover={{ scale: 1.02, y: -2 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`flex-1 px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                                                isActive
                                                    ? `bg-gradient-to-r ${configModo.grad} text-white shadow-lg`
                                                    : 'bg-white/10 backdrop-blur-sm text-white/80 hover:bg-white/20'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={configModo.icon} />
                                                </svg>
                                                <span>{m === 'general' ? 'Chat General' : m === 'database' ? 'Consultas' : 'Editar DB'}</span>
                                            </div>
                                        </motion.button>
                                    );
                                })}
                            </motion.div>
                        
                        {/* Advertencia CRUD */}
                        <AnimatePresence>
                            {modo === 'crud' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 bg-orange-50/20 backdrop-blur-sm border-l-4 border-orange-400 p-4 rounded-xl"
                                >
                                    <div className="flex items-start">
                                        <svg className="w-6 h-6 text-orange-300 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        <div className="ml-3">
                                            <p className="text-sm text-white font-bold">
                                                ⚠️ Modo CRUD activado - La IA puede modificar datos
                                            </p>
                                            <p className="text-xs text-white/80 mt-1">
                                                Puedes crear, actualizar y eliminar registros mediante comandos de lenguaje natural.
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        </div>
                    </motion.div>

                    {/* Chat Messages Mejorado */}
                    <motion.div 
                        ref={messagesContainerRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="bg-white shadow-xl px-6 py-6 scrollbar-thin" 
                        style={{ height: '500px', overflowY: 'auto' }}
                    >
                        {conversacion.length === 0 ? (
                            <motion.div 
                                className="h-full flex flex-col items-center justify-center text-center"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5 }}
                            >
                                <motion.div 
                                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br ${
                                        modo === 'general' ? 'from-purple-200 to-pink-200' :
                                        modo === 'database' ? 'from-blue-200 to-indigo-200' :
                                        'from-orange-200 to-red-200'
                                    }`}
                                    animate={{ 
                                        scale: [1, 1.05, 1],
                                        rotate: [0, 5, -5, 0]
                                    }}
                                    transition={{ 
                                        duration: 4, 
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                <svg className={`w-10 h-10 ${
                                    modo === 'general' ? 'text-purple-500' :
                                    modo === 'database' ? 'text-indigo-500' :
                                    'text-orange-500'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {modo === 'general' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    ) : modo === 'database' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    )}
                                    </svg>
                                </motion.div>
                                <motion.h3 
                                    className="text-2xl font-bold text-gray-800 mb-3"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {config.titulo}
                                </motion.h3>
                                <motion.p 
                                    className="text-gray-600 max-w-md mb-6 text-base"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {config.descripcion}
                                </motion.p>
                                
                                <motion.div 
                                    className={`border-2 rounded-xl p-5 max-w-md ${config.bgClaro} ${config.borderColor} shadow-lg`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <p className={`text-sm font-bold mb-3 ${config.textColor}`}>
                                        💡 Ejemplos de uso:
                                    </p>
                                    <ul className={`text-sm space-y-2 text-left ${config.textColor}`}>
                                        {config.ejemplos.map((ejemplo, i) => (
                                            <motion.li 
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.5 + (i * 0.1) }}
                                                className="hover:text-opacity-80 transition-colors"
                                            >
                                                {ejemplo}
                                            </motion.li>
                                        ))}
                                    </ul>
                                </motion.div>
                            </motion.div>
                        ) : (
                            <div className="space-y-4">
                                <AnimatePresence>
                                    {conversacion.map((msg, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ 
                                                duration: 0.3,
                                                delay: index === conversacion.length - 1 ? 0 : 0
                                            }}
                                            className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <motion.div
                                                className={`max-w-xs lg:max-w-md xl:max-w-lg px-5 py-4 rounded-2xl shadow-lg ${
                                                    msg.tipo === 'usuario'
                                                        ? `bg-gradient-to-r ${config.gradiente} text-white`
                                                        : msg.tipo === 'ia' || msg.tipo === 'exito'
                                                        ? msg.tipo === 'exito'
                                                            ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-900 border-2 border-green-300'
                                                            : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-800 border-2 border-gray-200'
                                                        : 'bg-gradient-to-br from-red-50 to-rose-50 text-red-900 border-2 border-red-300'
                                                }`}
                                                whileHover={{ scale: 1.02 }}
                                                transition={{ type: "spring", stiffness: 300 }}
                                            >
                                        <div className="flex items-start space-x-2">
                                            {(msg.tipo === 'ia' || msg.tipo === 'exito') && (
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                                    msg.tipo === 'exito' 
                                                        ? 'bg-gradient-to-br from-green-400 to-emerald-500' 
                                                        : 'bg-gradient-to-br from-blue-400 to-indigo-500'
                                                }`}>
                                                    {msg.tipo === 'exito' ? (
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </div>
                                            )}
                                            {msg.tipo === 'error' && (
                                                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <p className={`text-xs font-semibold mb-1 ${
                                                    msg.tipo === 'usuario' 
                                                        ? 'text-white opacity-90' 
                                                        : msg.tipo === 'exito'
                                                        ? 'text-green-700'
                                                        : msg.tipo === 'error'
                                                        ? 'text-red-700'
                                                        : 'text-gray-600'
                                                }`}>
                                                    {msg.tipo === 'usuario' 
                                                        ? 'Tú' 
                                                        : msg.tipo === 'exito'
                                                        ? '✅ Acción Completada'
                                                        : msg.tipo === 'error' 
                                                        ? '❌ Error' 
                                                        : 'Asistente IA'}
                                                </p>
                                                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                    {msg.texto}
                                                </p>
                                            </div>
                                            {msg.tipo === 'usuario' && (
                                                <div className="w-6 h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                
                                {/* Indicador de carga mejorado */}
                                {cargando && (
                                    <motion.div 
                                        className="flex justify-start"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                    >
                                        <div className="max-w-xs px-5 py-4 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 border-2 border-gray-200 shadow-lg">
                                            <div className="flex items-center space-x-3">
                                                <motion.div 
                                                    className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </motion.div>
                                                <div className="flex space-x-1.5">
                                                    <motion.div 
                                                        className="w-2.5 h-2.5 bg-blue-400 rounded-full" 
                                                        animate={{ y: [0, -8, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                    />
                                                    <motion.div 
                                                        className="w-2.5 h-2.5 bg-indigo-500 rounded-full" 
                                                        animate={{ y: [0, -8, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                                                    />
                                                    <motion.div 
                                                        className="w-2.5 h-2.5 bg-purple-500 rounded-full" 
                                                        animate={{ y: [0, -8, 0] }}
                                                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        )}
                    </motion.div>

                    {/* Input Form Mejorado */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white rounded-b-2xl shadow-xl px-6 py-5 border-t border-gray-200"
                    >
                        <form onSubmit={enviarMensaje} className="flex space-x-3">
                            <motion.div 
                                className="flex-1 relative"
                                whileFocus={{ scale: 1.01 }}
                            >
                                <input
                                    type="text"
                                    value={mensaje}
                                    onChange={(e) => setMensaje(e.target.value)}
                                    placeholder={
                                        modo === 'general' ? "Pregúntame lo que quieras..." :
                                        modo === 'database' ? "Pregunta sobre tu base de datos..." :
                                        "Escribe un comando (crear, actualizar, eliminar)..."
                                    }
                                    disabled={cargando}
                                    className="w-full px-5 py-4 pr-14 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400 font-medium transition-all shadow-sm hover:shadow-md"
                                />
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                    <svg className={`w-6 h-6 ${
                                        modo === 'general' ? 'text-purple-500' :
                                        modo === 'database' ? 'text-blue-500' :
                                        'text-orange-500'
                                    }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                            </motion.div>
                            <motion.button
                                type="submit"
                                disabled={cargando || !mensaje.trim()}
                                className={`px-8 py-4 font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 bg-gradient-to-r ${config.gradiente} text-white`}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {cargando ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Procesando</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Enviar</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </>
                                )}
                            </motion.button>
                    </form>
                    
                        {/* Status Info Mejorado */}
                        <motion.div 
                            className="mt-4 flex items-center justify-between text-xs text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            <div className="flex items-center space-x-1">
                                <div className={`w-2 h-2 rounded-full animate-pulse ${
                                    modo === 'general' ? 'bg-purple-500' :
                                    modo === 'database' ? 'bg-blue-500' :
                                    'bg-orange-500'
                                }`}></div>
                                <span>
                                    {modo === 'general' ? 'Modo Chat General - Sin restricciones' :
                                     modo === 'database' ? 'Modo Consulta - Solo lectura' :
                                     'Modo CRUD - Puede modificar datos'}
                                </span>
                            </div>
                            <span className="font-semibold">{conversacion.length} mensajes</span>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </>
    );
}

export default AIChat;