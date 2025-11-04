import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

// --- Iconos SVG ---
const IconCube = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);
const IconTag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
         <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a1 1 0 011-1h5a.997.997 0 01.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
     </svg>
);
const IconCash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h12v4a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 6a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2v-4a2 2 0 00-2-2H4zm10-4a1 1 0 100-2 1 1 0 000 2zm-8 6a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
    </svg>
);
const IconArchive = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
      <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
    </svg>
);
const IconClipboardList = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
       <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
    </svg>
);
const IconPhotograph = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
);
// --- Fin Iconos SVG ---


export default function Editar_Producto() {
    const API_PRODUCTOS = import.meta.env.VITE_API_BASE_PRODUCTOS || 'http://localhost:8080/api/productos';
    const API_FILES = import.meta.env.VITE_API_BASE_FILES || 'http://localhost:8080/api/files'; // Endpoint genérico
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado del formulario, incluyendo imageFilename
    const [producto, setProducto] = useState({
        precio: '',
        stock: '',
        descripcion: '',
        imageFilename: null
    });
    const [categoriaActual, setCategoriaActual] = useState('');
    const [loading, setLoading] = useState(true); // Carga inicial de datos
    const [error, setError] = useState(null);

    // Estado para la imagen seleccionada y subida
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // URL para vista previa
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Estado general de envío del formulario
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estado para animación de entrada
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // Categorías (igual que en Listado)
    const [categorias, setCategorias] = useState(() => {
        try {
            const raw = localStorage.getItem('oni3d_categorias');
            const parsed = raw ? JSON.parse(raw) : ['Impresoras', 'Accesorios', 'Filamento'];
            return parsed.filter(c => c !== 'All'); // No incluir 'All' aquí
        } catch (e) {
            return ['Impresoras', 'Accesorios', 'Filamento'];
        }
     });
     // Mapeo local (para leer la categoría actual)
    const CATS_KEY = 'oni3d_product_categories';
    const [categoriaMap, setCategoriaMap] = useState(() => {
        try {
            const raw = localStorage.getItem(CATS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
     });

    // Cargar datos del producto al montar (incluyendo imageFilename)
    useEffect(() => {
        const cargarProducto = async () => {
            setLoading(true); setError(null);
            try {
                const res = await axios.get(`${API_PRODUCTOS}/${id}`);
                setProducto({
                    precio: res.data.precio ?? '',
                    stock: res.data.stock ?? '',
                    descripcion: res.data.descripcion ?? '',
                    imageFilename: res.data.imageFilename ?? null
                });

                // Leer categoría del mapa local
                const currentCategory = categoriaMap[String(id)] || (categorias.length > 0 ? categorias[0] : '');
                setCategoriaActual(currentCategory);

                // Establecer vista previa si hay imagen existente
                if (res.data.imageFilename) {
                    // Validar si la URL es completa o solo filename
                    if (res.data.imageFilename.startsWith('http')) {
                         setImagePreviewUrl(res.data.imageFilename); // Asumir URL completa si empieza con http
                    } else {
                         setImagePreviewUrl(`${API_FILES}/${res.data.imageFilename}`); // Construir URL
                    }
                } else {
                    setImagePreviewUrl(null); // Asegurar que no haya vista previa si no hay imagen
                }

            } catch (err) {
                console.error("Error al cargar producto:", err);
                if (err.response && err.response.status === 404) {
                     setError(`Producto con ID ${id} no encontrado.`);
                } else {
                     setError("No se pudo cargar la información del producto.");
                }
                // Considerar no redirigir automáticamente para que el usuario vea el error
                // setTimeout(() => navigate('/listado_productos'), 3000); 
            } finally { setLoading(false); }
        };
        
        // Cargar solo cuando tengamos el ID y las categorías (para el default)
        if (id && categorias.length > 0) {
           cargarProducto();
        } else if (!id) {
            setError("ID de producto no encontrado en la URL.");
            setLoading(false);
        }
        
    // Quitar 'categorias' de las dependencias si causa recargas no deseadas al editar mapa
    }, [id, API_PRODUCTOS, API_FILES, categoriaMap]); 


    // --- Lógica de Manejo de Inputs y Archivos ---
    const onInputChange = (e) => {
        setError(null); 
        setProducto({ ...producto, [e.target.name]: e.target.value });
    };

    const onCategoryChange = (e) => {
        setError(null);
        setCategoriaActual(e.target.value);
    }

    const handleFileChange = (event) => {
        setError(null); setUploadError(null);
        setImagePreviewUrl(null); 

        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            setImagePreviewUrl(URL.createObjectURL(file)); 
        } else {
            setSelectedFile(null);
             if(producto.imageFilename) setImagePreviewUrl(`${API_FILES}/${producto.imageFilename}`);
             if(file) alert("Por favor, selecciona un archivo de imagen válido.");
        }
    };

    const handleImageUpload = async () => {
        if (!selectedFile) {
            return producto.imageFilename; 
        }

        setIsUploading(true); setUploadError(null);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post(`${API_FILES}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setIsUploading(false);
            return response.data.filename; 
        } catch (error) {
            console.error("Error al subir la imagen:", error.response?.data || error.message);
            setUploadError(`Error al subir imagen: ${error.response?.data?.error || error.message}`);
            setIsUploading(false);
            return null; // Indica fallo
        }
    };


    // --- onSubmit Modificado ---
    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        // Validaciones
        if (producto.precio === '' || isNaN(Number(producto.precio)) || Number(producto.precio) < 0) return setError('Introduce un precio válido (>= 0)');
        if (producto.stock === '' || isNaN(Number(producto.stock)) || Number(producto.stock) < 0) return setError('Introduce un stock válido (>= 0)');
        if (!categoriaActual) return setError('Debes seleccionar una categoría.');
        
        setIsSubmitting(true);

        let finalImageFilename = producto.imageFilename; // Empezar con el filename actual

        // Si se seleccionó un NUEVO archivo, intentar subirlo
        if (selectedFile) {
            const uploadedFilename = await handleImageUpload();
            if (uploadedFilename === null) {
                 setIsSubmitting(false);
                 setError(uploadError || "Error al subir la nueva imagen. No se guardaron los cambios.");
                 return;
            }
             // Opcional: Borrar imagen antigua ANTES de asignar la nueva
             if (finalImageFilename && finalImageFilename !== uploadedFilename) {
                 try {
                     // No necesitamos esperar la respuesta, es "fire and forget"
                     axios.delete(`${API_FILES}/${finalImageFilename}`); 
                     console.log("Intentando borrar imagen antigua:", finalImageFilename);
                 } catch (deleteError) {
                     console.warn("No se pudo borrar la imagen antigua:", finalImageFilename, deleteError);
                     // Continuamos aunque falle el borrado
                 }
             }
            finalImageFilename = uploadedFilename; 
        }
        
        // Crear FormData para enviar a /api/productos/{id} (PUT)
        // El backend espera @RequestParam
        const productFormData = new FormData();
        productFormData.append('precio', Number(producto.precio));
        productFormData.append('stock', Number(producto.stock));
        productFormData.append('descripcion', producto.descripcion || '');
        // Solo enviar filename si existe (no enviar null como string)
        if (finalImageFilename) {
             productFormData.append('imageFilename', finalImageFilename);
        } else {
             // Si queremos explícitamente borrar la imagen, podríamos necesitar enviar un valor especial
             // o tener otro endpoint. Por ahora, si no hay filename, no se envía.
             // Si el backend espera siempre el campo, envía cadena vacía:
             // productFormData.append('imageFilename', ''); 
        }


        try {
            // 1. Actualizar datos del producto en el backend (PUT)
            await axios.put(`${API_PRODUCTOS}/${id}`, productFormData, {
                 headers: {
                     // Axios suele detectar FormData y poner multipart/form-data
                 }
            });
            
            // 2. Actualizar el mapa de categorías localmente
            const updatedMap = { ...categoriaMap, [String(id)]: categoriaActual };
            setCategoriaMap(updatedMap);
             try {
                 localStorage.setItem(CATS_KEY, JSON.stringify(updatedMap));
             } catch (e) { console.warn('No se pudo guardar categoriaMap', e); }


            // 3. Navegar de vuelta
            navigate('/listado_productos');

        } catch (err) {
            console.error('Error actualizando producto:', err);
            const serverMsg = err.response?.data?.message ?? err.response?.data ?? JSON.stringify(err.response?.data);
            // Mostrar error específico si es posible
            if (err.response?.data?.error) {
                 setError(`Error: ${err.response.data.error}`);
            } else {
                 setError(`Error del servidor: ${serverMsg || err.message}`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Renderizado ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-blue-100 to-purple-100 p-4">
             <motion.div
                key="edit-product-form"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 30 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 transform transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`}
            >
                <h3 className="text-3xl font-bold text-center text-indigo-700 mb-8">
                    Editar Producto #{id}
                </h3>

                {loading && <p className="text-center text-gray-500 mb-4">Cargando datos...</p>}
                {error && (<div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200" role="alert">{error}</div>)}
                
                {/* Ocultar formulario si está cargando o hubo error inicial grave */}
                {!loading && !error?.includes("no encontrado") && ( 
                    <form onSubmit={onSubmit} className="space-y-5">
                         {/* --- Sección Imagen --- */}
                        <div>
                             <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1"><IconPhotograph/> Imagen del Producto</label>
                             <div className="mt-1 flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                {/* Vista Previa */}
                                <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden shrink-0 border border-gray-300">
                                     {imagePreviewUrl ? (
                                        <img src={imagePreviewUrl} alt="Vista previa" className="w-full h-full object-cover"/>
                                    ) : (
                                        <IconCube className="h-10 w-10 text-gray-400"/>
                                    )}
                                </div>
                                {/* Input File y Estado */}
                                <div className="flex-grow">
                                    <label htmlFor="file-upload" className="block text-sm text-gray-500 mb-2">Cambiar imagen (Opcional):</label>
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                        id="file-upload"
                                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                        disabled={isUploading || isSubmitting}
                                    />
                                    {isUploading && <p className="text-xs text-indigo-600 mt-1 animate-pulse">Subiendo imagen...</p>}
                                    {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
                                    {/* Mostrar nombre de archivo actual si no se está subiendo/seleccionando uno nuevo */}
                                    {!isUploading && !uploadError && producto.imageFilename && !selectedFile && <p className="text-xs text-gray-500 mt-1">Actual: {producto.imageFilename.substring(0,20)}...</p>}
                                     {/* Indicar si se seleccionó un nuevo archivo */}
                                     {selectedFile && !isUploading && <p className="text-xs text-blue-600 mt-1">Nueva imagen seleccionada.</p>}
                                </div>
                             </div>
                        </div>
                        {/* --- Fin Sección Imagen --- */}

                        <div className="grid sm:grid-cols-2 gap-5">
                            <label className="flex flex-col">
                                <span className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1"><IconCash/> Precio ($)</span>
                                <input
                                    type="number" step="0.01" min="0" required
                                    name="precio"
                                    value={producto.precio}
                                    onChange={onInputChange}
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    placeholder="0.00"
                                    disabled={isUploading || isSubmitting}
                                />
                            </label>
                            <label className="flex flex-col">
                                <span className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1"><IconArchive/> Stock</span>
                                <input
                                    type="number" min="0" required
                                    name="stock"
                                    value={producto.stock}
                                    onChange={onInputChange}
                                    className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                    placeholder="0"
                                     disabled={isUploading || isSubmitting}
                                />
                            </label>
                        </div>
                        <label className="flex flex-col">
                            <span className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1"><IconClipboardList/> Descripción</span>
                            <input
                                type="text"
                                name="descripcion"
                                value={producto.descripcion}
                                onChange={onInputChange}
                                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="Nombre o detalle del producto"
                                 disabled={isUploading || isSubmitting}
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1"><IconTag/> Categoría</span>
                            <select
                                value={categoriaActual} 
                                onChange={onCategoryChange} 
                                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none cursor-pointer"
                                required 
                                 disabled={isUploading || isSubmitting}
                            >
                                <option value="" disabled hidden={categoriaActual !== ''}>-- Selecciona --</option> 
                                {categorias.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                                {categoriaActual && !categorias.includes(categoriaActual) && (
                                    <option key={categoriaActual} value={categoriaActual}>{categoriaActual} (Guardada)</option>
                                )}
                            </select>
                        </label>
                        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 mt-6">
                            <Link
                                to="/listado_productos" 
                                className="px-5 py-2.5 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition" 
                            >
                                Cancelar
                            </Link>
                            <motion.button 
                                 whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                                 type="submit" 
                                 className="px-5 py-2.5 font-medium rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-md hover:from-yellow-600 hover:to-orange-600 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition" 
                                 disabled={isUploading || isSubmitting} 
                            >
                                 {isSubmitting ? 'Guardando...' : (isUploading ? 'Subiendo...' : 'Guardar Cambios')} 
                            </motion.button>
                        </div>
                    </form>
                )}
                 {/* Mostrar solo el botón de regresar si hubo error grave al cargar */}
                 {!loading && error?.includes("no encontrado") && (
                     <div className="flex justify-center mt-6">
                         <Link
                             to="/listado_productos"
                             className="px-5 py-2.5 font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
                         >
                             Regresar al Listado
                         </Link>
                     </div>
                 )}
            </motion.div>
        </div>
    );
}

