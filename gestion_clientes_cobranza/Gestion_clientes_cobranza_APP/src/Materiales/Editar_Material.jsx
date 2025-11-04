import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion } from "framer-motion"; // Importar motion

// --- Iconos SVG (Replicados de AgregarMaterial) ---
const IconBox = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2h-8zM9 4a1 1 0 011-1h6a1 1 0 011 1v12a1 1 0 01-1 1H10a1 1 0 01-1-1V4z" clipRule="evenodd" />
    <path d="M4 4a2 2 0 00-2 2v10a2 2 0 002 2h4v-2H4V6h4V4H4z" />
  </svg>
);

const IconDollar = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.5 2.5 0 00-1.168.36V7.418zM11 6.074c.24.07.453.16.63.268v1.698a2.5 2.5 0 01-1.168-.36V6.074zM12.5 8.5A2.5 2.5 0 0110 11V3A2.5 2.5 0 0112.5 5.5v3zM10 4.5A1.5 1.5 0 008.5 6v.5h3V6A1.5 1.5 0 0010 4.5zM10 15a1.5 1.5 0 001.5-1.5v-.5h-3v.5A1.5 1.5 0 0010 15zM8.5 12A2.5 2.5 0 0111 9.5v5A2.5 2.5 0 018.5 17v-5z" />
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 1a9 9 0 100-18 9 9 0 000 18z" />
  </svg>
);

const IconHashtag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M7 2a1 1 0 00-1 1v1H5a1 1 0 000 2h1v11a1 1 0 102 0V6h1v11a1 1 0 102 0V6h1v11a1 1 0 102 0V6h1a1 1 0 100-2h-1V3a1 1 0 00-1-1H7z" clipRule="evenodd" />
  </svg>
);
// --- Fin Iconos SVG ---

export default function EditarMaterial() {
  const urlBase = "http://localhost:8080/api/materiales";
  const params = useParams();
  const idToUse = params.id || params.idMaterial; // Soporta ambas rutas

  const [material, setMaterial] = useState({
    nombreMaterial: "",
    precioMaterial: "",
    cantidadMaterial: "",
  });
  const [loading, setLoading] = useState(false); // para peticiones submit
  const [loadingInitial, setLoadingInitial] = useState(true); // carga inicial
  const [apiError, setApiError] = useState(null); // errores de API
  const [errors, setErrors] = useState({}); // Errores de validación

  // Estado para la animación
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);


  const { nombreMaterial, precioMaterial, cantidadMaterial } = material;
  const navigate = useNavigate();

  // Cargar datos del material
  useEffect(() => {
    if (!idToUse) {
      setApiError("No se recibió el id del material en la URL.");
      setLoadingInitial(false);
      return;
    }
    const cargarMaterial = async () => {
      setLoadingInitial(true);
      setApiError(null);
      try {
        const res = await axios.get(`${urlBase}/${idToUse}`);
        if (res && res.data) {
          setMaterial({ // Rellenar estado con datos existentes
            nombreMaterial: res.data.nombreMaterial ?? "",
            precioMaterial: res.data.precioMaterial ?? "",
            cantidadMaterial: res.data.cantidadMaterial ?? "",
          });
        } else {
          setApiError("Respuesta inesperada del servidor.");
        }
      } catch (err) {
        console.error("Error fetching material:", err);
        setApiError(err.response?.status === 404 ? "Material no encontrado." : "Error al cargar el material.");
      } finally {
        setLoadingInitial(false);
      }
    };
    cargarMaterial();
  }, [idToUse, urlBase]); // Dependencias

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setMaterial((prev) => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
        setErrors(prevErrors => ({ ...prevErrors, [name]: null }));
    }
    setApiError(null);
  };

  // --- Función de Validación (de AgregarMaterial) ---
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
        newErrors.cantidadMaterial = "La cantidad no puede estar vacío.";
    }

    // Regla 2: Precio <= 50000
    const precioNum = parseFloat(precioMaterial);
    if (!isNaN(precioNum)) {
        if (precioNum > 50000) {
            newErrors.precioMaterial = "El precio no puede ser mayor a $50,000.";
        }
        if (precioNum < 0) {
            newErrors.precioMaterial = "El precio no puede ser negativo.";
        }
    } else if (precioMaterial !== "") {
         newErrors.precioMaterial = "El precio debe ser un número.";
    }

    // Regla 3: Cantidad <= 100 y debe ser entero
    const cantidadNum = parseFloat(cantidadMaterial); 
     if (!isNaN(cantidadNum)) {
         if (!Number.isInteger(cantidadNum)) {
            newErrors.cantidadMaterial = "La cantidad debe ser un número entero.";
         } else if (cantidadNum > 100) {
            newErrors.cantidadMaterial = "La cantidad no puede ser mayor a 100.";
         } else if (cantidadNum < 0) {
             newErrors.cantidadMaterial = "La cantidad no puede ser negativa.";
         }
     } else if (cantidadMaterial !== "") {
         newErrors.cantidadMaterial = "La cantidad debe ser un número.";
     }

    return newErrors;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    // 1. Validar
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return; 
    }

    setLoading(true);

    try {
      // 2. Preparar Payload (ya validado)
      const payload = {
        ...material, // Enviar todos los campos (nombreMaterial)
        precioMaterial: parseFloat(material.precioMaterial),
        cantidadMaterial: parseInt(material.cantidadMaterial),
      };

      // 3. Enviar (PUT)
      await axios.put(`${urlBase}/${idToUse}`, payload);
      navigate("/lista_material");

    } catch (err) {
      console.error("Error update material:", err);
      setApiError(err.response?.data?.message || "Error al guardar. Revisa la consola.");
    } finally {
      setLoading(false);
    }
  };

  // Eliminar (no solicitado, pero mantenido de tu lógica original)
  const eliminarMaterial = async () => { /* ... (tu lógica de eliminar) ... */ };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-blue-50 p-4">
      <motion.div // Usar motion.div para la animación
        className={`w-full max-w-lg bg-white rounded-xl shadow-2xl p-8 transform transition-all duration-700 ease-out
                    ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        initial={{ opacity: 0, y: 10 }} // Estado inicial de framer-motion
        animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 10 }} // Animar a
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">
          Editar Material (ID: {idToUse})
        </h2>

        {/* Mostrar spinner de carga inicial */}
        {loadingInitial ? (
          <p className="text-center text-gray-500">Cargando material...</p>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Error de API */}
            {apiError && (
                <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200" role="alert">
                    {apiError}
                </div>
            )}

            {/* Campo Nombre Material */}
            <div>
              <label htmlFor="nombreMaterial" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Material
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"><IconBox /></span>
                <input
                    type="text" id="nombreMaterial" name="nombreMaterial"
                    required value={nombreMaterial} onChange={onInputChange}
                    className={`w-full pl-12 pr-4 py-3 border bg-gray-50 rounded-xl shadow-sm text-gray-900 
                               transition duration-300 ease-in-out
                               focus:outline-none focus:ring-2 
                                ${errors.nombreMaterial ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="Filamento PLA, Resina, etc."
                />
              </div>
              {errors.nombreMaterial && <p className="mt-1 text-xs text-red-600">{errors.nombreMaterial}</p>}
            </div>

            {/* Campo Precio Material */}
            <div>
              <label htmlFor="precioMaterial" className="block text-sm font-medium text-gray-700 mb-2">
                Precio (Máx: 50,000)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"><IconDollar /></span>
                <input
                    type="number" step="0.01" min="0" max="50000"
                    id="precioMaterial" name="precioMaterial"
                    required value={precioMaterial} onChange={onInputChange}
                    className={`w-full pl-12 pr-4 py-3 border bg-gray-50 rounded-xl shadow-sm text-gray-900
                               transition duration-300 ease-in-out
                g              focus:outline-none focus:ring-2 
                                ${errors.precioMaterial ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="0.00"
                />
              </div>
              {errors.precioMaterial && <p className="mt-1 text-xs text-red-600">{errors.precioMaterial}</p>}
            </div>

            {/* Campo Cantidad Material */}
            <div>
              <label htmlFor="cantidadMaterial" className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad (Stock) (Máx: 100)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none"><IconHashtag /></span>
                <input
                    type="number" step="1" min="0" max="100"
                    id="cantidadMaterial" name="cantidadMaterial"
                    required value={cantidadMaterial} onChange={onInputChange}
                    className={`w-full pl-12 pr-4 py-3 border bg-gray-50 rounded-xl shadow-sm text-gray-900
                               transition duration-300 ease-in-out
                               focus:outline-none focus:ring-2 
                                ${errors.cantidadMaterial ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500 focus:border-indigo-500'}`}
                    placeholder="0"
                />
              </div>
              {errors.cantidadMaterial && <p className="mt-1 text-xs text-red-600">{errors.cantidadMaterial}</p>}
            </div>

            {/* Botones */}
            <div className="flex justify-between items-center gap-4 pt-6"> {/* Alineación separada */}
              {/* Botones Guardar y Regresar */}
              <div className="flex gap-4">
                <motion.button // Aplicar motion
                  type="submit"
                  disabled={loading}
                    whileHover={{ scale: 1.05 }} // Animación de AgregarMaterial
                    whileTap={{ scale: 0.95 }}
                  className={`px-6 py-3 font-bold rounded-xl shadow-md
                               transition-all duration-300 ease-in-out 
                               cursor-pointer ${
                    loading
                      ? "bg-indigo-300 text-white cursor-not-allowed"
                      : "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:scale-105"
                  }`}
                >
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </motion.button>
                <Link
                  to="/lista_material"
                  className={`px-6 py-3 bg-white text-gray-700 font-bold rounded-xl shadow-md
                               border border-gray-300
                               transition-all duration-300 ease-in-out 
                               hover:bg-gray-100 hover:shadow-lg cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={(e) => loading && e.preventDefault()} // Prevenir navegación si está cargando
                >
                  Regresar
                </Link>
              </div>
              {/* Botón Eliminar (mantenido de tu lógica original) */}
              <motion.button
                type="button"
                onClick={eliminarMaterial}
                disabled={loading}
                whileHover={{ scale: 1.05 }} // Animación de AgregarMaterial
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl shadow-mds transition-all duration-300 ease-in-outs hover:bg-red-700 hover:shadow-lg hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? "Procesando..." : "Eliminar"}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
