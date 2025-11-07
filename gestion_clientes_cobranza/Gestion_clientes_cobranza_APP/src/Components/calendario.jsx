import React, { useState, useEffect, useCallback } from 'react'; // <--- Añadido useCallback
import axios from 'axios';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Link } from 'react-router-dom'; // <--- AÑADIDO

// --- Iconos SVG ---
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
// --- Fin Iconos ---

// Configuración del Localizador (sin cambios)
const locales = { 'es': es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Mensajes del Calendario (sin cambios)
const messages = {
  allDay: 'Todo el día',
  previous: 'Anterior',
  next: 'Siguiente ',
  today: 'Hoy',
  month: 'Mes',
  week: 'Semana',
  day: 'Día',
  agenda: 'Agenda',
  date: 'Fecha',
  time: 'Hora',
  event: 'Evento',
  noEventsInRange: 'No hay eventos en este rango.',
  showMore: total => `+ Ver más (${total})`
};

export default function CalendarioEntregas() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
    const EVENT_API = `${API_BASE}/api/eventos`;

    // --- Cargar Eventos (con useCallback) ---
    const fetchEventos = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await axios.get(EVENT_API);
            
            const formattedEvents = res.data.map(evento => {
                const startDate = new Date(evento.fechaNotificacion);
                
                return {
                    id: evento.idEvento || evento.id,
                    title: `(Cliente ID: ${evento.usuarioId}) - Producto ID: ${evento.productoId} (x${evento.cantidad})`,
                    start: startDate,
                    end: startDate, 
                    resource: evento, // Guardar el objeto original
                };
            });
            
            setEvents(formattedEvents);
        } catch (err) {
            console.error("Error cargando eventos:", err);
            setError("No se pudieron cargar los eventos del calendario.");
        } finally {
            setLoading(false);
        }
    }, [EVENT_API]); // Depende solo de la URL base de la API

    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]); // Cargar al montar

    const handleSelectEvent = (event) => {
        setSelectedEvent(event);
    };

    const closeModal = () => {
        setSelectedEvent(null);
    };

    const handleNavigate = (newDate) => {
        setCurrentDate(newDate);
    };

    // --- NUEVA FUNCIÓN PARA ELIMINAR ---
    const handleDeleteEvent = async (e, id) => {
        e.stopPropagation(); // Evitar que el clic cierre el modal
        if (!id) return;
        
        // Usar confirm() simple como en tus otros componentes
        if (window.confirm("¿Estás seguro de que quieres eliminar esta alerta? Esta acción no se puede deshacer.")) {
            try {
                await axios.delete(`${EVENT_API}/${id}`);
                setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
                closeModal(); 
            } catch (err) {
                console.error("Error al eliminar evento:", err);
                alert("No se pudo eliminar la alerta. Revisa la consola o intenta de nuevo.");
            }
        }
    };
    // --- Fin Nueva Función ---

    // --- Estados de Carga y Error (Sin cambios) ---
    if (loading) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
              <p className="text-xl text-white font-semibold">Cargando calendario...</p>
            </div>
          </div>
        );
    }

    if (error) {
         return (
           <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center p-6">
             <div className="bg-red-500/20 border border-red-500 rounded-2xl p-8 max-w-md backdrop-blur-sm">
               <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <p className="text-xl text-white text-center font-semibold">{error}</p>
             </div>
           </div>
         );
    }
    
    // --- Renderizado ---
    return (
        <>
            {/* Estilos (sin cambios) */}
            <style>{`
                @keyframes fadeIn {
                  from { opacity: 0; transform: translateY(20px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideIn {
                  from { opacity: 0; transform: scale(0.95); }
                  to { opacity: 1; transform: scale(1); }
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
                
                /* Estilos personalizados para el calendario */
                .rbc-calendar {
                  font-family: inherit;
                }
                
                .rbc-header {
                  padding: 12px 8px;
                  font-weight: 700;
                  font-size: 14px;
                  color: #1f2937;
                  background: linear-gradient(135deg, #e0f2fe, #ddd6fe);
                  border-bottom: 2px solid #3b82f6 !important;
                }
                
                .rbc-month-view {
                  border: none;
                  border-radius: 12px;
                  overflow: hidden;
                }
                
                .rbc-day-bg {
                  background: white;
                  border-color: #e5e7eb !important;
                }
                
                .rbc-today {
                  background: linear-gradient(135deg, #dbeafe, #e0e7ff) !important;
                }
                
                .rbc-off-range-bg {
                  background: #f9fafb;
                }
                
                .rbc-event {
                  background: linear-gradient(135deg, #3b82f6, #8b5cf6) !important;
                  border: none !important;
                  border-radius: 8px !important;
                  padding: 4px 8px !important;
                  font-size: 12px;
                  font-weight: 600;
                  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
                  transition: all 0.3s ease;
                }
                
                .rbc-event:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.5);
                }
                
                .rbc-toolbar {
                  padding: 20px;
                  margin-bottom: 20px;
                  background: linear-gradient(135deg, #1e293b, #334155);
                  border-radius: 12px;
                  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                }
                
                .rbc-toolbar button {
                  color: white;
                  border: 2px solid rgba(255, 255, 255, 0.2);
                  padding: 8px 16px;
                  border-radius: 8px;
                  font-weight: 600;
                  transition: all 0.3s ease;
                  background: rgba(255, 255, 255, 0.1);
                  cursor: pointer; /* Añadido cursor pointer */
                }
                
                .rbc-toolbar button:hover {
                  background: rgba(255, 255, 255, 0.2);
                  border-color: rgba(255, 255, 255, 0.4);
                  transform: translateY(-2px);
                }
                
                .rbc-toolbar button.rbc-active {
                  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                  border-color: transparent;
                }
                
                .rbc-toolbar-label {
                  color: white;
                  font-weight: 700;
                  font-size: 20px;
                  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                }
                
                .rbc-date-cell {
                  padding: 8px;
                  font-weight: 600;
                  color: #374151;
                }
                
                .rbc-current {
                  color: #3b82f6 !important;
                }
                
                .rbc-show-more {
                  background: linear-gradient(135deg, #8b5cf6, #ec4899);
                  color: white;
                  font-weight: 600;
                  border-radius: 6px;
                  padding: 2px 8px;
                  margin: 2px;
                  cursor: pointer; /* Añadido cursor pointer */
                }
            `}</style>

            <div className="min-h-screen ">
                <div className="max-w-7xl mx-auto">
                    {/* Header (sin cambios) */}
                    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl overflow-hidden mb-8 animate-fade-in">
                        <div className="relative p-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                            <div className="relative flex items-center gap-4">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h1 className="text-3xl sm:text-4xl font-bold drop-shadow-lg mb-2">
                                        Calendario de Entregas y Alertas
                                    </h1>
                                    <p className="text-blue-100 text-base sm:text-lg font-medium">
                                        📦 Visualiza todas las alertas de salida de inventario registradas
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Contenedor del Calendario (sin cambios) */}
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-2xl animate-fade-in" style={{ height: '75vh' }}>
                        <Calendar
                            localizer={localizer}
                            events={events}
                            startAccessor="start"
                            endAccessor="end"
                            style={{ height: '100%' }}
                            culture='es'
                            messages={messages}
                            popup
                            onSelectEvent={handleSelectEvent}
                            views={['month']} 
                            defaultView='month'
                            toolbar={true}
                            date={currentDate}
                            onNavigate={handleNavigate}
                            eventPropGetter={(event) => ({
                                className: 'cursor-pointer hover:bg-indigo-700',
                                style: {
                                    backgroundColor: '#4f46e5',
                                    borderRadius: '8px',
                                    opacity: 0.9,
                                    color: 'white',
                                    border: 'none',
                                },
                            })}
                        />
                    </div>

                    {/* --- Modal de Detalles (MODIFICADO) --- */}
                    {selectedEvent && (
                        <div 
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md animate-fade-in"
                            onClick={closeModal}
                        >
                            <div 
                                className="bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl m-4 overflow-hidden border border-white/10 animate-slide-in"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Header del modal (sin cambios) */}
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white drop-shadow-lg">Detalle de la Alerta</h3>
                                        </div>
                                        <button 
                                            onClick={closeModal} 
                                            className="text-white hover:bg-white/20 p-2 rounded-xl transition-all"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Contenido del modal (sin cambios) */}
                                <div className="p-6 space-y-6">
                                    {/* ... (Descripción) ... */}
                                    <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl p-5 border border-blue-500/20">
                                         <div className="flex items-start gap-3">
                                             <svg className="w-6 h-6 text-blue-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                             <div className="flex-1">
                                                 <h4 className="text-sm font-semibold text-gray-400 mb-1">Descripción de Alerta</h4>
                                                 <p className="text-lg text-white font-medium">{selectedEvent.resource?.descripcion || "Salida de producto"}</p>
                                             </div>
                                         </div>
                                     </div>
                                     {/* ... (Grid de info) ... */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg><h4 className="text-sm font-semibold text-gray-400">Fecha y Hora</h4></div>
                                            <p className="text-lg text-white font-medium">{format(selectedEvent.start, 'Pp', { locale: es })}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg><h4 className="text-sm font-semibold text-gray-400">Cliente (ID)</h4></div>
                                            <p className="text-lg text-white font-medium">{selectedEvent.resource?.usuarioId}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg><h4 className="text-sm font-semibold text-gray-400">Producto (ID)</h4></div>
                                            <p className="text-lg text-white font-medium">{selectedEvent.resource?.productoId}</p>
                                        </div>
                                        <div className="bg-gray-800/50 rounded-xl p-4 border border-white/5">
                                            <div className="flex items-center gap-2 mb-2"><svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg><h4 className="text-sm font-semibold text-gray-400">Cantidad</h4></div>
                                            <p className="text-lg text-white font-medium">{selectedEvent.resource?.cantidad} unidades</p>
                                        </div>
                                    </div>

                                    {/* --- SECCIÓN DE BOTONES MODIFICADA --- */}
                                    <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-white/10 gap-3">
                                        {/* Botones Borrar y Editar (Izquierda) */}
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/Editar_Alerta/${selectedEvent.id}`} // <-- Debes crear esta ruta en App.jsx
                                                onClick={(e) => e.stopPropagation()} // Evita que el Link cierre el modal
                                                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:bg-yellow-600 transition-all duration-200 transform hover:scale-105"
                                            >
                                                <IconPencil />
                                                Editar
                                            </Link>
                                            <button
                                                onClick={(e) => handleDeleteEvent(e, selectedEvent.id)}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 cursor-pointer"
                                            >
                                                <IconTrash />
                                                Borrar
                                            </button>
                                            
                                        </div>
                                        {/* Botón Cerrar (Derecha) - Se usa el botón 'X' del header, pero mantenemos este por si acaso */}
                                        <button
                                            onClick={closeModal}
                                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 w-full sm:w-auto"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                                            Cerrar
                                        </button>
                                    </div>
                                    {/* --- Fin Sección Botones --- */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

