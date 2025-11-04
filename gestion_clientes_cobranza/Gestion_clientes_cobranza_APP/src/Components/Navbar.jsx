import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import print from '../assets/print.png';

// Icono Avatar Placeholder
const IconAvatarPlaceholder = () => (
    <svg className="h-8 w-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

export default function Navbar({ toggleSidebar }) {
    const { user, logout } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pollingRef = useRef(null);

    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const API_FILES = import.meta.env.VITE_API_FILES_URL || 'http://localhost:8080/api/files';

    // Detectar scroll para efecto glassmorphism
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
            logout();
        }
    };

    // Mostrar toast y notificación de sistema (si el navegador lo permite)
    const showNotification = (evento) => {
        const title = evento.titulo || 'Notificación';
        const body = evento.descripcion || '';

        // Toast in-app
        toast.info(
            <div>
                <strong>{title}</strong>
                <div style={{ fontSize: 12 }}>{body}</div>
            </div>,
            { position: "top-right", autoClose: 8000 }
        );

        // Notification API (desktop browsers)
        if ("Notification" in window && Notification.permission === "granted") {
            try {
                new Notification(title, { body });
            } catch (e) {
                console.warn("Notification API error:", e);
            }
        }
    };

    // Marcar como notificado en backend
    const markAsNotified = async (id) => {
        try {
            await axios.post(`${API_BASE}/api/eventos/${id}/mark-notified`);
        } catch (err) {
            console.error("Error marcando notificado:", err?.response || err);
        }
    };

    // Procesar eventos pendientes: mostrar y marcar
    const handlePendingEvents = async (eventos) => {
        if (!eventos || eventos.length === 0) return;

        // Mostrar cada evento con toast y Notification
        eventos.forEach(ev => showNotification(ev));

        // Guardar en estado para el desplegable
        setNotifications(prev => {
            // unir nuevos al inicio y limitar a 20
            const merged = [...eventos, ...prev].slice(0, 20);
            setUnreadCount(merged.length);
            return merged;
        });

        // Marcar cada evento como notificado (evita duplicados)
        for (const ev of eventos) {
            try {
                await markAsNotified(ev.id);
            } catch (e) {
                console.error("No se pudo marcar evento:", ev.id, e);
            }
        }
    };

    // Llamada al endpoint para obtener pendientes
    const fetchPending = async () => {
        try {
            const res = await axios.get(`${API_BASE}/api/eventos/pending`);
            const eventos = res.data;
            if (Array.isArray(eventos) && eventos.length > 0) {
                await handlePendingEvents(eventos);
            }
        } catch (err) {
            console.error("Error obteniendo eventos pendientes:", err?.response || err);
        }
    };

    // Pedir permiso para Notification API la primera vez
    const requestNotificationPermission = () => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                console.log("Notification permission:", permission);
            });
        }
    };

    // Inicializar polling cada 30s
    useEffect(() => {
        if (!user) {
            if (pollingRef.current) clearInterval(pollingRef.current);
            return;
        }

        requestNotificationPermission();
        fetchPending(); // fetch inicial

        pollingRef.current = setInterval(fetchPending, 30_000); // 30s
        return () => {
            if (pollingRef.current) clearInterval(pollingRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const toggleDropdown = () => {
        setOpenDropdown(prev => !prev);
        if (!openDropdown) {
            setUnreadCount(0);
        }
    };

    const removeNotification = (id, e) => {
        e.stopPropagation();
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "data:image/svg+xml;base64," + btoa('<svg class="h-10 w-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>');
        e.target.style.objectFit = 'contain';
    };

    return (
        <>
            <ToastContainer />
            
            {/* Estilos adicionales para animaciones */}
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-3px); }
                }
                
                @keyframes glow {
                    0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5), 0 0 10px rgba(59, 130, 246, 0.3); }
                    50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.8), 0 0 30px rgba(59, 130, 246, 0.5); }
                }
                
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes pulse-ring {
                    0% {
                        transform: scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
                
                .shimmer {
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
                    background-size: 200% 100%;
                    animation: shimmer 2s infinite;
                }
                
                .float-animation {
                    animation: float 3s ease-in-out infinite;
                }
                
                .glow-effect {
                    animation: glow 2s ease-in-out infinite;
                }
                
                .slide-down {
                    animation: slideDown 0.3s ease-out;
                }
                
                .pulse-ring {
                    animation: pulse-ring 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                .backdrop-blur-custom {
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                }
            `}</style>

            <nav className={`fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 sm:px-6 shadow-2xl z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-black/80 backdrop-blur-custom border-b border-white/10' 
                    : 'bg-gradient-to-r from-black via-gray-900 to-blue-900'
            }`}>
                
                {/* Efecto de brillo superior */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-50"></div>
                
                {/* Left side */}
                <div className="flex items-center gap-2 sm:gap-4">
                    {/* Botón Hamburguesa */}
                    <button
                        onClick={toggleSidebar}
                        className="relative text-white hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-purple-500/20 p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 group overflow-hidden cursor-pointer"
                        aria-label="Toggle sidebar"
                    >
                        <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <svg className="w-6 h-6 relative z-10 transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    {/* Logo y Título */}
                    <div className="flex items-center gap-2 sm:gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg blur-md opacity-75 group-hover:opacity-100 transition-opacity glow-effect"></div>
                            <div className="relative w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-lg flex items-center justify-center shrink-0 float-animation">
                                <img src={print} alt="Logo Oni3D" className="w-full h-full rounded-md object-cover"/>
                            </div>
                        </div>
                        
                        <div className="text-white hidden md:block">
                            <div className="text-lg font-bold leading-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                                ONI3D
                            </div>
                            <div className="text-blue-300 text-xs leading-tight font-medium">
                                Sistema de gestión
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 sm:gap-4 relative">
                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={toggleDropdown}
                            className="relative text-white hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-purple-500/20 p-2 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 group cursor-pointer"
                            title="Notificaciones"
                            aria-haspopup="true"
                            aria-expanded={openDropdown}
                        >
                            <svg className="w-6 h-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-3.5-3.5M9 7v6l2 2h4l2-2V7a4 4 0 10-8 0z" />
                            </svg>
                            {unreadCount > 0 && (
                                <>
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-lg">
                                        {unreadCount}
                                    </span>
                                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full h-5 w-5 pulse-ring"></span>
                                </>
                            )}
                        </button>

                        {/* Dropdown */}
                        {openDropdown && (
                            <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-white/10 text-white z-50 overflow-hidden slide-down backdrop-blur-custom">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"></div>
                                
                                <div className="relative p-4 border-b border-white/10 font-bold text-lg bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Notificaciones
                                </div>
                                
                                <div className="relative max-h-64 overflow-y-auto divide-y divide-white/5">
                                    {notifications.length === 0 ? (
                                        <div className="p-6 text-sm text-gray-400 text-center italic flex flex-col items-center gap-2">
                                            <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                            </svg>
                                            No hay notificaciones recientes.
                                        </div>
                                    ) : (
                                        notifications.map((n, idx) => (
                                            <div 
                                                key={n.id} 
                                                className="p-3 flex justify-between items-start gap-2 hover:bg-white/5 transition-all duration-200 group cursor-pointer"
                                            >
                                                <div className="flex-grow">
                                                    <div className="font-semibold text-sm text-white group-hover:text-blue-300 transition-colors">
                                                        {n.titulo || 'Evento'}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">{n.descripcion}</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {new Date(n.fechaNotificacion).toLocaleString()}
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={(e) => removeNotification(n.id, e)} 
                                                    className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all shrink-0 cursor-pointer"
                                                    title="Eliminar notificación"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ))
                                    )}
                                </div>
                                
                                {notifications.length > 0 && (
                                    <div className="relative p-3 border-t border-white/10 text-right bg-white/5">
                                        <button 
                                            onClick={() => { setNotifications([]); setUnreadCount(0); }} 
                                            className="text-xs text-blue-400 hover:text-blue-300 font-semibold transition-colors cursor-pointer"
                                        >
                                            Limpiar Todo
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User info */}
                    <div className="flex items-center gap-2 sm:gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity glow-effect"></div>
                            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden border-2 border-white/20 shrink-0 group-hover:scale-110 transition-transform">
                                {user && user.profileImageFilename ? (
                                    <img
                                        src={`${API_FILES}/${user.profileImageFilename}`}
                                        alt="Foto de perfil"
                                        className="w-full h-full object-cover"
                                        onError={handleImageError}
                                    />
                                ) : (
                                    <IconAvatarPlaceholder />
                                )}
                            </div>
                        </div>

                        <span className="text-white text-sm hidden sm:block">
                            Bienvenido, <strong className="font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">{user?.username}</strong>
                        </span>

                        <button
                            onClick={handleLogout}
                            className="bg-gradient-to-br from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-xl flex items-center gap-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 focus:outline-none focus:ring-2 focus:ring-blue-400 group cursor-pointer"
                            title="Cerrar Sesión"
                        >
                            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span className="hidden sm:inline text-xs sm:text-sm font-semibold">Salir</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}