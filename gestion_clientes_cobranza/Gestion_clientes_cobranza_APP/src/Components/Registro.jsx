import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// Iconos SVG
const IconUser = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const IconMail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
    </svg>
);

const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
);

const IconUsers = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
    </svg>
);

const IconPhotograph = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
    </svg>
);

const IconAvatarPlaceholder = () => (
    <svg className="h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
);

const Registro = () => {
    const API_AUTH = import.meta.env.VITE_API_AUTH_URL || 'http://localhost:8080/api/auth';
    const API_FILES = import.meta.env.VITE_API_FILES_URL || 'http://localhost:8080/api/files';

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        tipoCuenta: 'VENTAS'
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setErrors(prev => ({...prev, [e.target.name]: '', general: ''}));
        setSuccess('');
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleFileChange = (event) => {
        setErrors(prev => ({...prev, file: '', general: ''}));
        setUploadError('');
        setImagePreviewUrl(null);

        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
             const maxSize = 5 * 1024 * 1024;
             if (file.size > maxSize) {
                 setErrors(prev => ({...prev, file: 'La imagen es muy grande (máx 5MB).'}));
                 setSelectedFile(null);
                 event.target.value = null;
                 return;
             }
            setSelectedFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setSelectedFile(null);
             if(file) setErrors(prev => ({...prev, file: 'Por favor, selecciona un archivo de imagen válido.'}));
        }
    };

    const handleImageUpload = async (fileToUpload) => {
        if (!fileToUpload) return null;

        setIsUploading(true);
        setUploadError('');
        const fileData = new FormData();
        fileData.append('file', fileToUpload);

        try {
            const response = await axios.post(`${API_FILES}/upload`, fileData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return response.data.filename;
        } catch (error) {
            const errorMsg = `Error al subir imagen: ${error.response?.data?.error || error.message}`;
            setUploadError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setIsUploading(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (formData.username.length < 3) newErrors.username = 'El username debe tener al menos 3 caracteres';
        if (!formData.email.includes('@')) newErrors.email = 'Ingresa un email válido';
        if (formData.password.length < 4) newErrors.password = 'La contraseña debe tener al menos 4 caracteres';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
        if (!formData.tipoCuenta) newErrors.tipoCuenta = 'Debes seleccionar un tipo de cuenta.';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); setSuccess(''); setUploadError('');

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }

        setLoading(true);

        let uploadedFilename = null;
        try {
            if (selectedFile) {
                uploadedFilename = await handleImageUpload(selectedFile);
            }

            const registrationData = new FormData();
            registrationData.append('username', formData.username);
            registrationData.append('email', formData.email);
            registrationData.append('password', formData.password);
            registrationData.append('tipoCuenta', formData.tipoCuenta);
            if (uploadedFilename) {
                registrationData.append('profileImageFilename', uploadedFilename);
            }

            const response = await axios.post(`${API_AUTH}/registro`, registrationData);

            const data = response.data;
            if (data.success) {
                setSuccess('¡Usuario registrado exitosamente! Redirigiendo...');
                setFormData({ username: '', email: '', password: '', confirmPassword: '', tipoCuenta: 'VENTAS' });
                setSelectedFile(null);
                setImagePreviewUrl(null);
                const fileInput = document.getElementById('file-upload');
                if (fileInput) fileInput.value = null;
                
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setErrors({ general: data.message || 'Error desconocido en el registro.' });
            }

        } catch (error) {
            console.error('Error en handleSubmit:', error);
            const errorMsg = uploadError || 
                             error.response?.data?.message || 
                             error.message || 
                             'Error de conexión o durante el registro.';
            setErrors({ general: errorMsg });
        } finally {
            setLoading(false);
            setIsUploading(false);
        }
    };

    return (
        <>
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                
                @keyframes gradient-shift {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                @keyframes shimmer {
                    0% { background-position: -1000px 0; }
                    100% { background-position: 1000px 0; }
                }
                
                .gradient-animated {
                    background-size: 200% 200%;
                    animation: gradient-shift 8s ease infinite;
                }
            `}</style>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 overflow-hidden relative">
                {/* Elementos decorativos de fondo */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <motion.div
                        className="absolute top-20 right-20 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                        animate={{
                            x: [0, -100, 0],
                            y: [0, 100, 0],
                            scale: [1, 1.2, 1],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.div
                        className="absolute bottom-20 left-20 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -100, 0],
                            scale: [1, 1.3, 1],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
                    className="w-full max-w-2xl relative z-10"
                >
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
                        {/* Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 text-white"
                        >
                            <div className="flex items-center justify-center gap-4 mb-4">
                                <motion.div
                                    className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <IconUsers className="w-8 h-8" />
                                </motion.div>
                                <div className="text-center">
                                    <h2 className="text-3xl font-extrabold mb-1">Crear Cuenta</h2>
                                    <p className="text-blue-100 text-sm font-medium">Únete a ONI 3D</p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contenido del formulario */}
                        <div className="p-8 md:p-10">
                            {/* Mensajes de estado */}
                            <AnimatePresence>
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: "auto" }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3 text-green-800">
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.1, type: "spring" }}
                                                className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                                            >
                                                <IconCheck className="w-5 h-5 text-white" />
                                            </motion.div>
                                            <span className="font-bold">{success}</span>
                                        </div>
                                    </motion.div>
                                )}
                                
                                {errors.general && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: "auto" }}
                                        exit={{ opacity: 0, y: -10, height: 0 }}
                                        className="mb-6 p-4 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl"
                                    >
                                        <div className="flex items-center gap-3 text-red-800">
                                            <svg className="w-5 h-5 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-semibold">{errors.general}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Sección Imagen de Perfil */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                        <IconPhotograph className="w-5 h-5 text-purple-600" />
                                        Imagen de Perfil (Opcional)
                                    </label>
                                    <div className="flex items-center gap-6 p-6 border-2 border-dashed border-gray-300 rounded-2xl bg-gradient-to-br from-gray-50 to-blue-50 hover:border-purple-400 transition-all duration-300">
                                        <motion.div
                                            className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden shrink-0 border-4 border-white shadow-lg"
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            {imagePreviewUrl ? (
                                                <motion.img
                                                    src={imagePreviewUrl}
                                                    alt="Vista previa"
                                                    className="w-full h-full object-cover"
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ type: "spring" }}
                                                />
                                            ) : (
                                                <IconAvatarPlaceholder />
                                            )}
                                        </motion.div>
                                        <div className="flex-grow">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                id="file-upload"
                                                className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-blue-500 file:to-purple-600 file:text-white hover:file:from-blue-600 hover:file:to-purple-700 cursor-pointer transition-all"
                                                disabled={loading || isUploading}
                                            />
                                            <AnimatePresence>
                                                {errors.file && (
                                                    <motion.p
                                                        initial={{ opacity: 0, y: -5 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0 }}
                                                        className="text-xs text-red-600 mt-2 font-semibold"
                                                    >
                                                        {errors.file}
                                                    </motion.p>
                                                )}
                                                {isUploading && (
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="text-xs text-blue-600 mt-2 font-semibold flex items-center gap-2"
                                                    >
                                                        <motion.div
                                                            className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        />
                                                        Subiendo imagen...
                                                    </motion.p>
                                                )}
                                                {uploadError && (
                                                    <motion.p
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        className="text-xs text-red-600 mt-2 font-semibold"
                                                    >
                                                        {uploadError}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                            {!selectedFile && !isUploading && !errors.file && (
                                                <p className="text-xs text-gray-500 mt-2">JPG, PNG, GIF (máx 5MB)</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Grid de campos */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Campo Username */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <label htmlFor="username" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <IconUser className="w-4 h-4 text-blue-600" />
                                            Nombre de Usuario
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="username"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                required
                                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400 font-medium ${
                                                    errors.username ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                                placeholder="Mínimo 3 caracteres"
                                                disabled={loading || isUploading}
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <IconUser />
                                            </div>
                                        </div>
                                        {errors.username && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs text-red-600 mt-1 font-semibold"
                                            >
                                                {errors.username}
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    {/* Campo Email */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.3 }}
                                    >
                                        <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <IconMail className="w-4 h-4 text-blue-600" />
                                            Email
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                                className={`w-full pl-12 pr-4 py-4 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400 font-medium ${
                                                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                                placeholder="tu@correo.com"
                                                disabled={loading || isUploading}
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <IconMail />
                                            </div>
                                        </div>
                                        {errors.email && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs text-red-600 mt-1 font-semibold"
                                            >
                                                {errors.email}
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    {/* Campo Contraseña */}
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 }}
                                    >
                                        <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <IconLock className="w-4 h-4 text-blue-600" />
                                            Contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400 font-medium ${
                                                    errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                                placeholder="Mínimo 4 caracteres"
                                                disabled={loading || isUploading}
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <IconLock />
                                            </div>
                                            <motion.button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {showPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </motion.button>
                                        </div>
                                        {errors.password && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs text-red-600 mt-1 font-semibold"
                                            >
                                                {errors.password}
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    {/* Campo Confirmar Contraseña */}
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <IconLock className="w-4 h-4 text-blue-600" />
                                            Confirmar Contraseña
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                                className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 placeholder-gray-400 font-medium ${
                                                    errors.confirmPassword ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                                                }`}
                                                placeholder="Repite la contraseña"
                                                disabled={loading || isUploading}
                                            />
                                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                                                <IconLock />
                                            </div>
                                            <motion.button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {showConfirmPassword ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                )}
                                            </motion.button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs text-red-600 mt-1 font-semibold"
                                            >
                                                {errors.confirmPassword}
                                            </motion.p>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Campo Tipo de Cuenta */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <label htmlFor="tipoCuenta" className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                        <IconUsers className="w-4 h-4 text-purple-600" />
                                        Tipo de Cuenta
                                    </label>
                                    <div className="relative">
                                        <select
                                            id="tipoCuenta"
                                            name="tipoCuenta"
                                            value={formData.tipoCuenta}
                                            onChange={handleChange}
                                            required
                                            className={`w-full pl-12 pr-12 py-4 border-2 rounded-xl shadow-sm focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 bg-white/50 backdrop-blur-sm text-gray-800 font-medium appearance-none cursor-pointer ${
                                                errors.tipoCuenta ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-purple-500'
                                            }`}
                                            disabled={loading || isUploading}
                                        >
                                            <option value="VENTAS">Ventas</option>
                                            <option value="ADMINISTRADOR">Administrador</option>
                                            <option value="MANTENIMIENTO">Mantenimiento</option>
                                        </select>
                                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <IconUsers />
                                        </div>
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                                            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.tipoCuenta && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-xs text-red-600 mt-1 font-semibold"
                                        >
                                            {errors.tipoCuenta}
                                        </motion.p>
                                    )}
                                </motion.div>

                                {/* Botón Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={loading || isUploading}
                                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                                    whileHover={{ scale: loading || isUploading ? 1 : 1.02 }}
                                    whileTap={{ scale: loading || isUploading ? 1 : 0.98 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        {loading ? (
                                            <>
                                                <motion.svg
                                                    className="animate-spin h-5 w-5"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </motion.svg>
                                                Registrando...
                                            </>
                                        ) : isUploading ? (
                                            <>
                                                <motion.div
                                                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                />
                                                Subiendo Imagen...
                                            </>
                                        ) : (
                                            <>
                                                Crear Cuenta
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                </svg>
                                            </>
                                        )}
                                    </span>
                                    {/* Efecto de brillo animado */}
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        animate={{
                                            x: ['-100%', '200%'],
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 1,
                                            ease: "easeInOut",
                                        }}
                                    />
                                </motion.button>

                                {/* Link a Login */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="text-center pt-4"
                                >
                                    <p className="text-sm text-gray-600">
                                        ¿Ya tienes cuenta?{" "}
                                        <Link
                                            to="/login"
                                            className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                                        >
                                            Inicia sesión aquí
                                        </Link>
                                    </p>
                                </motion.div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

export default Registro;
