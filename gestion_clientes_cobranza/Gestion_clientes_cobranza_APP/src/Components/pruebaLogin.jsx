import React, { useState, useEffect } from 'react';
// import print from '../assets/print.png'; // Eliminado: No se pueden importar assets locales
// Imports de lógica añadidos (del código 1)
import { useNavigate, Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext"; // Eliminado: Se reemplaza con un Mock

// --- Mock AuthContext ---
// Esto simula el AuthContext que no se puede importar en este entorno.
// Proporciona una lógica de login simulada para que el formulario funcione.
const useAuth = () => {
  const loginWithContext = async ({ usernameOrEmail, password }) => {
    // Simula un retraso de red
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Lógica de simulación:
    // Puedes probar con:
    // admin@oni.com / admin123  (Rol: ADMINISTRADOR)
    // ventas@oni.com / ventas123 (Rol: VENTAS)

    if (usernameOrEmail === "admin@oni.com" && password === "admin123") {
      return {
        success: true,
        usuario: {
          tipoCuenta: "ADMINISTRADOR",
          nombre: "Admin Oni",
        },
      };
    } else if (usernameOrEmail === "ventas@oni.com" && password === "ventas123") {
      return {
        success: true,
        usuario: {
          tipoCuenta: "VENTAS",
          nombre: "Vendedor Oni",
        },
      };
    } else {
      return {
        success: false,
        message: "Credenciales incorrectas (simulado)",
      };
    }
  };

  return { login: loginWithContext };
};
// --- Fin del Mock AuthContext ---


// --- Iconos SVG (del código 2, sin cambios) ---
const IconUser = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const IconLock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
  </svg>
);

const IconRocket = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const Icon3DPrint = () => (
  <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);
// --- FIN Iconos SVG ---


const AuthPage = () => {
  // --- Estados (Combinación de código 1 y 2) ---
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Estados de UI (del código 2)
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState('');
  const [mounted, setMounted] = useState(false);

  // --- Hooks de lógica (del código 1) ---
  const { login: loginWithContext } = useAuth();
  const navigate = useNavigate();

  // Efecto de UI (del código 2)
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- Manejador de cambios (del código 1) ---
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

  // --- Manejador de Submit (Lógica REAL del código 1) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // loginWithContext debería devolver la respuesta completa del backend,
      // incluyendo { success: true, usuario: { ... } }
      const result = await loginWithContext({
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
      });

      if (result?.success) {
        
        // --- NUEVA LÓGICA DE REDIRECCIÓN POR ROL ---
        
        // 1. Obtenemos el tipo de cuenta del objeto 'usuario' en la respuesta.
        const userRole = result.usuario?.tipoCuenta;

        // 2. Comparamos el rol y redirigimos
        if (userRole === 'ADMINISTRADOR') {
          // Si es Admin, lo mandamos al dashboard de administrador
          navigate("/", { replace: true });
        } else {
          // Si es VENTAS, MANTENIMIENTO o cualquier otro, va al dashboard principal
          navigate("/", { replace: true });
        }
        // --- FIN DE LA NUEVA LÓGICA ---

      } else {
        setError(result?.message || "Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };


  // --- Renderizado (JSX del código 2, sin cambios de estilo) ---
  return (
    <>
      {/* Estilos CSS-in-JS (del código 2, sin cambios) */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 30px rgba(6, 182, 212, 0.4); }
          50% { box-shadow: 0 0 60px rgba(6, 182, 212, 0.6); }
        }

        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(60px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        @keyframes border-glow {
          0%, 100% { border-color: rgba(6, 182, 212, 0.3); }
          50% { border-color: rgba(6, 182, 212, 0.8); }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient-shift 8s ease infinite;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animate-rotate-slow {
          animation: rotate-slow 20s linear infinite;
        }

        .animate-border-glow {
          animation: border-glow 2s ease-in-out infinite;
        }

        .glass-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(6, 182, 212, 0.2);
        }

        .glass-input {
          background: rgba(30, 41, 59, 0.6);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .input-glow:focus {
          box-shadow: 0 0 20px rgba(6, 182, 212, 0.3);
          border-color: rgb(6, 182, 212);
        }

        .btn-shimmer {
          background: linear-gradient(
            90deg,
            rgb(6, 182, 212) 0%,
            rgb(14, 165, 233) 50%,
            rgb(6, 182, 212) 100%
          );
          background-size: 200% auto;
        }

        .btn-shimmer:hover {
          animation: shimmer 2s linear infinite;
        }

        .mesh-bg {
          background-image: 
            radial-gradient(at 0% 0%, rgba(6, 182, 212, 0.15) 0px, transparent 50%),
            radial-gradient(at 50% 0%, rgba(14, 165, 233, 0.15) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(6, 182, 212, 0.15) 0px, transparent 50%);
        }

        .grid-pattern {
          background-image: 
            linear-gradient(rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(6, 182, 212, 0.05) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>

      <main className="flex min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden">
        {/* Panel Izquierdo - Promocional (del código 2, sin cambios) */}
        <section className={`hidden lg:flex flex-col justify-center items-center flex-1 text-white relative p-10 mesh-bg ${mounted ? 'animate-slide-in-left' : 'opacity-0'}`}>
          {/* Patrón de cuadrícula de fondo */}
          <div className="absolute inset-0 grid-pattern opacity-30" />

          {/* Elementos decorativos flotantes */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400 rounded-full opacity-20"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float ${5 + Math.random() * 10}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 5}s`
                }}
              />
            ))}
          </div>

          {/* Círculos decorativos grandes */}
          <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" style={{ animation: 'pulse-glow 4s ease-in-out infinite', animationDelay: '1s' }} />

          {/* Contenido central */}
          <div className="relative z-10 flex flex-col items-center space-y-8 max-w-lg">
            {/* Logo/Icono principal */}
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-2xl animate-pulse-glow" />
              <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 rounded-3xl border border-cyan-500/30 backdrop-blur-sm animate-float">
                <Icon3DPrint />
              </div>
            </div>

            {/* Imagen de impresora 3D */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <img
                src="https://placehold.co/320x320/083344/93c5fd?text=ONI+3D"
                alt="Impresión 3D"
                className="relative w-80 h-80 rounded-2xl object-cover border border-cyan-500/30 shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Overlay decorativo */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent rounded-2xl" />
            </div>

            {/* Texto promocional */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                ONI 3D
              </h2>
              <p className="text-xl text-cyan-300 font-semibold">
                Impresión 3D de Alta Calidad
              </p>
              <p className="text-gray-400 leading-relaxed max-w-md">
                Planifica tus actividades, controla tu progreso y transforma tus ideas en realidad con tecnología de punta
              </p>
            </div>

            {/* Features cards */}
            <div className="grid grid-cols-3 gap-4 w-full pt-4">
              {[
                { icon: '⚡', text: 'Rápido' },
                { icon: '🎯', text: 'Preciso' },
                { icon: '🚀', text: 'Innovador' }
              ].map((feature, idx) => (
                <div 
                  key={idx} 
                  className="glass-card p-4 rounded-xl hover:border-cyan-500/50 transform hover:scale-105 transition-all duration-300 cursor-pointer"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <p className="text-cyan-300 text-sm font-semibold">{feature.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Panel Derecho - Login (del código 2) */}
        <section className={`flex flex-1 flex-col justify-center items-center bg-slate-900 relative p-8 ${mounted ? 'animate-slide-in-right' : 'opacity-0'}`}>
          {/* Elementos decorativos de fondo */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '1s' }} />
          </div>

          {/* Card de Login */}
          <div className={`relative z-10 w-full max-w-md ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            {/* Resplandor del card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-xl opacity-20 animate-pulse-glow" />
            
            {/* Card principal */}
            <div className="relative glass-card rounded-3xl shadow-2xl overflow-hidden animate-border-glow">
              {/* Header del card con gradiente */}
              <div className="relative bg-gradient-to-r from-cyan-500 to-blue-500 p-8 overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                
                {/* Decoración superior */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 animate-rotate-slow" />
                
                <div className="relative z-10 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl transform hover:scale-110 transition-transform duration-300">
                      <IconRocket />
                    </div>
                  </div>
                  <h2 className="text-3xl font-black text-white mb-2">Bienvenido</h2>
                  <p className="text-cyan-100 text-sm font-medium">Inicia sesión en tu cuenta</p>
                </div>

                {/* Onda decorativa inferior */}
                <div className="absolute bottom-0 left-0 right-0">
                  <svg viewBox="0 0 1440 60" className="w-full h-6">
                    <path fill="rgba(15, 23, 42, 0.8)" d="M0,30 Q360,60 720,30 T1440,30 L1440,60 L0,60 Z" />
                  </svg>
                </div>
              </div>

              {/* Contenido del formulario */}
              <div className="p-8 space-y-6">
                
                {/* --- Mensaje de error --- 
                    Esto usará el estado 'error' poblado por la lógica del código 1
                */}
                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in-up">
                    <div className="flex items-center gap-3 text-red-400">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-sm">{error}</span>
                    </div>
                  </div>
                )}

                {/* --- Formulario ---
                    El 'onSubmit' ahora apunta a la lógica real del código 1
                */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Campo Usuario */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-400 flex items-center gap-2">
                      <IconUser className="w-4 h-4 text-cyan-400" />
                      Usuario o Email
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="usernameOrEmail"
                        value={formData.usernameOrEmail}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('usernameOrEmail')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder="usuario@ejemplo.com"
                        disabled={loading} // Controlado por la lógica
                        className="w-full pl-12 pr-4 py-4 glass-input border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500 font-medium input-glow"
                      />
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'usernameOrEmail' ? 'text-cyan-400' : 'text-gray-500'}`}>
                        <IconUser />
                      </div>
                    </div>
                  </div>

                  {/* Campo Contraseña */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-400 flex items-center gap-2">
                      <IconLock className="w-4 h-4 text-cyan-400" />
                      Contraseña
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField('')}
                        required
                        placeholder="••••••••"
                        disabled={loading} // Controlado por la lógica
                        className="w-full pl-12 pr-12 py-4 glass-input border-2 border-slate-700 rounded-xl focus:border-cyan-500 focus:outline-none transition-all duration-300 text-white placeholder-gray-500 font-medium input-glow"
                      />
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 ${focusedField === 'password' ? 'text-cyan-400' : 'text-gray-500'}`}>
                        <IconLock />
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors"
                      >
                        {showPassword ? <IconEyeOff /> : <IconEye />}
                      </button>
                    </div>
                  </div>

                  {/* Botón Submit */}
                  <button
                    type="submit"
                    disabled={loading} // Controlado por la lógica
                    className="relative w-full px-8 py-4 btn-shimmer text-white font-bold rounded-xl shadow-2xl overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Iniciando...</span>
                        </>
                      ) : (
                        <>
                          <span>Entrar</span>
                          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>

                  {/* Separador */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                    <span className="text-sm text-gray-500 font-medium">o</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                  </div>

                  {/* --- Link registro ---
                      Se reemplazó el <button> por <Link> del código 1,
                      manteniendo los estilos del código 2.
                  */}
                  <div className="text-center">
                    <p className="text-sm text-gray-400">
                      ¿No tienes cuenta?{" "}
                      <Link
                        to="/registro"
                        className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors hover:underline"
                      >
                        Regístrate aquí
                      </Link>
                    </p>
                  </div>
                </form>
              </div>

              {/* Footer del card (del código 2, sin cambios) */}
              <div className="bg-slate-950/50 border-t border-slate-800 p-4">
                <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-cyan-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Rápido</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright (del código 2, sin cambios) */}
          <div className="relative z-10 text-center mt-8 text-gray-600 text-sm font-medium">
            <p>© 2024 ONI 3D - Todos los derechos reservados</p>
          </div>
        </section>
      </main>
    </>
  );
};

export default AuthPage;