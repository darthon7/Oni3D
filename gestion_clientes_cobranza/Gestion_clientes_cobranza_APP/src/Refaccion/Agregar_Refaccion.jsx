import React, { useState } from 'react';
import { Package, DollarSign, Box, Tag, FileText, Image, Upload, CheckCircle, XCircle, Save } from 'lucide-react';

export default function AgregarRefaccion() {
  const [formData, setFormData] = useState({
    nombre: '',
    marca: '',
    descripcion: '',
    precio: '',
    stock: '',
    imageFilename: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const API_URL = 'http://localhost:8080/api/refacciones';
  const IMAGE_API_URL = 'http://localhost:8080/api/imagenes';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Por favor selecciona un archivo de imagen válido' });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'La imagen no debe superar los 5MB' });
        return;
      }

      setImageFile(file);
      
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const filename = `refaccion_${timestamp}.${extension}`;
      setFormData(prev => ({
        ...prev,
        imageFilename: filename
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setMessage({ type: '', text: '' });
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({
      ...prev,
      imageFilename: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.marca.trim()) {
      newErrors.marca = 'La marca es requerida';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'El stock debe ser mayor o igual a 0';
    }

    if (!formData.imageFilename) {
      newErrors.imageFilename = 'Debes seleccionar una imagen';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadImage = async () => {
    if (!imageFile || !formData.imageFilename) {
      throw new Error('No hay imagen para subir');
    }

    const formDataImage = new FormData();
    formDataImage.append('image', imageFile);
    formDataImage.append('filename', formData.imageFilename);

    const response = await fetch(`${IMAGE_API_URL}/upload`, {
      method: 'POST',
      body: formDataImage
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al subir la imagen');
    }

    return await response.json();
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setMessage({ type: 'error', text: 'Por favor completa todos los campos correctamente' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Primero subir la imagen
      const imageUploadResult = await uploadImage();
      console.log('Imagen subida:', imageUploadResult);

      // Luego crear la refacción
      const refaccionData = {
        nombre: formData.nombre.trim(),
        marca: formData.marca.trim(),
        descripcion: formData.descripcion.trim(),
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        imageFilename: formData.imageFilename
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(refaccionData)
      });

      if (!response.ok) {
        throw new Error('Error al crear la refacción');
      }

      const result = await response.json();

      setMessage({ 
        type: 'success', 
        text: `¡Refacción creada exitosamente! ID: ${result.id}. Imagen: ${imageUploadResult.filename}` 
      });

      // Limpiar formulario
      setFormData({
        nombre: '',
        marca: '',
        descripcion: '',
        precio: '',
        stock: '',
        imageFilename: ''
      });
      removeImage();
      
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Error al crear la refacción. Intenta nuevamente.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      marca: '',
      descripcion: '',
      precio: '',
      stock: '',
      imageFilename: ''
    });
    removeImage();
    setErrors({});
    setMessage({ type: '', text: '' });
  };

  const formatCurrency = (value) => {
    if (!value) return '';
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Package className="w-10 h-10 text-blue-400" />
            Agregar Nueva Refacción
          </h1>
          <p className="text-slate-400">Completa todos los campos para registrar una nueva refacción</p>
        </div>

        {message.text && (
          <div className={`mb-6 px-6 py-4 rounded-lg border flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-900/50 border-green-700 text-green-200' 
              : 'bg-red-900/50 border-red-700 text-red-200'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-6 h-6 flex-shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 flex-shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}

        <div className="bg-slate-800 rounded-xl shadow-2xl p-8 border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Package className="w-5 h-5 text-blue-400" />
                Nombre
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                placeholder="Ej: Boquilla 0.2"
                className={`w-full px-4 py-3 bg-slate-700 text-white rounded-lg border ${
                  errors.nombre ? 'border-red-500' : 'border-slate-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`}
              />
              {errors.nombre && (
                <p className="text-red-400 text-sm mt-1">{errors.nombre}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Tag className="w-5 h-5 text-blue-400" />
                Marca
                <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                placeholder="Ej: BambuLab"
                className={`w-full px-4 py-3 bg-slate-700 text-white rounded-lg border ${
                  errors.marca ? 'border-red-500' : 'border-slate-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`}
              />
              {errors.marca && (
                <p className="text-red-400 text-sm mt-1">{errors.marca}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                Precio
                <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                placeholder="0.00"
                step="1"
                min="0"
                className={`w-full px-4 py-3 bg-slate-700 text-white rounded-lg border ${
                  errors.precio ? 'border-red-500' : 'border-slate-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`}
              />
              {formData.precio && (
                <p className="text-emerald-400 text-sm mt-1">
                  {formatCurrency(formData.precio)}
                </p>
              )}
              {errors.precio && (
                <p className="text-red-400 text-sm mt-1">{errors.precio}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Box className="w-5 h-5 text-purple-400" />
                Stock
                <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                min="0"
                className={`w-full px-4 py-3 bg-slate-700 text-white rounded-lg border ${
                  errors.stock ? 'border-red-500' : 'border-slate-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400`}
              />
              {errors.stock && (
                <p className="text-red-400 text-sm mt-1">{errors.stock}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <FileText className="w-5 h-5 text-green-400" />
                Descripción
                <span className="text-red-400">*</span>
              </label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                placeholder="Describe las características y especificaciones de la refacción..."
                rows="4"
                className={`w-full px-4 py-3 bg-slate-700 text-white rounded-lg border ${
                  errors.descripcion ? 'border-red-500' : 'border-slate-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-slate-400 resize-none`}
              />
              {errors.descripcion && (
                <p className="text-red-400 text-sm mt-1">{errors.descripcion}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-white font-semibold mb-2">
                <Image className="w-5 h-5 text-yellow-400" />
                Imagen
                <span className="text-red-400">*</span>
              </label>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="imageInput"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="imageInput"
                    className="cursor-pointer flex flex-col items-center gap-3"
                  >
                    <Upload className="w-12 h-12 text-slate-500" />
                    <div>
                      <p className="text-white font-semibold mb-1">
                        Haz clic para subir una imagen
                      </p>
                      <p className="text-slate-400 text-sm">
                        PNG, JPG o WEBP (máx. 5MB)
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-slate-600"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                  <div className="mt-2 text-sm text-slate-400">
                    <p>Nombre del archivo: <span className="text-white">{formData.imageFilename}</span></p>
                  </div>
                </div>
              )}
              
              {errors.imageFilename && (
                <p className="text-red-400 text-sm mt-1">{errors.imageFilename}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Guardar Refacción
                </>
              )}
            </button>

            <button
              onClick={limpiarFormulario}
              disabled={loading}
              className="px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="mt-6 bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <p className="text-blue-200 text-sm">
            <strong>📁 Ruta de guardado:</strong> Las imágenes se guardarán en <code className="bg-slate-800 px-2 py-1 rounded">./uploads/{formData.imageFilename || 'refaccion_timestamp.ext'}</code>
          </p>
        </div>
      </div>
    </div>
  );
}