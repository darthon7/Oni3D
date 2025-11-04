import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

// --- Iconos SVG ---
const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const IconMail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

// Nuevo Icono de Teléfono
const IconPhone = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
    </svg>
);
// --- Fin Iconos SVG ---

export default function Agregar_Empleado() {
    const [empleado, setEmpleados] = useState({
        nombre: "",
        departamento: "", // Usado para Correo
        sueldo: "",       // Usado para Número de Teléfono
    });
    
    // Estado para la animación de entrada
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        // Pequeño retraso para permitir que el CSS se aplique antes de animar
        const timer = setTimeout(() => setIsMounted(true), 50);
        return () => clearTimeout(timer); // Limpieza al desmontar
    }, []);

    const { nombre, departamento, sueldo } = empleado;

    const onInputChange = (e) => {
        setEmpleados({ ...empleado, [e.target.name]: e.target.value });
    };

    let Navegacion = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        // NOTA: La API sigue esperando 'departamento' y 'sueldo'.
        // Asegúrate de que tu backend maneje el campo 'sueldo' como String o ajústalo si es necesario.
        const payload = {
            nombre: nombre,
            departamento: departamento, // Correo va aquí
            sueldo: sueldo            // Teléfono va aquí (como String)
        };
        
        const urlBase = "http://localhost:8080/api/empleados";
        
        try {
            await axios.post(urlBase, payload);
            Navegacion("/listado"); // Redirige a la lista de empleados/clientes
        } catch (error) {
            console.error("Error al agregar empleado:", error);
            // Aquí podrías mostrar un mensaje de error al usuario
            // Evita usar alert() en aplicaciones React modernas si es posible.
            // Considera un estado para mostrar un mensaje de error en la UI.
            console.error("Error al agregar cliente. Revisa la consola.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
            {/* Contenedor del formulario con animación de entrada */}
            <div 
                className={`w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-700 ease-out
                        ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                {/* Título */}
                <h3 className="text-3xl font-bold text-center text-indigo-600 mb-8">
                    Registrar Nuevo Cliente
                </h3>

                {/* Formulario */}
                <form onSubmit={onSubmit} className="space-y-6">
                    
                    {/* Campo Nombre */}
                    <div>
                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                            Nombre
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                <IconUser />
                            </span>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={nombre}
                                onChange={onInputChange}
                                required
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-xl shadow-sm text-gray-900 
                                            transition duration-300 ease-in-out
                                            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Nombre completo del cliente"
                            />
                        </div>
                    </div>

                    {/* Campo Correo (departamento) */}
                    <div>
                        <label htmlFor="departamento" className="block text-sm font-medium text-gray-700 mb-2">
                            Correo
                        </label>
                        <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                    <IconMail />
                                </span>
                                <input
                                    type="email" // Mantenido como 'email'
                                    id="departamento"
                                    name="departamento"
                                    value={departamento}
                                    onChange={onInputChange}
                                    required // <-- AÑADIDO
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-xl shadow-sm text-gray-900
                                                transition duration-300 ease-in-out
                                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="ejemplo@correo.com"
                                />
                        </div>
                    </div>

                    {/* --- Campo Número de Teléfono (sueldo) --- */}
                    <div>
                        <label htmlFor="sueldo" className="block text-sm font-medium text-gray-700 mb-2">
                            Número de Teléfono 
                        </label>
                        <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                    <IconPhone /> {/* <-- Icono cambiado */}
                                </span>
                                <input
                                    type="tel" // <-- Tipo cambiado a 'tel'
                                    id="sueldo"
                                    name="sueldo" // Mantenemos el name para la lógica actual
                                    value={sueldo} // Mantenemos el value
                                    onChange={onInputChange} // Mantenemos el onChange
                                    required // <-- AÑADIDO
                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 bg-gray-50 rounded-xl shadow-sm text-gray-900
                                                transition duration-300 ease-in-out
                                                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="Ej: 871-123-4567" // <-- Placeholder cambiado
                                />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end gap-4 pt-6">
                        <Link
                            to="/listado"
                            className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl shadow-md
                                        border border-gray-300
                                        transition-all duration-300 ease-in-out 
                                        hover:bg-gray-100 hover:shadow-lg cursor-pointer"
                        >
                            Regresar
                        </Link>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md
                                        transition-all duration-300 ease-in-out 
                                        hover:bg-indigo-700 hover:shadow-lg hover:scale-105 cursor-pointer"
                        >
                            Agregar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
