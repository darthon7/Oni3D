import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion"; // Asegúrate de tener framer-motion instalado

// --- Iconos SVG (sin cambios) ---
const IconTag = () => ( 
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);
const IconPaintBrush = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);
const IconNotes = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm2 1h1v1H6V5zm0 2h1v1H6V7zm0 2h1v1H6V9zm0 2h1v1H6v-1zm2-6h5v1H8V5zm0 2h5v1H8V7zm0 2h5v1H8V9zm0 2h5v1H8v-1z" clipRule="evenodd" />
    </svg>
);
// --- Fin Iconos SVG ---


export default function Agregar_Pintura() {
    const [pintura, setPintura] = useState({
        marca: "",
        color: "#ffffff", 
        descripcion: "",
    });
    const [useColorPicker, setUseColorPicker] = useState(true); 

    const { marca, color, descripcion } = pintura;

    const onInputChange = (e) => {
        setPintura({ ...pintura, [e.target.name]: e.target.value });
    };

    const onColorPickerChange = (e) => {
         setPintura({ ...pintura, color: e.target.value });
    };

    let Navegacion = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();

        // --- FILTRO/VALIDACIÓN AÑADIDO ---
        // Verificamos que los campos no estén vacíos o solo contengan espacios
        if (!pintura.marca.trim() || !pintura.color.trim() || !pintura.descripcion.trim()) {
            alert("Todos los campos son obligatorios. Por favor, rellene la información.");
            return; // Detiene el envío del formulario si la validación falla
        }
        // --- FIN DEL FILTRO ---

        const urlBase = "http://localhost:8080/api/pinturas";
        try {
            const finalColor = pintura.color.startsWith('#') ? pintura.color : `#${pintura.color}`;
            await axios.post(urlBase, {...pintura, color: finalColor});
            Navegacion("/Listado_Pinturas"); 
        } catch (error) {
            console.error("Error al agregar la pintura:", error);
            alert("Error al guardar la pintura. Revise la consola."); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center overflow-hidden">
            <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-8"
            >
                <h3 className="text-3xl font-bold text-center text-white mb-8">
                    Agregar Nueva Pintura
                </h3>

                <form onSubmit={onSubmit} className="space-y-6">
                    
                    {/* Campo Marca */}
                    <div className="relative">
                        <label
                            htmlFor="marca"
                            className="block text-sm font-medium text-indigo-200 mb-1"
                        >
                            Marca
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-300 pointer-events-none">
                                <IconTag />
                            </span>
                            <input
                                type="text"
                                id="marca"
                  _8080             name="marca"
                                value={marca}
                                onChange={onInputChange}
                                required // Validación HTML
                                placeholder="Ej: Politec, ModelColor..."
                                className="w-full pl-10 pr-4 py-3 border border-indigo-400/50 bg-indigo-900/50 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Campo Color Modificado */}
                    <div className="relative">
                         <div className="flex justify-between items-center mb-1">
                             <label
                                htmlFor="color"
                                className="block text-sm font-medium text-indigo-200"
                            >
                                Color
                            </label>
                             <div className="flex items-center">
                                <input 
                                    id="usePicker"
                                    type="checkbox" 
                                    checked={useColorPicker}
                                    onChange={(e) => setUseColorPicker(e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 border-indigo-300 rounded focus:ring-indigo-500 cursor-pointer"/>
                                <label htmlFor="usePicker" className="ml-2 block text-sm text-indigo-200 cursor-pointer">
                                     Usar selector de color
                               </label>
                        </div>
                         </div>

                         <div className="relative flex items-center gap-3">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-300 pointer-events-none">
                                <IconPaintBrush />
                            </span>
                            <input
                                type="text"
                                id="color"
                                name="color"
                                value={color}
                                onChange={onInputChange} 
                                required // Validación HTML
                                placeholder="Ej: #FF0000"
                                className={`w-full pl-10 pr-4 py-3 border border-indigo-400/50 bg-indigo-900/50 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all ${useColorPicker ? 'pr-12' : ''}`}
                            />
                            {useColorPicker && (
                                <input 
                                    type="color"
                                    value={color} 
                                    onChange={onColorPickerChange} 
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-10 cursor-pointer border-none bg-transparent rounded p-0 appearance-none focus:outline-none focus:ring-0"
                                    style={{ padding: 0 }} 
                                    aria-label="Seleccionar color"source/>
                            )}</div>
                    </div>
                    {/* --- Fin Campo Color Modificado --- */}


                    {/* Campo Descripción */}
                    <div className="relative">
                        <label
                            htmlFor="descripcion"
                            className="block text-sm font-medium text-indigo-200 mb-1"
                        >
                            Descripción
text
                        </label>
                        <div className="relative">
                            <span className="absolute top-3 left-0 flex items-center pl-3 text-indigo-300 pointer-events-none"> 
                                <IconNotes />
                            </span>
                            <textarea Show complete text
                                id="descripcion"
                                name="descripcion"
                                value={descripcion}
                                onChange={onInputChange}
                                required // --- VALIDACIÓN HTML AÑADIDA ---
                                placeholder="Ej: Pintura acrílica 30 ml..."
                                rows="3"
                                className="w-full pl-10 pr-4 py-3 border border-indigo-400/50 bg-indigo-900/50 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all resize-none"
                            />
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                        <motion.button _8080               whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-200 transform cursor-pointer"
                        >
                            Agregar Pintura
                        </motion.button>
                        <Link
                            to="/Listado_Pinturas" 
                             className="w-full sm:w-auto text-center px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105 cursor-pointer"
                        >
                             Regresar
                        </Link>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}