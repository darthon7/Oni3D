import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

// === ESTILOS GLOBALES PARA ANIMACIONES ===
const animationStyles = `
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-20px);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(34, 211, 238, 0.5), inset 0 0 20px rgba(34, 211, 238, 0.1);
    }
    50% {
      box-shadow: 0 0 40px rgba(34, 211, 238, 0.8), inset 0 0 30px rgba(34, 211, 238, 0.2);
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes bounce-in {
    0% {
      opacity: 0;
      transform: scale(0.3);
    }
    50% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }

  @keyframes glow-pulse {
    0%, 100% {
      text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
    }
    50% {
      text-shadow: 0 0 20px rgba(34, 211, 238, 1), 0 0 30px rgba(59, 130, 246, 0.8);
    }
  }

  @keyframes float-particles {
    0% {
      transform: translateY(0) translateX(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateY(-100vh) translateX(100px);
      opacity: 0;
    }
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  @keyframes checkmark {
    0% {
      transform: scale(0) rotate(-45deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(10deg);
    }
    100% {
      transform: scale(1) rotate(0);
      opacity: 1;
    }
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .animate-slide-in-left {
    animation: slideInLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .animate-slide-in-right {
    animation: slideInRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .animate-fade-in-up {
    animation: fadeInUp 0.6s ease-out forwards;
  }

  .animate-float {
    animation: float 6s ease-in-out infinite;
  }

  .animate-pulse-glow {
    animation: pulse-glow 3s ease-in-out infinite;
  }

  .animate-shimmer {
    background: linear-gradient(90deg, #0f172a, #06b6d4, #0f172a);
    background-size: 1000px 100%;
    animation: shimmer 3s infinite;
  }

  .animate-bounce-in {
    animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .animate-glow-pulse {
    animation: glow-pulse 2s ease-in-out infinite;
  }

  .glass-card {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(34, 211, 238, 0.2);
  }

  .glass-input {
    background: rgba(30, 41, 59, 0.5);
    backdrop-filter: blur(10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .glass-input:focus {
    background: rgba(30, 41, 59, 0.8);
    box-shadow: 0 0 20px rgba(34, 211, 238, 0.3), inset 0 0 10px rgba(34, 211, 238, 0.1);
  }

  .btn-shimmer {
    background: linear-gradient(90deg, #06b6d4, #3b82f6, #06b6d4);
    background-size: 200% 100%;
    animation: shimmer 3s infinite;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .btn-shimmer:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(34, 211, 238, 0.4);
  }

  .btn-shimmer:active:not(:disabled) {
    transform: translateY(0);
  }

  .btn-shimmer:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .mesh-bg {
    background-image: 
      linear-gradient(0deg, transparent 24%, rgba(34, 211, 238, 0.05) 25%, rgba(34, 211, 238, 0.05) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.05) 75%, rgba(34, 211, 238, 0.05) 76%, transparent 77%, transparent),
      linear-gradient(90deg, transparent 24%, rgba(34, 211, 238, 0.05) 25%, rgba(34, 211, 238, 0.05) 26%, transparent 27%, transparent 74%, rgba(34, 211, 238, 0.05) 75%, rgba(34, 211, 238, 0.05) 76%, transparent 77%, transparent);
    background-size: 50px 50px;
  }

  .grid-pattern {
    background-image: 
      linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .particle-dot {
    animation: float-particles linear forwards;
  }

  .input-wrapper {
    position: relative;
    overflow: hidden;
  }

  .input-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(34, 211, 238, 0.2), transparent);
    transition: left 0.5s;
    pointer-events: none;
  }

  .input-wrapper:focus-within::before {
    left: 100%;
  }

  .error-shake {
    animation: shake 0.5s ease-in-out;
  }

  .success-check {
    animation: checkmark 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .label-float {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .icon-spin {
    animation: spin 1s linear infinite;
  }
`;

// === ICONOS SVG ===
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

const IconEye = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const IconEyeOff = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59M12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411L21 21" />
    </svg>
);

const IconSpinner = () => (
    <svg className="w-5 h-5 icon-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
    </svg>
);

// === COMPONENTE DE PARTÍCULAS FLOTANTES ===
const FloatingParticles = ({ count = 15 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle-dot absolute rounded-full bg-gradient-to-b from-cyan-400 to-blue-500"
          style={{
            left: `${particle.left}%`,
            bottom: '-10px',
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animation: `float-particles ${particle.duration}s linear infinite`,
            animationDelay: `${particle.delay}s`,
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
};

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
    const [focusedField, setFocusedField] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        // Inyectar estilos de animación
        const styleSheet = document.createElement('style');
        styleSheet.textContent = animationStyles;
        document.head.appendChild(styleSheet);
        return () => document.head.removeChild(styleSheet);
    }, []);

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
        <main className="flex min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden relative">
            {/* FONDO ANIMADO CON GRADIENTES */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }} />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '2s' }} />
            </div>

            {/* PARTÍCULAS DE FONDO */}
            <FloatingParticles count={15} />

            <div className="relative z-10 w-full flex items-center justify-center p-8">
                <div className="w-full max-w-2xl">
                    {/* TARJETA PRINCIPAL CON EFECTO GLOW */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
                        
                        <div className="relative glass-card rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">
                            {/* HEADER CON GRADIENTE ANIMADO */}
                            <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 p-8 overflow-hidden">
                                <div className="absolute inset-0 opacity-20 animate-shimmer" />
                                <div className="relative text-center space-y-3">
                                    <h2 className="text-4xl font-black text-white drop-shadow-lg">
                                        Crear Cuenta
                                    </h2>
                                    <p className="text-cyan-100 text-sm font-medium">
                                        Únete a ONI 3D
                                    </p>
                                </div>
                            </div>

                            {/* CONTENIDO DEL FORMULARIO */}
                            <div className="p-8 space-y-6">
                                {/* MENSAJE DE ÉXITO CON ANIMACIÓN */}
                                {success && (
                                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl animate-fade-in-up">
                                        <div className="flex items-center gap-3 text-green-400">
                                            <svg className="w-5 h-5 flex-shrink-0 success-check" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-semibold text-sm">{success}</span>
                                        </div>
                                    </div>
                                )}

                                {/* MENSAJE DE ERROR CON ANIMACIÓN */}
                                {errors.general && (
                                    <div className={`p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in-up ${errors.general ? 'error-shake' : ''}`}>
                                        <div className="flex items-center gap-3 text-red-400">
                                            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-semibold text-sm">{errors.general}</span>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* SECCIÓN IMAGEN DE PERFIL */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 }}
                                    >
                                        <label className="block text-sm font-bold text-cyan-300 mb-3 flex items-center gap-2">
                                            <IconPhotograph className="w-5 h-5" />
                                            Imagen de Perfil (Opcional)
                                        </label>
                                        <div className="flex items-center gap-6 p-6 border-2 border-dashed border-cyan-500/30 rounded-2xl bg-gradient-to-br from-slate-800 to-blue-900/30 hover:border-cyan-400 transition-all duration-300">
                                            <motion.div
                                                className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center overflow-hidden shrink-0 border-4 border-cyan-500/30 shadow-lg"
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
                                                    className="block w-full text-sm text-cyan-300 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-cyan-500 file:to-blue-500 file:text-white hover:file:from-cyan-400 hover:file:to-blue-400 cursor-pointer transition-all"
                                                    disabled={loading || isUploading}
                                                />
                                                <AnimatePresence>
                                                    {errors.file && (
                                                        <motion.p
                                                            initial={{ opacity: 0, y: -5 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            exit={{ opacity: 0 }}
                                                            className="text-xs text-red-400 mt-2 font-semibold"
                                                        >
                                                            {errors.file}
                                                        </motion.p>
                                                    )}
                                                    {isUploading && (
                                                        <motion.p
                                                            initial={{ opacity: 0 }}
                                                            animate={{ opacity: 1 }}
                                                            exit={{ opacity: 0 }}
                                                            className="text-xs text-cyan-400 mt-2 font-semibold flex items-center gap-2"
                                                        >
                                                            <motion.div
                                                                className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"
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
                                                            className="text-xs text-red-400 mt-2 font-semibold"
                                                        >
                                                            {uploadError}
                                                        </motion.p>
                                                    )}
                                                </AnimatePresence>
                                                {!selectedFile && !isUploading && !errors.file && (
                                                    <p className="text-xs text-cyan-400/60 mt-2">JPG, PNG, GIF (máx 5MB)</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>

                                    {/* GRID DE CAMPOS */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {/* CAMPO USERNAME */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="space-y-2 animate-fade-in-up"
                                            style={{ animationDelay: '0.2s' }}
                                        >
                                            <label className="block text-sm font-bold text-cyan-300 flex items-center gap-2 label-float">
                                                <IconUser /> Nombre de Usuario
                                            </label>
                                            <div className="input-wrapper relative group">
                                                <input
                                                    type="text"
                                                    id="username"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('username')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    placeholder="Mínimo 3 caracteres"
                                                    disabled={loading || isUploading}
                                                    className={`w-full pl-12 pr-4 py-4 glass-input border-2 rounded-xl text-white placeholder-gray-500 transition-all duration-300 ${
                                                        focusedField === 'username' 
                                                            ? 'border-cyan-400 bg-cyan-500/5' 
                                                            : 'border-slate-700 hover:border-slate-600'
                                                    }`}
                                                />
                                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'username' ? 'text-cyan-400' : 'text-gray-500'}`}>
                                                    <IconUser />
                                                </div>
                                            </div>
                                            {errors.username && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-xs text-red-400 mt-1 font-semibold"
                                                >
                                                    {errors.username}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        {/* CAMPO EMAIL */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="space-y-2 animate-fade-in-up"
                                            style={{ animationDelay: '0.3s' }}
                                        >
                                            <label className="block text-sm font-bold text-cyan-300 flex items-center gap-2 label-float">
                                                <IconMail /> Email
                                            </label>
                                            <div className="input-wrapper relative group">
                                                <input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('email')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    placeholder="tu@correo.com"
                                                    disabled={loading || isUploading}
                                                    className={`w-full pl-12 pr-4 py-4 glass-input border-2 rounded-xl text-white placeholder-gray-500 transition-all duration-300 ${
                                                        focusedField === 'email' 
                                                            ? 'border-cyan-400 bg-cyan-500/5' 
                                                            : 'border-slate-700 hover:border-slate-600'
                                                    }`}
                                                />
                                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'email' ? 'text-cyan-400' : 'text-gray-500'}`}>
                                                    <IconMail />
                                                </div>
                                            </div>
                                            {errors.email && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-xs text-red-400 mt-1 font-semibold"
                                                >
                                                    {errors.email}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        {/* CAMPO CONTRASEÑA */}
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="space-y-2 animate-fade-in-up"
                                            style={{ animationDelay: '0.4s' }}
                                        >
                                            <label className="block text-sm font-bold text-cyan-300 flex items-center gap-2 label-float">
                                                <IconLock /> Contraseña
                                            </label>
                                            <div className="input-wrapper relative group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    id="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('password')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    placeholder="Mínimo 4 caracteres"
                                                    disabled={loading || isUploading}
                                                    className={`w-full pl-12 pr-12 py-4 glass-input border-2 rounded-xl text-white placeholder-gray-500 transition-all duration-300 ${
                                                        focusedField === 'password' 
                                                            ? 'border-cyan-400 bg-cyan-500/5' 
                                                            : 'border-slate-700 hover:border-slate-600'
                                                    }`}
                                                />
                                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'password' ? 'text-cyan-400' : 'text-gray-500'}`}>
                                                    <IconLock />
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowPassword(!showPassword)} 
                                                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'password' ? 'text-cyan-400' : 'text-gray-500 hover:text-cyan-400'}`}
                                                >
                                                    {showPassword ? <IconEyeOff /> : <IconEye />}
                                                </button>
                                            </div>
                                            {errors.password && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-xs text-red-400 mt-1 font-semibold"
                                                >
                                                    {errors.password}
                                                </motion.p>
                                            )}
                                        </motion.div>

                                        {/* CAMPO CONFIRMAR CONTRASEÑA */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="space-y-2 animate-fade-in-up"
                                            style={{ animationDelay: '0.5s' }}
                                        >
                                            <label className="block text-sm font-bold text-cyan-300 flex items-center gap-2 label-float">
                                                <IconLock /> Confirmar Contraseña
                                            </label>
                                            <div className="input-wrapper relative group">
                                                <input
                                                    type={showConfirmPassword ? "text" : "password"}
                                                    id="confirmPassword"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleChange}
                                                    onFocus={() => setFocusedField('confirmPassword')}
                                                    onBlur={() => setFocusedField(null)}
                                                    required
                                                    placeholder="Repite la contraseña"
                                                    disabled={loading || isUploading}
                                                    className={`w-full pl-12 pr-12 py-4 glass-input border-2 rounded-xl text-white placeholder-gray-500 transition-all duration-300 ${
                                                        focusedField === 'confirmPassword' 
                                                            ? 'border-cyan-400 bg-cyan-500/5' 
                                                            : 'border-slate-700 hover:border-slate-600'
                                                    }`}
                                                />
                                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'text-cyan-400' : 'text-gray-500'}`}>
                                                    <IconLock />
                                                </div>
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                                    className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'confirmPassword' ? 'text-cyan-400' : 'text-gray-500 hover:text-cyan-400'}`}
                                                >
                                                    {showConfirmPassword ? <IconEyeOff /> : <IconEye />}
                                                </button>
                                            </div>
                                            {errors.confirmPassword && (
                                                <motion.p
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-xs text-red-400 mt-1 font-semibold"
                                                >
                                                    {errors.confirmPassword}
                                                </motion.p>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* CAMPO TIPO DE CUENTA */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6 }}
                                        className="animate-fade-in-up"
                                        style={{ animationDelay: '0.6s' }}
                                    >
                                        <label className="block text-sm font-bold text-cyan-300 flex items-center gap-2 label-float">
                                            <IconUsers /> Tipo de Cuenta
                                        </label>
                                        <div className="input-wrapper relative group">
                                            <select
                                                id="tipoCuenta"
                                                name="tipoCuenta"
                                                value={formData.tipoCuenta}
                                                onChange={handleChange}
                                                onFocus={() => setFocusedField('tipoCuenta')}
                                                onBlur={() => setFocusedField(null)}
                                                required
                                                disabled={loading || isUploading}
                                                className={`w-full pl-12 pr-12 py-4 glass-input border-2 rounded-xl text-white transition-all duration-300 appearance-none cursor-pointer ${
                                                    focusedField === 'tipoCuenta' 
                                                        ? 'border-cyan-400 bg-cyan-500/5' 
                                                        : 'border-slate-700 hover:border-slate-600'
                                                }`}
                                            >
                                                <option value="VENTAS">Ventas</option>
                                                <option value="ADMINISTRADOR">Administrador</option>
                                                <option value="MANTENIMIENTO">Mantenimiento</option>
                                            </select>
                                            <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none ${focusedField === 'tipoCuenta' ? 'text-cyan-400' : 'text-gray-500'}`}>
                                                <IconUsers />
                                            </div>
                                            <div className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 pointer-events-none ${focusedField === 'tipoCuenta' ? 'text-cyan-400' : 'text-gray-500'}`}>
                                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                        </div>
                                        {errors.tipoCuenta && (
                                            <motion.p
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-xs text-red-400 mt-1 font-semibold"
                                            >
                                                {errors.tipoCuenta}
                                            </motion.p>
                                        )}
                                    </motion.div>

                                    {/* BOTÓN SUBMIT CON ANIMACIÓN */}
                                    <button 
                                        type="submit" 
                                        disabled={loading || isUploading} 
                                        className="w-full px-8 py-4 btn-shimmer text-white font-bold rounded-xl shadow-2xl relative overflow-hidden group animate-fade-in-up transition-all duration-300"
                                        style={{ animationDelay: '0.7s' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                                        <div className="relative flex items-center justify-center gap-2">
                                            {loading ? (
                                                <>
                                                    <IconSpinner />
                                                    <span>Registrando...</span>
                                                </>
                                            ) : isUploading ? (
                                                <>
                                                    <motion.div
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    />
                                                    <span>Subiendo Imagen...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Crear Cuenta</span>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                                    </svg>
                                                </>
                                            )}
                                        </div>
                                    </button>

                                    {/* ENLACE DE LOGIN */}
                                    <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.8s' }}>
                                        <p className="text-sm text-gray-400">
                                            ¿Ya tienes cuenta?{" "}
                                            <Link 
                                                to="/login" 
                                                className="font-bold text-cyan-400 hover:text-cyan-300 underline transition-colors duration-300 hover:drop-shadow-lg"
                                            >
                                                Inicia sesión aquí
                                            </Link>
                                        </p>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Registro;
