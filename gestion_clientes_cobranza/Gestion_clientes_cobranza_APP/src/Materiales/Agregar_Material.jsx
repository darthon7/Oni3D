import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion"; // <-- Importación añadida para las animaciones

// --- Iconos SVG ---
const IconBox = () => ( // Icono para "Material"
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2h-8zM9 4a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 01-1 1H10a1 1 0 01-1-1V4z" clipRule="evenodd" />
    <path d="M4 4a2 2 0 00-2 2v10a2 2 0 002 2h4v-2H4V6h4V4H4z" />
  </svg>
);

const IconDollar = () => ( // Icono para "Precio"
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.168.36V7.418zM11 6.074c.24.07.453.16.63.268v1.698a2.5 2.5 0 01-1.168-.36V6.074zM12.5 8.5A2.5 2.5 0 0110 11V3A2.5 2.5 0 0112.5 5.5v3zM10 4.5A1.5 1.5 0 008.5 6v.5h3V6A1.5 1.5 0 0010 4.5zM10 15a1.5 1.5 0 001.5-1.5v-.5h-3v.5A1.5 1.5 0 0010 15zM8.5 12A2.5 2.5 0 0111 9.5v5A2.5 2.5 0 018.5 17v-5z" />
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 1a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);

const IconHashtag = () => ( // Icono para "Cantidad"
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    {/* Icono de '#' simplificado para 'Cantidad' */}
    <path fillRule="evenodd" d="M7 2a1 1 0 00-1 1v1H5a1 1 0 000 2h1v11a1 1 0 102 0V6h1v11a1 1 0 102 0V6h1v11a1 1 0 102 0V6h1a1 1 0 100-2h-1V3a1 1 0 00-1-1H7z" clipRule="evenodd" />
  </svg>
);
// --- Fin Iconos SVG ---

export default function AgregarMaterial() {
  //Creación de Materiales
  const [material, setMateriales] = useState({
    nombreMaterial: "",
    precioMaterial: "",
    cantidadMaterial: "",
  });

  // --- NUEVO: Estado para errores de validación ---
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null); // Para errores del submit

  // Estado para la animación de entrada
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  //Desestructuración
  const { nombreMaterial, precioMaterial, cantidadMaterial } = material;

  // --- MODIFICADO: Manejo de inputs ---
  const onInputChange = (e) => {
    const { name, value } = e.target;
    setMateriales({ ...material, [name]: value });
    // Limpiar error del campo específico al escribir
    if (errors[name]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
    setApiError(null); // Limpiar error de API
  };

  const Navegacion = useNavigate();

  // --- NUEVO: Función de Validación ---
  const validateForm = () => {
    const newErrors = {};
    
    // Regla 1: No nulos (vacíos)
    if (!nombreMaterial || nombreMaterial.trim() === "") {
        newErrors.nombreMaterial = "El nombre no puede estar vacío.";
    }
    if (precioMaterial === null || precioMaterial === "") {
        newErrors.precioMaterial = "El precio no puede estar vacío.";
    }
    if (cantidadMaterial === null || cantidadMaterial === "") {
        newErrors.cantidadMaterial = "La cantidad no puede estar vacía.";
    }

    // Regla 2: Precio <= 50000
    const precioNum = parseFloat(precioMaterial);
    if (!isNaN(precioNum) && precioNum > 50000) {
        newErrors.precioMaterial = "El precio no puede ser mayor a $50,000.";
    }
     if (!isNaN(precioNum) && precioNum < 0) {
        newErrors.precioMaterial = "El precio no puede ser negativo.";
    }

    // Regla 3: Cantidad <= 100 y debe ser entero
    const cantidadNum = parseFloat(cantidadMaterial); // Usamos parseFloat para chequear decimales
     if (!isNaN(cantidadNum)) {
         if (!Number.isInteger(cantidadNum)) {
            newErrors.cantidadMaterial = "La cantidad debe ser un número entero (sin decimales).";
         } else if (cantidadNum > 100) {
            newErrors.cantidadMaterial = "La cantidad no puede ser mayor a 100.";
         } else if (cantidadNum < 0) {
             newErrors.cantidadMaterial = "La cantidad no puede ser negativa.";
         }
     } else if (cantidadMaterial !== "") { // Si no está vacío pero no es número
         newErrors.cantidadMaterial = "La cantidad debe ser un número.";
     }

    return newErrors;
  };

  // --- MODIFICADO: Función de envío a la API ---
  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError(null); // Limpiar error de API

    // 1. Validar
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return; // Detener envío si hay errores
    }
    
    // 2. Preparar Payload (ya validado)
    const payload = {
        nombreMaterial: nombreMaterial,
        precioMaterial: parseFloat(precioMaterial), // Convertir a número
        cantidadMaterial: parseInt(cantidadMaterial) // Convertir a entero
    };

    const urlBase = "http://localhost:8080/api/materiales";
    
    try {
        // 3. Enviar
        await axios.post(urlBase, payload);
        Navegacion("/lista_material");
    } catch (error) {
        console.error("Error al agregar material:", error);
        // 4. Mostrar error de API
        setApiError(error.response?.data?.message || "Error al conectar con el servidor. Revisa la consola.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div 
        className={`w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-700 ease-out
                    ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Agregar Material
        </h2>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* --- NUEVO: Mostrar Error de API --- */}
          {apiError && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200" role="alert">
                    {apiError}
                </div>
           )}

          {/* Campo Nombre Material */}
          <div>
            <label
              htmlFor="nombreMaterial"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre del Material
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                    <IconBox />
                </span>
                <input
                    type="text"
                    id="nombreMaterial"
                    name="nombreMaterial"
                    required // Regla 1: No nulo
                    value={nombreMaterial}
                    onChange={onInputChange}
                    // --- MODIFICADO: Estilo de borde dinámico ---
                    className={`w-full pl-12 pr-4 py-3 border bg-gray-50 rounded-xl shadow-sm text-gray-900 
                               transition duration-300 ease-in-out
                               focus:outline-none focus:ring-2 
                                ${errors.nombreMaterial 
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
                                }`}
                    placeholder="Filamento PLA, Resina, etc."
                />
            </div>
            {/* --- NUEVO: Mostrar error de campo --- */}
            {errors.nombreMaterial && (
                <p className="mt-1 text-xs text-red-600">{errors.nombreMaterial}</p>
            )}
          </div>

          {/* Campo Precio Material */}
          <div>
            <label
              htmlFor="precioMaterial"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Precio (Máx: 50,000)
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                    <IconDollar />
                </span>
                <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="50000" // Regla 2
                    id="precioMaterial"
                    name="precioMaterial"
                    required // Regla 1: No nulo
                    value={precioMaterial}
                    onChange={onInputChange}
                    className={`w-full pl-12 pr-4 py-3 border bg-gray-50 rounded-xl shadow-sm text-gray-900
                               transition duration-300 ease-in-out
                               focus:outline-none focus:ring-2 
                                ${errors.precioMaterial 
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
                                }`}
                    placeholder="0.00"
                />
            </div>
            {errors.precioMaterial && (
                <p className="mt-1 text-xs text-red-600">{errors.precioMaterial}</p>
            )}
          </div>

          {/* Campo Cantidad Material */}
          <div>
            <label
              htmlFor="cantidadMaterial"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cantidad (Stock) (Máx: 100)
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                    <IconHashtag />
                </span>
                <input
                    type="number"
                    step="1" // Solo enteros
                    min="0"
                    max="100" // Regla 3
                    id="cantidadMaterial"
                    name="cantidadMaterial"
                    required // Regla 1: No nulo
                    value={cantidadMaterial}
                    onChange={onInputChange}
                    className={`w-full pl-12 pr-4 py-3 border bg-gray-50 rounded-xl shadow-sm text-gray-900
                               transition duration-300 ease-in-out
                               focus:outline-none focus:ring-2 
                                ${errors.cantidadMaterial 
                                    ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                                    : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'
                                }`}
                    placeholder="0"
                />
            </div>
            {errors.cantidadMaterial && (
                <p className="mt-1 text-xs text-red-600">{errors.cantidadMaterial}</p>
            )}
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4 pt-6">
            <Link
              to="/lista_material" 
s               className="px-6 py-3 bg-white text-gray-700 font-bold rounded-xl shadow-md
                         border border-gray-300
                         transition-all duration-300 ease-in-out 
                         hover:bg-gray-100 hover:shadow-lg cursor-pointer"
           >
              Regresar
            </Link>
            <button
              type="submit"
button               className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md
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

