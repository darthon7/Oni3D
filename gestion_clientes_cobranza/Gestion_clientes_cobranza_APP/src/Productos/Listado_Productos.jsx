import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Package, DollarSign, Box, Tag, FileText, Image, 
  Pencil, Trash2, X 
} from 'lucide-react';

export default function Listado_Productos() {
  const [productosOriginales, setProductosOriginales] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('descripcion');
  
  // Estado para el modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(null);

  // URL de tu API - ajusta según tu configuración
  const API_URL = 'http://localhost:8080/api/productos';
  const API_FILES = 'http://localhost:8080/api/files';

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar los productos');
      const data = await response.json();
      const productosArray = Array.isArray(data) ? data : [];
      setProductosOriginales(productosArray);
      setProductos(productosArray);
      setSearchTerm('');
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error desconocido al cargar productos');
      setProductosOriginales([]);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm || !searchTerm.trim()) {
      setProductos(productosOriginales);
      return;
    }

    try {
      setError(null);
      const termino = searchTerm.trim().toLowerCase();
      
      const productosFiltrados = productosOriginales.filter((producto) => {
        if (filterType === 'descripcion') {
          return (
            producto.descripcion?.toLowerCase().includes(termino) ||
            String(producto.idProducto).includes(termino)
          );
        } else if (filterType === 'precio') {
          const precioNum = parseFloat(termino);
          if (isNaN(precioNum)) {
            return false;
          }
          return Number(producto.precio) === precioNum;
        }
        return false;
      });

      setProductos(productosFiltrados);
      
      if (productosFiltrados.length === 0) {
        setError(`No se encontraron productos que coincidan con "${searchTerm}" en ${filterType}`);
      }
    } catch (err) {
      setError('Error al realizar la búsqueda');
      setProductos(productosOriginales);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setProductos(productosOriginales);
    setError(null);
  };

  const navigate = useNavigate();

  const handleEditClick = (id) => {
    navigate(`/Editar_Producto/${id}`);
  };

  const handleDeleteClick = (id) => {
    setShowDeleteModal(id);
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;
    const id = showDeleteModal;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el producto');
      }

      setProductos(productos.filter(p => p.idProducto !== id));
      setShowDeleteModal(null);
      
    } catch (err) {
      setError(err?.message || 'Error desconocido al eliminar');
      setShowDeleteModal(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(null);
  };

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-700 text-lg font-semibold">Cargando productos...</p>
        </div>
      </div>
    );
  }

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
        
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
        
        .animate-slide-in {
          animation: slideIn 0.4s ease-out;
        }
      `}</style>

      {/* --- Modal de Confirmación de Borrado --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center p-4 transition-opacity duration-300">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-2xl p-6 border border-gray-200 max-w-sm w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Confirmar Eliminación</h3>
              <button onClick={cancelDelete} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* --- Contenido Principal de la Página --- */}
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="relative p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                <div className="relative flex items-center gap-4">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                    <Package className="w-8 h-8" />
                  </div>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg mb-2">
                      Catálogo de Productos
                    </h1>
                    <p className="text-blue-100 text-base md:text-lg font-medium">
                      📦 Gestiona y busca productos de forma eficiente
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-8"
          >
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Search className="w-5 h-5" />
                Búsqueda y Filtros
              </h2>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-medium"
                >
                  <option value="descripcion">Descripción</option>
                  <option value="precio">Precio</option>
                </select>
                
                <input
                  type={filterType === 'precio' ? 'number' : 'text'}
                  placeholder={`Buscar por ${filterType}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 px-4 py-3 bg-white border-2 border-gray-300 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500 transition-all"
                />
                
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all flex items-center gap-2 justify-center shadow-lg hover:shadow-xl"
                >
                  <Search className="w-5 h-5" />
                  Buscar
                </button>
                
                <button
                  onClick={fetchProductos}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl font-semibold transition-all"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">{error}</p>
            </motion.div>
          )}

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-700 text-sm font-semibold">
              Mostrando <span className="text-blue-600 font-bold">{productos.length}</span> productos
            </p>
          </div>

          {/* Productos Grid */}
          {productos.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-xl p-16 text-center border border-gray-100"
            >
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-700 mb-2">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta ajustar tus criterios de búsqueda</p>
            </motion.div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              <AnimatePresence>
                {productos.map((producto, index) => (
                  <motion.div
                    key={producto.idProducto}
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      show: { opacity: 1, y: 0 },
                    }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 flex flex-col group"
                  >
                    {/* Image Section */}
                    <div className="bg-gradient-to-br from-gray-100 to-blue-50 h-48 flex items-center justify-center overflow-hidden relative group-hover:from-gray-200 group-hover:to-blue-100 transition-all">
                      {producto.imageFilename ? (
                        <motion.img
                          src={`${API_FILES}/${producto.imageFilename}`}
                          alt={producto.descripcion}
                          className="w-full h-full object-contain"
                          whileHover={{ scale: 1.05 }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      {/* Placeholder de imagen */}
                      <div 
                        className="flex-col items-center justify-center text-gray-400" 
                        style={{ display: producto.imageFilename ? 'none' : 'flex' }}
                      >
                        <Image className="w-16 h-16 mb-2" />
                        <p className="text-sm">Sin imagen</p>
                      </div>
                      {/* Badge de ID */}
                      <motion.div 
                        className="absolute top-3 right-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg"
                        whileHover={{ scale: 1.1 }}
                      >
                        #{producto.idProducto}
                      </motion.div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Name and ID */}
                        <div className="mb-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">{producto.descripcion}</h3>
                          <p className="text-xs text-gray-500">ID: {producto.idProducto}</p>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-5 h-5 text-green-600" />
                              <div>
                                <p className="text-xs text-gray-500">Precio</p>
                                <p className="text-green-600 font-bold text-lg">
                                  {formatCurrency(producto.precio)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Box className="w-5 h-5 text-blue-600" />
                              <div>
                                <p className="text-xs text-gray-500">Stock</p>
                                <p className={`font-bold text-lg ${
                                  producto.stock > 3 ? 'text-green-600' : 
                                  producto.stock > 0 ? 'text-yellow-600' : 
                                  'text-red-600'
                                }`}>
                                  {producto.stock}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* --- BOTONES DE ACCIÓN --- */}
                      <div className="mt-6 pt-4 border-t border-gray-200 flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleEditClick(producto.idProducto)}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Pencil className="w-4 h-4" />
                          Editar
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleDeleteClick(producto.idProducto)}
                          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                          Borrar
                        </motion.button>
                      </div>
                    </div>

                    {/* Footer with status */}
                    <div className={`px-6 py-3 text-center font-semibold text-sm ${
                      producto.stock > 2 ? 'bg-green-50 text-green-700' : 
                      producto.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 
                      'bg-red-50 text-red-700'
                    }`}>
                      {producto.stock > 2 ? '✓ Disponible' : 
                       producto.stock > 0 ? '⚠ Stock Bajo' : 
                       '✗ Sin Stock'}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
