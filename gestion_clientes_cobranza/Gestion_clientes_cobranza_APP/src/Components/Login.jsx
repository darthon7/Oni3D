import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import print from '../assets/print.png';

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

  @keyframes rotate-gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
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

  @keyframes input-focus-glow {
    0% {
      box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4);
    }
    100% {
      box-shadow: 0 0 0 8px rgba(34, 211, 238, 0);
    }
  }

  @keyframes button-pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.02);
    }
  }

  @keyframes text-shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
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

  .animate-rotate-gradient {
    background-size: 200% 200%;
    animation: rotate-gradient 8s ease infinite;
  }

  .animate-bounce-in {
    animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .animate-glow-pulse {
    animation: glow-pulse 2s ease-in-out infinite;
  }

  .animate-input-focus {
    animation: input-focus-glow 0.6s ease-out;
  }

  .animate-button-pulse {
    animation: button-pulse 2s ease-in-out infinite;
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

  .particle {
    position: absolute;
    pointer-events: none;
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

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .success-check {
    animation: checkmark 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
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

  .label-float {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .icon-spin {
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// === ICONOS SVG ===
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59M12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411L21 21" />
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

const IconCheck = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
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

// === COMPONENTE PRINCIPAL ===
const AuthPage = () => {
  const [formData, setFormData] = useState({ usernameOrEmail: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login: loginWithContext } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
    // Inyectar estilos de animación
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
  }, [error]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await loginWithContext({
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
      });

      if (result?.success) {
        navigate('/', { replace: true });
      } else {
        setError(result?.message || 'Credenciales incorrectas');
      }
    } catch (err) {
      console.error('Error en login:', err);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  }, [formData, loginWithContext, navigate]);

  return (
    <main className="flex min-h-screen w-full bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 overflow-hidden relative">
      {/* FONDO ANIMADO CON GRADIENTES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '2s' }} />
      </div>

      {/* PANEL IZQUIERDO */}
      <section className={`hidden lg:flex flex-col justify-center items-center flex-1 text-white relative p-10 mesh-bg ${mounted ? 'animate-slide-in-left' : 'opacity-0'}`}>
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <FloatingParticles count={20} />
        
        <div className="relative z-10 flex flex-col items-center space-y-8 max-w-lg">
          {/* ICONO ANIMADO */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl blur-2xl opacity-0 group-hover:opacity-75 transition-opacity duration-500" />
            <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-8 rounded-3xl border border-cyan-500/30 backdrop-blur-sm animate-float hover:animate-pulse">
              <Icon3DPrint />
            </div>
          </div>

          {/* IMAGEN CON EFECTO */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            <img 
              src={print} 
              alt="Impresión 3D" 
              className="w-80 h-80 rounded-2xl object-cover border-2 border-cyan-500/30 shadow-2xl relative z-10 hover:scale-105 transition-transform duration-500" 
              loading="lazy" 
            />
          </div>

          {/* TEXTO CON EFECTO GLOW */}
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 animate-glow-pulse">
              ONI 3D
            </h2>
            <p className="text-xl text-cyan-300 font-semibold opacity-80 hover:opacity-100 transition-opacity duration-300">
              Impresión 3D de Alta Calidad
            </p>
          </div>
        </div>
      </section>

      {/* PANEL DERECHO - LOGIN */}
      <section className={`flex flex-1 flex-col justify-center items-center bg-gradient-to-b from-slate-900 to-slate-950 relative p-8 ${mounted ? 'animate-slide-in-right' : 'opacity-0'}`}>
        {/* PARTÍCULAS DE FONDO */}
        <FloatingParticles count={10} />

        <div className="relative z-10 w-full max-w-md">
          {/* TARJETA PRINCIPAL CON EFECTO GLOW */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
            
            <div className="relative glass-card rounded-3xl shadow-2xl overflow-hidden animate-bounce-in">
              {/* HEADER CON GRADIENTE ANIMADO */}
              <div className="relative bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 p-8 overflow-hidden">
                <div className="absolute inset-0 opacity-20 animate-shimmer" />
                <div className="relative text-center space-y-3">
                  <div className="flex justify-center animate-bounce" style={{ animationDelay: '0s' }}>
                    <IconRocket />
                  </div>
                  <h2 className="text-4xl font-black text-white drop-shadow-lg">
                    Bienvenido
                  </h2>
                  <p className="text-cyan-100 text-sm font-medium">
                    Inicia sesión en tu cuenta
                  </p>
                </div>
              </div>

              {/* CONTENIDO DEL FORMULARIO */}
              <div className="p-8 space-y-6">
                {/* MENSAJE DE ERROR CON ANIMACIÓN */}
                {error && (
                  <div className={`p-4 bg-red-500/10 border border-red-500/30 rounded-xl animate-fade-in-up ${error ? 'error-shake' : ''}`}>
                    <div className="flex items-center gap-3 text-red-400">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="font-semibold text-sm">{error}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* CAMPO USUARIO */}
                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <label className="block text-sm font-bold text-gray-300 flex items-center gap-2 label-float">
                      <IconUser /> Usuario o Email
                    </label>
                    <div className="input-wrapper relative group">
                      <input
                        type="text"
                        name="usernameOrEmail"
                        value={formData.usernameOrEmail}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="usuario@ejemplo.com"
                        disabled={loading}
                        className={`w-full pl-12 pr-4 py-4 glass-input border-2 rounded-xl text-white placeholder-gray-500 transition-all duration-300 ${
                          focusedField === 'email' 
                            ? 'border-cyan-400 bg-cyan-500/5' 
                            : 'border-slate-700 hover:border-slate-600'
                        }`}
                      />
                      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${focusedField === 'email' ? 'text-cyan-400' : 'text-gray-500'}`}>
                        <IconUser />
                      </div>
                    </div>
                  </div>

                  {/* CAMPO CONTRASEÑA */}
                  <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <label className="block text-sm font-bold text-gray-300 flex items-center gap-2 label-float">
                      <IconLock /> Contraseña
                    </label>
                    <div className="input-wrapper relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                        required
                        placeholder="••••••••"
                        disabled={loading}
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
                  </div>

                  {/* BOTÓN SUBMIT CON ANIMACIÓN */}
                  <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full px-8 py-4 btn-shimmer text-white font-bold rounded-xl shadow-2xl relative overflow-hidden group animate-fade-in-up transition-all duration-300"
                    style={{ animationDelay: '0.3s' }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                    <div className="relative flex items-center justify-center gap-2">
                      {loading ? (
                        <>
                          <IconSpinner />
                          <span>Iniciando sesión...</span>
                        </>
                      ) : (
                        <span>Entrar</span>
                      )}
                    </div>
                  </button>

                  {/* ENLACE DE REGISTRO */}
                  <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <p className="text-sm text-gray-400">
                      ¿No tienes cuenta?{" "}
                      <Link 
                        to="/registro" 
                        className="font-bold text-cyan-400 hover:text-cyan-300 underline transition-colors duration-300 hover:drop-shadow-lg"
                      >
                        Regístrate aquí
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AuthPage;
