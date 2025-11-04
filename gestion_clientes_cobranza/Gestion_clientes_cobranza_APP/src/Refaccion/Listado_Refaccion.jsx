import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import { 
  Search, Package, DollarSign, Box, Tag, FileText, Image, 
  Pencil, Trash2, X // <-- Iconos añadidos
} from 'lucide-react';

export default function Listado_Refaccion() {
  const [refacciones, setRefacciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('nombre');
  
  // Estado para el modal de confirmación
  const [showDeleteModal, setShowDeleteModal] = useState(null); // Almacenará el ID

  // URL de tu API - ajusta según tu configuración
  const API_URL = 'http://localhost:8080/api/refacciones';

  useEffect(() => {
    fetchRefacciones();
  }, []);

  const fetchRefacciones = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar las refacciones');
      const data = await response.json();
      setRefacciones(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchRefacciones();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/buscar/${filterType}?${filterType}=${searchTerm}`);
      if (!response.ok) throw new Error('Error en la búsqueda');
      const data = await response.json();
      setRefacciones(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Funciones de Editar y Borrar ---

  const navigate = useNavigate();

      const handleEditClick = (id) => {
        navigate(`/Editar_Refaccion/${id}`);
      };


  const handleDeleteClick = (id) => {
    setShowDeleteModal(id); // Muestra el modal de confirmación con el ID
  };

  const confirmDelete = async () => {
    if (!showDeleteModal) return;
    const id = showDeleteModal;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la refacción');
      }

      // Eliminar de la UI
      setRefacciones(refacciones.filter(r => r.id !== id));
      setShowDeleteModal(null); // Ocultar modal
      
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(null); // Ocultar modal en caso de error
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(null); // Simplemente oculta el modal
  };

  // --- Fin de Funciones de Editar y Borrar ---

  const formatCurrency = (price) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          <p className="mt-4 text-white text-lg">Cargando refacciones...</p>
        </div>
      </div>
    );
  }

  return (
    // Fragmento para permitir el modal y el contenido principal
    <>
      {/* --- Modal de Confirmación de Borrado --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 z-40 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-slate-800 rounded-xl shadow-2xl p-6 border border-slate-700 max-w-sm w-full animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Confirmar Eliminación</h3>
              <button onClick={cancelDelete} className="text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-300 mb-6">
              ¿Estás seguro de que deseas eliminar esta refacción? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
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
          </div>
        </div>
      )}

      {/* --- Contenido Principal de la Página --- */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Package className="w-10 h-10 text-blue-400" />
              Catálogo de Refacciones
            </h1>
            <p className="text-slate-400">Gestiona y busca refacciones de forma eficiente</p>
          </div>

          {/* Search Bar */}
          <div className="bg-slate-800 rounded-xl shadow-2xl p-6 mb-8 border border-slate-700">
            <div className="flex flex-col md:flex-row gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="nombre">Nombre</option>
                <option value="marca">Marca</option>
                <option value="precio">Precio</option>
              </select>
              
              <input
                type={filterType === 'precio' ? 'number' : 'text'}
                placeholder={`Buscar por ${filterType}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-4 py-3 bg-slate-700 text-white rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400"
              />
              
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center gap-2 justify-center"
              >
                <Search className="w-5 h-5" />
                Buscar
              </button>
              
              <button
                onClick={fetchRefacciones}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-200 px-6 py-4 rounded-lg mb-8">
              <p className="font-semibold">Error:</p>
              <p>{error}</p>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-slate-300 text-sm">
              Mostrando <span className="font-bold text-blue-400">{refacciones.length}</span> refacciones
            </p>
          </div>

          {/* Refacciones Grid */}
          {refacciones.length === 0 ? (
            <div className="bg-slate-800 rounded-xl shadow-2xl p-12 text-center border border-slate-700">
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">No se encontraron refacciones</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {refacciones.map((refaccion) => (
                <div
                  key={refaccion.id}
                  className="bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700 hover:border-blue-500 transition-all duration-300 hover:transform hover:scale-105 flex flex-col"
                >
                  {/* Image Section */}
                  <div className="bg-slate-700 h-48 flex items-center justify-center overflow-hidden">
                    {refaccion.imageFilename ? (
                      <img
                        src={`http://localhost:8080/api/imagenes/${refaccion.imageFilename}`} // Asumiendo que sirves /uploads
                        alt={refaccion.nombre}
                        // *** CAMBIO AQUÍ: object-contain para ver la imagen completa ***
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          // Si la imagen falla, muestra el placeholder
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    {/* Placeholder de imagen */}
                    <div 
                      className="flex-col items-center justify-center text-slate-500" 
                      style={{ display: refaccion.imageFilename ? 'none' : 'flex' }}
                    >
                      <Image className="w-16 h-16 mb-2" />
                      <p className="text-sm">Sin imagen</p>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Name and ID */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-white mb-1">{refaccion.nombre}</h3>
                        <p className="text-xs text-slate-500">ID: {refaccion.id}</p>
                      </div>

                      {/* Details */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Tag className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-400">Marca</p>
                            <p className="text-white font-medium">{refaccion.marca}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <FileText className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs text-slate-400">Descripción</p>
                            <p className="text-white text-sm break-words">{refaccion.descripcion}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                          <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-emerald-400" />
                            <div>
                              <p className="text-xs text-slate-400">Precio</p>
                              <p className="text-emerald-400 font-bold text-lg">
                                {formatCurrency(refaccion.precio)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Box className="w-5 h-5 text-purple-400" />
                            <div>
                              <p className="text-xs text-slate-400">Stock</p>
                              <p className={`font-bold text-lg ${
                                refaccion.stock > 3 ? 'text-green-400' : 
                                refaccion.stock > 0 ? 'text-yellow-400' : 
                                'text-red-400'
                              }`}>
                                {refaccion.stock}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* --- BOTONES DE ACCIÓN AÑADIDOS --- */}
                    <div className="mt-6 pt-4 border-t border-slate-700 flex gap-3">
                      <button
                        onClick={() => handleEditClick(refaccion.id)}
                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteClick(refaccion.id)}
                        className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Borrar
                      </button>
                    </div>
                  </div>

                  {/* Footer with status */}
                  <div className={`px-6 py-3 ${
                    refaccion.stock > 2 ? 'bg-green-900/30' : 
                    refaccion.stock > 0 ? 'bg-yellow-900/30' : 
                    'bg-red-900/30'
                  }`}>
                    <p className={`text-sm font-semibold text-center ${
                      refaccion.stock > 2 ? 'text-green-400' : 
                      refaccion.stock > 0 ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {refaccion.stock > 2 ? '✓ Disponible' : 
                       refaccion.stock > 0 ? '⚠ Stock Bajo' : 
                       '✗ Sin Stock'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

