import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
// 1. IMPORTA TUS 3 SIDEBARS (en lugar del 'Sidebar' genérico)
import Sidebar from './Sidebar';
import VentasSidebar from './VentasSidebar';
import SidebarMantemiento from './SidebarMantenimiento';

// 2. IMPORTA EL CONTEXTO DE AUTENTICACIÓN
import { useAuth } from '../context/AuthContext'; // Asegúrate que la ruta sea correcta

// === ESTILOS PARA ANIMACIONES DE PARTÍCULAS ===
const particleStyles = `
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

  .particle {
    position: absolute;
    pointer-events: none;
  }

  .particle-dot {
    animation: float-particles linear forwards;
  }
`;

// === COMPONENTE DE PARTÍCULAS FLOTANTES ===
const FloatingParticles = ({ count = 20 }) => {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: 8 + Math.random() * 4,
    size: 2 + Math.random() * 4,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 3. OBTÉN EL USUARIO Y EL ESTADO DE CARGA
  const { user, loading } = useAuth();

  // Inyectar estilos de partículas
  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.textContent = particleStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // 4. FUNCIÓN PARA RENDERIZAR LA SIDEBAR CORRECTA
  const renderSidebar = () => {
    // Mientras carga o no hay usuario, muestra un loader o nada
    if (loading || !user) {
      return (
        <div className="lg:w-64">
          {/* Puedes poner un spinner aquí */}
        </div>
      );
    }

    // Pasa las props 'isOpen' y 'closeSidebar' a la sidebar que corresponda
    switch (user.tipoCuenta) {
      case 'ADMINISTRADOR':
        return <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />;
      case 'VENTAS':
        return <VentasSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />;
      case 'MANTENIMIENTO':
        return <SidebarMantemiento isOpen={sidebarOpen} closeSidebar={closeSidebar} />;
      default:
        // Por defecto, mostramos la de Ventas (o la que prefieras)
        return <VentasSidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* PARTÍCULAS FLOTANTES DE FONDO */}
      <FloatingParticles count={25} />

      {/* GRADIENTES DECORATIVOS DE FONDO */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 8s ease-in-out infinite' }} />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '2s' }} />
      </div>

      {/* Navbar fija en la parte superior */}
      {/* Pasa el 'user' al Navbar para que pueda mostrar el nombre de usuario o botón de logout */}
      <Navbar toggleSidebar={toggleSidebar} user={user} />
      
      {/* 5. RENDERIZA LA SIDEBAR DINÁMICAMENTE */}
      {renderSidebar()}
      
      {/* Contenido principal */}
      <main className={`
        pt-16 transition-all duration-300 min-h-screen relative z-10
        lg:ml-64
      `}>
        {/* Restaurando el contenido original que incluye el Outlet */}
        <div className="p-6">
          {/* Aquí se renderizan las páginas mediante Outlet */}
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className={`
        bg-white/80 backdrop-blur-sm border-t border-gray-200 transition-all duration-300 relative z-10
        lg:ml-64
      `}>
        <div className="px-6 py-4">
          <div className="text-sm text-gray-500 text-center lg:text-left">
            © {new Date().getFullYear()} ONI3D — Todos los derechos reservados
          </div>
        </div>
      </footer>
    </div>
  );
}