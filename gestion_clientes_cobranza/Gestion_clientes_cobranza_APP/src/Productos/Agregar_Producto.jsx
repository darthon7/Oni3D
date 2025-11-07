import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
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
const IconPhotograph = () => ( // Icono para Imagen
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
);
const IconUpload = () => ( // Icono para botón de subir
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);
// --- Fin Iconos SVG ---


export default function Agregar_Producto() {
    const API_FILES = import.meta.env.VITE_API_BASE_FILES || 'http://localhost:8080/api/files'; // Endpoint genérico de archivos
    const API_PRODUCTOS = import.meta.env.VITE_API_BASE_PRODUCTOS || 'http://localhost:8080/api/productos'; // Endpoint de productos

    const navigate = useNavigate();

    // Estado del formulario
    const [form, setForm] = useState({
        precio: '',
        stock: '',
        descripcion: '',
        categoria: '', // Se carga desde localStorage abajo
        imageFilename: null, // Para guardar el nombre del archivo subido
    });

    // Estado para la imagen seleccionada y subida
    const [selectedFile, setSelectedFile] = useState(null); // El objeto File seleccionado
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // URL para vista previa
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    // Estado general de envío y errores del formulario
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);

    // Estado para animación de entrada
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 50);
        return () => clearTimeout(timer);
    }, []);

    // Cargar categorías desde localStorage (igual que en Listado)
    const [categorias, setCategorias] = useState(() => {
        try {
            const raw = localStorage.getItem('oni3d_categorias');
            const parsed = raw ? JSON.parse(raw) : ['Impresoras', 'Accesorios', 'Filamento'];
            // Filtrar 'All' para las opciones del select
            return parsed.filter(c => c !== 'All');
        } catch (e) {
            return ['Impresoras', 'Accesorios', 'Filamento'];
        }
    });

    // Establecer categoría por defecto en el formulario
    useEffect(() => {
        if (categorias.length > 0 && !form.categoria) {
            setForm(prev => ({ ...prev, categoria: categorias[0] }));
        }
    }, [categorias, form.categoria]);

    // Manejar cambios en inputs normales
    const onInputChange = (e) => {
        setSubmitError(null); // Limpiar error al escribir
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Manejar selección de archivo de imagen
    const handleFileChange = (event) => {
        setSubmitError(null);
        setUploadError(null); // Limpiar errores de subida
        setForm({...form, imageFilename: null}); // Resetear filename si se cambia el archivo
        setImagePreviewUrl(null); // Limpiar vista previa

        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
            // Crear URL temporal para vista previa
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
             if(file) alert("Por favor, selecciona un archivo de imagen válido (jpg, png, gif, etc.).");
        }
    };

    // Función para subir la imagen al backend genérico
    const handleImageUpload = async () => {
        if (!selectedFile) {
            setUploadError("Primero selecciona un archivo de imagen.");
            return null; // Indica que no se subió nada
        }

        setIsUploading(true);
        setUploadError(null);
        setForm({...form, imageFilename: null}); // Asegurar que está limpio antes de subir

        const formData = new FormData();
        formData.append('file', selectedFile); // 'file' debe coincidir con @RequestParam("file") en FileController

        try {
            const response = await axios.post(`${API_FILES}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setIsUploading(false);
            // Guardar solo el nombre del archivo devuelto por el backend
            setForm({...form, imageFilename: response.data.filename}); 
            // Podrías usar response.data.url si prefieres guardar la URL completa
            console.log("Imagen subida, filename:", response.data.filename);
            return response.data.filename; // Devuelve el nombre del archivo para usarlo en onSubmit

        } catch (error) {
            console.error("Error al subir la imagen:", error.response?.data || error.message);
            setUploadError(`Error al subir imagen: ${error.response?.data?.error || error.message}`);
            setIsUploading(false);
            return null; // Indica fallo
        }
    };

    // Manejar envío del formulario completo (Producto + ImageFilename)
    const onSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);

        // Validaciones
        if (!form.categoria) return setSubmitError('Por favor, selecciona una categoría.');
        if (!form.precio || isNaN(Number(form.precio)) || Number(form.precio) < 0) return setSubmitError('Introduce un precio válido (>= 0)');
        if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0) return setSubmitError('Introduce un stock válido (>= 0)');
        
        setIsSubmitting(true); // Indicar inicio de envío

        let uploadedFilename = form.imageFilename; // Usar el filename ya subido si existe

        // Si hay un archivo seleccionado pero aún no se ha subido OBLIGATORIAMENTE, subirlo ahora
        if (selectedFile && !uploadedFilename && !isUploading) {
            uploadedFilename = await handleImageUpload();
            // Si la subida falla aquí, detener el proceso
            if (!uploadedFilename) {
                 setIsSubmitting(false);
                 setSubmitError(uploadError || "No se pudo subir la imagen antes de guardar.");
                 return; 
            }
        }

        // Crear FormData para enviar datos del producto
        // El backend ProductoController espera @RequestParam ahora
        const productFormData = new FormData();
        productFormData.append('precio', Number(form.precio));
        productFormData.append('stock', Number(form.stock));
        productFormData.append('descripcion', form.descripcion || '');
        if (uploadedFilename) { // Solo añadir si existe un nombre de archivo
            productFormData.append('imageFilename', uploadedFilename);
        }
        
        // ¡IMPORTANTE! La categoría se guarda localmente, no se envía al backend de productos
        // Si necesitas guardar la categoría en el backend, debes añadir un campo @RequestParam("categoria")
        // en ProductoController y añadirlo aquí: productFormData.append('categoria', form.categoria);

        try {
            // Enviar datos del producto al backend
            const response = await axios.post(API_PRODUCTOS, productFormData, {
                 headers: {
                     // NO es 'multipart/form-data' aquí si solo envías texto, 
                     // axios lo detecta si usas FormData aunque no haya archivo
                     // Si tienes problemas, podrías enviar como application/json sin FormData
                     // si no hay imageFilename, o URLSearchParams.
                 }
            });

            const creado = response.data;
            const id = creado?.idProducto ?? creado?.id ?? null;
            const key = String(id ?? Date.now());

            // --- Actualizar Mapa de Categorías Localmente ---
            // Leemos el mapa actual, añadimos la nueva entrada y guardamos
             try {
                 const rawMap = localStorage.getItem('oni3d_product_categories');
                 const currentMap = rawMap ? JSON.parse(rawMap) : {};
                 currentMap[key] = form.categoria; // Añadir la categoría seleccionada
                 localStorage.setItem('oni3d_product_categories', JSON.stringify(currentMap));
             } catch (e) {
                 console.warn('No se pudo actualizar categoriaMap en localStorage', e);
             }
            // --- Fin Actualizar Mapa ---

            navigate('/listado_productos'); // Redirigir a la lista

        } catch (error) {
            console.error("Error al guardar el producto:", error.response?.data || error.message);
            setSubmitError(`Error al guardar: ${error.response?.data?.error || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <motion.div
                key="add-product-form"
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className={`w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 transform transition-opacity duration-300 ${isMounted ? 'opacity-100' : 'opacity-0'}`}
            >
                <h3 className="text-3xl font-bold text-center text-indigo-700 mb-8">
                    Agregar Nuevo Producto
                </h3>

                {/* Mensaje de error general del formulario */}
                {submitError && (
                    <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg border border-red-200" role="alert">
                        {submitError}
                    </div>
                )}

                <form onSubmit={onSubmit} className="space-y-5">
                    {/* Sección Imagen */}
                    <div>
                         <label className="block text-sm font-medium text-gray-600 mb-1 flex items-center gap-1"><IconPhotograph/> Imagen del Producto (Opcional)</label>
                         <div className="mt-1 flex items-center gap-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                            {/* Vista Previa */}
                            <div className="w-24 h-24 rounded-lg bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                                 {imagePreviewUrl ? (
                                    <img src={imagePreviewUrl} alt="Vista previa" className="w-full h-full object-cover"/>
                                ) : (
                                    <IconCube className="h-10 w-10 text-gray-400"/>
                                )}
                            </div>
                            {/* Input File y Estado */}
                            <div className="flex-grow">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                    id="file-upload"
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
                                />
                                {/* Indicador de subida o error */}
                                {isUploading && <p className="text-xs text-indigo-600 mt-1 animate-pulse">Subiendo imagen...</p>}
                                {uploadError && <p className="text-xs text-red-600 mt-1">{uploadError}</p>}
                                {form.imageFilename && !isUploading && !uploadError && <p className="text-xs text-green-600 mt-1">Imagen lista ({form.imageFilename.substring(0, 15)}...).</p>}
                                {!selectedFile && !form.imageFilename && <p className="text-xs text-gray-500 mt-1">Selecciona JPG, PNG, GIF, etc.</p>}
                            </div>
                         </div>
                    </div>

                    {/* Grid para Precio y Stock */}
                    <div className="grid sm:grid-cols-2 gap-5">
                        <label className="flex flex-col">
                            <span className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1"><IconCash/> Precio ($)</span>
                            <input
                                type="number" step="0.01" min="0" required
                                name="precio"
                                value={form.precio}
                                onChange={onInputChange}
                                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="0.00"
                            />
                        </label>
                        <label className="flex flex-col">
                            <span className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1"><IconArchive/> Stock</span>
                            <input
                                type="number" min="0" required
                                name="stock"
                                value={form.stock}
                                onChange={onInputChange}
                                className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                placeholder="0"
                            />
                        </label>
                    </div>

                    {/* Descripción */}
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1"><IconClipboardList/> Descripción</span>
                        <input
                            type="text"
                            name="descripcion"
                            value={form.descripcion}
                            onChange={onInputChange}
                            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                            placeholder="Nombre o detalle del producto"
                        />
                    </label>

                    {/* Categoría */}
                    <label className="flex flex-col">
                        <span className="text-sm font-medium text-gray-600 mb-1 flex items-center gap-1"><IconTag/> Categoría</span>
                        <select
                            name="categoria"
                            value={form.categoria}
                            onChange={onInputChange}
                            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white appearance-none cursor-pointer"
                            required
                        >
                            <option value="" disabled hidden={form.categoria !== ''}>-- Selecciona --</option>
                            {categorias.map((c) => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </label>

                    {/* Botones */}
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
                             className="px-5 py-2.5 font-medium rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed transition"
                             disabled={isUploading || isSubmitting} // Deshabilitar si se sube imagen o se envía form
                        >
                             {isSubmitting ? 'Guardando...' : (isUploading ? 'Subiendo Imagen...' : 'Guardar Producto')}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
