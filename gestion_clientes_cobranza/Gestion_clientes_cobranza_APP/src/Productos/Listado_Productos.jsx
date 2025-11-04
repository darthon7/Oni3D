import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Iconos SVG ---
const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
    </svg>
);
const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);
const IconTag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5a.997.997 0 01.707.293l7 7zM6 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);
const IconCube = () => ( // Placeholder
     <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);
const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const IconPencil = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
);
// --- Fin Iconos SVG ---

// --- Componente principal ---
export default function Listado_productos() {
    const API_PRODUCTOS = import.meta.env.VITE_API_BASE_PRODUCTOS || 'http://localhost:8080/api/productos';
    const API_FILES = import.meta.env.VITE_API_BASE_FILES || 'http://localhost:8080/api/files';

    const [productos, setProductos] = useState([]);
    const [productosOriginales, setProductosOriginales] = useState([]); // Guardar todos los productos originales
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Búsqueda
    const [searchId, setSearchId] = useState('');
    const [searching, setSearching] = useState(false);
    const [busquedaActiva, setBusquedaActiva] = useState(false); // Indica si hay una búsqueda activa

    // Categorías
    const [categorias, setCategorias] = useState(() => {
        try {
            const raw = localStorage.getItem('oni3d_categorias');
            const parsed = raw ? JSON.parse(raw) : ['Impresoras', 'Accesorios', 'Filamento'];
            return ['All', ...new Set(parsed.filter(c => c !== 'All'))];
        } catch (e) {
            return ['All', 'Impresoras', 'Accesorios', 'Filamento'];
        }
    });
    const [selectedCategoria, setSelectedCategoria] = useState('All');

    // Mapeo local
    const CATS_KEY = 'oni3d_product_categories';
    const [categoriaMap, setCategoriaMap] = useState(() => {
        try {
            const raw = localStorage.getItem(CATS_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch (e) {
            return {};
        }
    });

    // --- ESTADO PARA MODAL DE DETALLES ---
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    // --- Lógica ---
    useEffect(() => {
        try { localStorage.setItem(CATS_KEY, JSON.stringify(categoriaMap)); }
        catch (e) { console.warn('No se pudo guardar categoriaMap', e); }
    }, [categoriaMap]);

    useEffect(() => { loadProductos(); }, []); // Carga inicial

    async function loadProductos() {
        setLoading(true); setError(null);
        try {
            const res = await axios.get(API_PRODUCTOS);
            const productosList = Array.isArray(res.data) ? res.data : [];
            setProductos(productosList);
            setProductosOriginales(productosList); // Guardar productos originales
            setBusquedaActiva(false); // Resetear búsqueda
            setSearchId(''); // Limpiar campo de búsqueda
        } catch (err) {
            console.error('Error al cargar productos:', err);
            setError('Error cargando productos. Revisa la consola.');
        } finally { setLoading(false); }
    }

    function saveCategoriasList(list) {
        const finalList = ['All', ...new Set(list.filter(c => c !== 'All'))];
        setCategorias(finalList);
        try {
            localStorage.setItem('oni3d_categorias', JSON.stringify(finalList.filter(c => c !== 'All')));
        } catch (e) { console.warn('No se pudo guardar categorias', e); }
    }

    // Función para obtener productos a mostrar (considerando búsqueda y categoría)
    const getVisibleProducts = () => {
        // Si hay búsqueda activa, usar productos filtrados, sino usar productos originales
        const productosAFiltrar = busquedaActiva ? productos : productosOriginales;
        
        return productosAFiltrar.filter((p) => {
            if (selectedCategoria === 'All') return true;
            const pId = String(p.idProducto ?? p.id);
            return (pId in categoriaMap) && (categoriaMap[pId] === selectedCategoria);
        });
    };

    const visibleProducts = getVisibleProducts();

    async function handleDelete(id, e) {
        e.stopPropagation(); // Evitar abrir modal
        if (!window.confirm('¿Seguro que quieres eliminar este producto?')) return;
        const stringId = String(id);
        try {
            await axios.delete(`${API_PRODUCTOS}/${stringId}`);
            // Actualizar ambos estados de productos
            setProductos((prev) => prev.filter((p) => String(p.idProducto ?? p.id) !== stringId));
            setProductosOriginales((prev) => prev.filter((p) => String(p.idProducto ?? p.id) !== stringId));
            setCategoriaMap(prev => {
                const newMap = {...prev};
                delete newMap[stringId];
                return newMap;
            });
        } catch (err) {
            console.error('Error eliminando producto:', err);
            alert('Error eliminando producto: ' + (err.response?.data?.message ?? err.message));
        }
    }

     function handleDeleteCategoria(cat, e) {
        e.stopPropagation(); // Evitar activar botón categoría
        if (cat === 'All') return;
        if (!window.confirm(`¿Eliminar la categoría "${cat}"? Se desasignará de los productos.`)) return;
        const updatedCategorias = categorias.filter((c) => c !== cat);
        saveCategoriasList(updatedCategorias);
        const newMap = { ...categoriaMap };
        Object.keys(newMap).forEach((k) => { if (newMap[k] === cat) delete newMap[k]; });
        setCategoriaMap(newMap);
        if (selectedCategoria === cat) setSelectedCategoria('All');
    }

    function handleAddCategoria(newCat) {
        const trimmedCat = newCat.trim();
        if (!trimmedCat || categorias.map(c => c.toLowerCase()).includes(trimmedCat.toLowerCase())) {
             alert('La categoría no puede estar vacía o ya existe.');
             return;
        }
        const currentRealCategories = categorias.filter(c => c !== 'All');
        saveCategoriasList(['All', ...currentRealCategories, trimmedCat]);
    }

    async function handleSearchById(e) {
        e?.preventDefault?.();
        const trimmedId = searchId.trim();
        if (!trimmedId) {
            // Si el campo está vacío, resetear búsqueda
            setBusquedaActiva(false);
            setProductos(productosOriginales);
            setError(null);
            return;
        }
        setSearching(true); 
        setError(null);
        try {
            const res = await axios.get(`${API_PRODUCTOS}/${trimmedId}`);
            const prod = res.data;
            if (prod) {
                setProductos([prod]);
                setBusquedaActiva(true);
                // Si el producto encontrado no pertenece a la categoría actual, cambiar a "All"
                const pId = String(prod.idProducto ?? prod.id);
                if (selectedCategoria !== 'All' && categoriaMap[pId] !== selectedCategoria) {
                    setSelectedCategoria('All');
                }
            } else {
                setProductos([]);
                setBusquedaActiva(true);
                setError('Producto no encontrado con ese ID.');
            }
        } catch (err) {
            console.error('Error buscando por ID:', err);
            setProductos([]);
            setBusquedaActiva(true);
            if (err.response && err.response.status === 404) {
                setError('Producto no encontrado con ese ID.');
            } else {
                setError('Error al buscar producto. Revisa la consola.');
            }
        } finally { 
            setSearching(false); 
        }
    }

    // --- FUNCIÓN PARA ABRIR MODAL DE DETALLES ---
    const handleShowDetails = (product) => {
        setSelectedProduct(product);
        setShowDetailModal(true);
    };
     // --- FUNCIÓN PARA CERRAR MODAL DE DETALLES ---
    const handleCloseDetails = () => {
        setShowDetailModal(false);
        // Pequeño delay para que la animación de salida termine antes de limpiar
        setTimeout(() => setSelectedProduct(null), 300); 
    };

    // --- Renderizado ---
    return (
        <>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                
                @keyframes pulse-glow {
                    0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
                    50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
                }
                
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                
                .animate-fade-in {
                    animation: fadeIn 0.6s ease-out;
                }
                
                .animate-slide-in {
                    animation: slideIn 0.4s ease-out;
                }
                
                .card-hover-effect {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .card-hover-effect:hover {
                    transform: translateY(-8px) scale(1.02);
                    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                }
            `}</style>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-8">
                <div className="max-w-screen-xl mx-auto">
                    {/* --- Cabecera Mejorada --- */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl overflow-hidden">
                            <div className="relative p-8">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                                <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                                            <IconCube />
                                        </div>
                                        <div>
                                            <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg mb-2">
                                                Inventario de Productos
                                            </h1>
                                            <p className="text-blue-100 text-base md:text-lg font-medium">
                                                📦 Administra tu catálogo completo de productos
                                                {busquedaActiva && (
                                                    <span className="ml-2 px-2 py-1 bg-yellow-400/30 rounded text-xs font-semibold">
                                                        🔍 Búsqueda activa
                                                    </span>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        {/* Barra de búsqueda mejorada */}
                                        <form onSubmit={handleSearchById} className="relative flex-grow md:flex-grow-0">
                                            <input 
                                                type="search" 
                                                placeholder="Buscar por ID..." 
                                                value={searchId} 
                                                onChange={(e) => setSearchId(e.target.value)} 
                                                className="w-full md:w-80 pl-12 pr-12 py-3 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-full shadow-lg text-white placeholder-white/70 focus:ring-2 focus:ring-white/50 focus:border-white/50 focus:bg-white/30 transition-all text-sm font-medium"
                                            />
                                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/80 pointer-events-none">
                                                <IconSearch />
                                            </span>
                                            <button type="submit" className="hidden"></button>
                                            {(searchId || busquedaActiva) && (
                                                <motion.button 
                                                    type="button" 
                                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white cursor-pointer p-1 rounded-full hover:bg-white/20 transition-all" 
                                                    onClick={() => { 
                                                        setSearchId(''); 
                                                        setBusquedaActiva(false);
                                                        setProductos(productosOriginales);
                                                        setError(null); 
                                                    }} 
                                                    aria-label="Limpiar búsqueda"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <IconX />
                                                </motion.button>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                 {/* --- Mensajes Globales Mejorados --- */}
                 <AnimatePresence>
                     {loading && (
                         <motion.div 
                             key="loading-msg" 
                             initial={{ opacity: 0, y: -10 }} 
                             animate={{ opacity: 1, y: 0 }} 
                             exit={{ opacity: 0, y: -10 }}
                             className="mb-6 p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl shadow-lg"
                         >
                             <div className="flex items-center justify-center gap-3">
                                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                                 <span className="font-medium">Cargando productos...</span>
                             </div>
                         </motion.div>
                     )}
                     {error && (
                         <motion.div 
                             key="error-msg" 
                             initial={{ opacity: 0, scale: 0.95 }} 
                             animate={{ opacity: 1, scale: 1 }} 
                             exit={{ opacity: 0, scale: 0.95 }}
                             className="mb-6 p-4 text-sm text-red-800 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-lg border-2 border-red-200" 
                             role="alert"
                         >
                             <div className="flex items-center gap-2">
                                 <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                 </svg>
                                 {error}
                             </div>
                         </motion.div>
                     )}
                 </AnimatePresence>

                {/* --- Contenido Principal (Grid) --- */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

                    {/* --- Sidebar de categorías mejorado --- */}
                    <motion.aside
                        initial={{ opacity: 0, x: -50 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="col-span-1 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden h-fit sticky top-8"
                    >
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <IconTag className="h-5 w-5" />
                                Categorías
                            </h3>
                            <p className="text-blue-100 text-sm mt-1">Filtra tus productos</p>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-2">
                                {categorias.map((cat, index) => {
                                    // Usar productos originales para contar, no los filtrados por búsqueda
                                    const productosParaContar = busquedaActiva ? productosOriginales : productos;
                                    const count = cat === 'All' ? productosParaContar.length : productosParaContar.filter(p => categoriaMap[String(p.idProducto ?? p.id)] === cat).length;
                                    const isSelected = selectedCategoria === cat;
                                    return (
                                        <motion.li 
                                            key={cat} 
                                            className="flex items-center justify-between group"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 + (index * 0.05), duration: 0.3 }}
                                        >
                                            <button 
                                                className={`flex justify-between items-center w-full text-left px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer relative overflow-hidden ${
                                                    isSelected 
                                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg scale-105' 
                                                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-blue-700 hover:shadow-md'
                                                }`} 
                                                onClick={() => {
                                                    setSelectedCategoria(cat);
                                                    // Si hay búsqueda activa y se cambia de categoría, resetear la búsqueda
                                                    if (busquedaActiva && cat !== 'All') {
                                                        setBusquedaActiva(false);
                                                        setSearchId('');
                                                        setProductos(productosOriginales);
                                                    }
                                                }}
                                                whileHover={{ scale: isSelected ? 1.05 : 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {isSelected && (
                                                    <motion.div
                                                        layoutId="selectedCategory"
                                                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"
                                                        initial={false}
                                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                    />
                                                )}
                                                <span className="relative truncate pr-2 z-10">{cat}</span>
                                                <motion.span 
                                                    className={`text-xs px-3 py-1 rounded-full font-semibold relative z-10 ${
                                                        isSelected 
                                                            ? 'bg-white/30 text-white' 
                                                            : 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700'
                                                    }`}
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    {count}
                                                </motion.span>
                                            </button>
                                            {cat !== 'All' && (
                                                <motion.button 
                                                    whileHover={{ scale: 1.15, rotate: -12 }} 
                                                    whileTap={{ scale: 0.9 }} 
                                                    title={`Eliminar categoría ${cat}`} 
                                                    onClick={(e) => handleDeleteCategoria(cat, e)} 
                                                    className="ml-2 p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all cursor-pointer border border-transparent hover:border-red-200"
                                                >
                                                    <IconTrash />
                                                </motion.button>
                                            )}
                                        </motion.li>
                                    );
                                })}
                            </ul>
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <AddCategory onAdd={handleAddCategoria} />
                            </div>
                        </div>
                    </motion.aside>

                    {/* --- Grid de productos mejorado --- */}
                    <main className="col-span-1 lg:col-span-3">
                        <AnimatePresence mode="wait">
                             {!loading && visibleProducts.length === 0 ? (
                                <motion.div 
                                    key="no-products" 
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }} 
                                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="p-16 text-center text-gray-500 bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col items-center justify-center min-h-[400px]"
                                >
                                    <motion.div
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                    >
                                        <IconCube className="h-20 w-20 text-blue-300 mb-6 mx-auto" />
                                    </motion.div>
                                    <h3 className="text-2xl font-bold mb-2 text-gray-700">
                                        {busquedaActiva ? 'Sin productos en búsqueda' : 'Sin productos'}
                                    </h3>
                                    <p className="text-base text-gray-500">
                                        {busquedaActiva 
                                            ? 'No se encontraron productos que coincidan con la búsqueda y la categoría seleccionada.'
                                            : selectedCategoria !== 'All'
                                            ? `No se encontraron productos en la categoría "${selectedCategoria}".`
                                            : 'No hay productos disponibles en este momento.'}
                                    </p>
                                    {busquedaActiva && (
                                        <motion.button
                                            onClick={() => {
                                                setSearchId('');
                                                setBusquedaActiva(false);
                                                setProductos(productosOriginales);
                                                setError(null);
                                            }}
                                            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Limpiar Búsqueda
                                        </motion.button>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="product-grid" 
                                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
                                    variants={{
                                        hidden: { opacity: 0 }, 
                                        show: { 
                                            opacity: 1, 
                                            transition: { 
                                                staggerChildren: 0.1,
                                                delayChildren: 0.1
                                            } 
                                        }
                                    }} 
                                    initial="hidden" 
                                    animate="show" 
                                    exit="hidden"
                                >
                                    {visibleProducts.map((p, index) => (
                                        <motion.button
                                            key={p.idProducto ?? p.id}
                                            variants={{ 
                                                hidden: { opacity: 0, y: 30, scale: 0.9 }, 
                                                show: { opacity: 1, y: 0, scale: 1 } 
                                            }}
                                            layout
                                            onClick={() => handleShowDetails(p)}
                                            className="card-hover-effect bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col group text-left w-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-blue-500/50 focus:ring-offset-2 border border-gray-100"
                                            whileHover={{ y: -8, scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        >
                                            {/* Imagen mejorada */}
                                            <div className="h-48 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center text-gray-400 overflow-hidden relative group-hover:from-blue-200 group-hover:via-purple-200 group-hover:to-pink-200 transition-all duration-300">
                                                {p.imageFilename ? (
                                                    <motion.img 
                                                        src={`${API_FILES}/${p.imageFilename}`} 
                                                        alt={p.descripcion || 'Imagen del producto'} 
                                                        className="w-full h-full object-cover" 
                                                        onError={(e) => { 
                                                            e.currentTarget.style.display = 'none'; 
                                                            const placeholder = e.currentTarget.nextElementSibling; 
                                                            if(placeholder) placeholder.style.display = 'flex'; 
                                                        }} 
                                                        style={{ display: 'block' }}
                                                        whileHover={{ scale: 1.1 }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                ) : null}
                                                <div className={`absolute inset-0 flex items-center justify-center ${p.imageFilename ? 'hidden' : 'flex'}`} style={p.imageFilename ? { display: 'none' } : {}}>
                                                    <motion.div
                                                        animate={{ rotate: [0, 5, -5, 0] }}
                                                        transition={{ duration: 4, repeat: Infinity }}
                                                    >
                                                        <IconCube className="h-16 w-16 text-blue-300" />
                                                    </motion.div>
                                                </div>
                                                <motion.div 
                                                    className="absolute top-3 right-3 text-xs font-bold text-gray-700 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md border border-gray-200"
                                                    whileHover={{ scale: 1.1 }}
                                                >
                                                    #{p.idProducto ?? p.id}
                                                </motion.div>
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </div>
                                            {/* Contenido mejorado */}
                                            <div className="p-6 flex flex-col flex-grow bg-white">
                                                <h4 className="font-bold text-lg text-gray-800 break-words mb-3 group-hover:text-blue-600 transition-colors">
                                                    {p.descripcion || 'Producto sin descripción'}
                                                </h4>
                                                <div className="mb-4">
                                                    <motion.span 
                                                        className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white inline-flex items-center shadow-md"
                                                        whileHover={{ scale: 1.05 }}
                                                    >
                                                        <IconTag className="h-3 w-3 mr-1" />
                                                        {categoriaMap[String(p.idProducto ?? p.id)] || 'Sin categoría'}
                                                    </motion.span>
                                                </div>
                                                <div className="border-t border-gray-200 my-4"></div>
                                                <div className="mt-auto flex items-center justify-between">
                                                    <div>
                                                        <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 mb-1">
                                                            ${p.precio}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Stock: <span className="font-bold text-gray-800">{p.stock}</span> unidades
                                                        </div>
                                                    </div>
                                                    {/* Botones mejorados */}
                                                    <motion.div 
                                                        className="flex items-center gap-2"
                                                        initial={{ opacity: 0, x: 20 }}
                                                        whileHover={{ opacity: 1, x: 0 }}
                                                        transition={{ duration: 0.2 }}
                                                    >
                                                        <Link 
                                                            to={`/Editar_Producto/${p.idProducto ?? p.id}`} 
                                                            onClick={(e) => e.stopPropagation()} 
                                                            className="p-3 rounded-xl text-gray-400 hover:text-yellow-600 hover:bg-yellow-50 cursor-pointer transition-all border border-transparent hover:border-yellow-200 shadow-sm hover:shadow-md" 
                                                            title="Editar producto"
                                                        >
                                                            <IconPencil />
                                                        </Link>
                                                        <motion.button 
                                                            whileHover={{ scale: 1.1, rotate: -5 }} 
                                                            whileTap={{ scale: 0.9 }} 
                                                            className="p-3 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 cursor-pointer transition-all border border-transparent hover:border-red-200 shadow-sm hover:shadow-md" 
                                                            onClick={(e) => handleDelete(p.idProducto ?? p.id, e)} 
                                                            title="Eliminar producto"
                                                        >
                                                            <IconTrash />
                                                        </motion.button>
                                                    </motion.div>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </main>
                </div>

                 {/* --- MODAL DE DETALLES --- */}
                <ProductDetailModal
                    product={selectedProduct}
                    isOpen={showDetailModal}
                    onClose={handleCloseDetails}
                    apiFilesUrl={API_FILES}
                    categoriaMap={categoriaMap}
                />
                 {/* --- FIN MODAL DETALLES --- */}

            </div>
        </div>
        </>
    );
}

// --- Componente AddCategory Mejorado ---
function AddCategory({ onAdd }) {
    const [val, setVal] = useState('');
    return (
        <motion.form 
            className="space-y-3" 
            onSubmit={(e) => { e.preventDefault(); onAdd(val); setVal(''); }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <label className="block text-sm font-bold text-gray-700">Añadir Nueva Categoría</label>
            <div className="flex gap-2">
                <input 
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium bg-white" 
                    placeholder="Nombre de categoría..." 
                    value={val} 
                    onChange={(e) => setVal(e.target.value)} 
                    required 
                />
                <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)" }} 
                    whileTap={{ scale: 0.95 }} 
                    type="submit" 
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-bold hover:from-blue-600 hover:to-purple-700 cursor-pointer transition-all shadow-md"
                >
                    Añadir
                </motion.button>
            </div>
        </motion.form>
    );
}

// --- Componente Modal de Detalles Mejorado ---
function ProductDetailModal({ product, isOpen, onClose, apiFilesUrl, categoriaMap }) {
    if (!isOpen || !product) return null;

    const productIdString = String(product.idProducto ?? product.id);

    return (
        <AnimatePresence>
            <motion.div
                key="detail-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                onClick={onClose}
            >
                <motion.div
                    key="detail-modal-content"
                    initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 15 }}
                    animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50, rotateX: 15 }}
                    transition={{ 
                        type: "spring", 
                        stiffness: 300, 
                        damping: 30,
                        mass: 0.8
                    }}
                    className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row border-4 border-blue-100"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Columna Izquierda: Imagen mejorada */}
                    <div className="w-full md:w-1/2 h-64 md:h-auto bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center relative shrink-0 overflow-hidden">
                        {product.imageFilename ? (
                            <motion.img
                                src={`${apiFilesUrl}/${product.imageFilename}`}
                                alt={product.descripcion || 'Imagen del producto'}
                                className="w-full h-full object-contain p-8"
                                onError={(e) => { 
                                    e.currentTarget.style.display = 'none'; 
                                    const placeholder = e.currentTarget.nextElementSibling; 
                                    if(placeholder) placeholder.style.display = 'flex'; 
                                }}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            />
                        ) : null}
                        {/* Placeholder animado */}
                        <motion.div 
                            className={`absolute inset-0 flex items-center justify-center ${product.imageFilename ? 'hidden' : 'flex'}`} 
                            style={product.imageFilename ? { display: 'none' } : {}}
                            animate={{ rotate: [0, 5, -5, 0] }}
                            transition={{ duration: 4, repeat: Infinity }}
                        >
                            <IconCube className="h-32 w-32 text-blue-300" />
                        </motion.div>
                        {/* ID mejorado */}
                        <motion.div 
                            className="absolute top-4 right-4 text-sm font-bold text-gray-800 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border-2 border-blue-200"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                        >
                            #{productIdString}
                        </motion.div>
                        {/* Overlay decorativo */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                    </div>

                    {/* Columna Derecha: Detalles mejorados */}
                    <div className="p-8 flex flex-col justify-between flex-grow relative bg-gradient-to-br from-white to-gray-50">
                        {/* Botón Cerrar (X) mejorado */}
                        <motion.button 
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-600 cursor-pointer p-2 rounded-full hover:bg-red-50 transition-all border border-transparent hover:border-red-200 shadow-sm hover:shadow-md z-10"
                            aria-label="Cerrar modal"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <IconX className="h-5 w-5" />
                        </motion.button>
                        
                        <div className="pr-8">
                            {/* Categoría mejorada */}
                            <motion.span 
                                className="text-sm font-bold px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white inline-flex items-center shadow-lg"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                            >
                                <IconTag className="h-4 w-4 mr-2" />
                                {categoriaMap[productIdString] || 'Sin categoría'}
                            </motion.span>
                            {/* Descripción mejorada */}
                            <motion.h3 
                                className="text-3xl font-extrabold text-gray-800 mb-6 leading-tight"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                {product.descripcion || 'Producto sin descripción'}
                            </motion.h3>
                            {/* Precio y Stock mejorados */}
                            <motion.div 
                                className="grid grid-cols-2 gap-6 mb-8"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border-2 border-blue-200">
                                    <span className="text-sm font-semibold text-blue-700 block mb-2">Precio Unitario</span>
                                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                                        ${product.precio}
                                    </p>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border-2 border-purple-200">
                                    <span className="text-sm font-semibold text-purple-700 block mb-2">Stock Disponible</span>
                                    <p className="text-4xl font-extrabold text-purple-700">{product.stock}</p>
                                    <span className="text-xs text-purple-600 mt-1 block">unidades</span>
                                </div>
                            </motion.div>
                            {product.detalles && (
                                <motion.div 
                                    className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <p className="text-sm font-semibold text-gray-700 mb-2">Detalles:</p>
                                    <p className="text-gray-600 text-sm">{product.detalles}</p>
                                </motion.div>
                            )}
                        </div>
                        {/* Botón Cerrar mejorado */}
                        <motion.button
                            onClick={onClose}
                            className="mt-6 w-full px-6 py-3 font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl hover:from-blue-600 hover:to-purple-700 cursor-pointer transition-all shadow-lg hover:shadow-xl"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                        >
                            Cerrar
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

