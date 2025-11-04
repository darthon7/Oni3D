import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

// --- Iconos que usaremos en el modal ---
const IconTag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5a.997.997 0 01.707.293l7 7zM6 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
    </svg>
);

const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const IconCube = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
);

// --- Componente Modal ---
export default function ProductDetailModal({ product, isOpen, onClose, apiFilesUrl, categoriaMap }) {
    if (!product) return null;

    const productId = String(product.idProducto ?? product.id);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
                    >
                        {/* Header con imagen */}
                        <div className="relative h-64 bg-gray-100 flex items-center justify-center">
                            {product.imageFilename ? (
                                <img
                                    src={`${apiFilesUrl}/${product.imageFilename}`}
                                    alt={product.descripcion}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <IconCube />
                            )}
                             <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-gray-500 bg-white/70 backdrop-blur-sm rounded-full p-2 hover:bg-white hover:text-gray-800 transition-all"
                                aria-label="Cerrar modal"
                            >
                                <IconX />
                            </button>
                        </div>
                        
                        {/* Contenido */}
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-3xl font-bold text-gray-800">{product.descripcion || "Producto"}</h2>
                                    <span className="text-xs font-medium px-3 py-1 mt-2 rounded-full bg-indigo-100 text-indigo-800 inline-flex items-center shadow-sm">
                                        <IconTag />
                                        {categoriaMap[productId] || "Sin categoría"}
                                    </span>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                     <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">${product.precio}</div>
                                     <div className="text-sm text-gray-500 mt-1">ID: #{productId}</div>
                                </div>
                            </div>
                            
                            <p className="text-gray-600 mb-6">{product.detalles || "No hay detalles adicionales para este producto."}</p>

                            <div className="grid grid-cols-2 gap-4 border-t pt-6">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Stock Disponible</p>
                                    <p className="text-xl font-semibold text-gray-800">{product.stock} unidades</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Proveedor</p>
                                    <p className="text-xl font-semibold text-gray-800">{product.proveedor || "No especificado"}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end gap-3">
                                <button onClick={onClose} className="px-5 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 font-semibold transition-colors">
                                    Cerrar
                                </button>
                                <Link to={`/Editar_producto/${productId}`}>
                                    <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-md transition-all">
                                        Editar Producto
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}