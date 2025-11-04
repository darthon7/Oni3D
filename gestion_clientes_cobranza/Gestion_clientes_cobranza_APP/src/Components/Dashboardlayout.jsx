import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
// 1. IMPORTA TUS 3 SIDEBARS (en lugar del 'Sidebar' genérico)
import Sidebar from './Sidebar';
import VentasSidebar from './VentasSidebar';
import SidebarMantemiento from './SidebarMantenimiento';

// 2. IMPORTA EL CONTEXTO DE AUTENTICACIÓN
import { useAuth } from '../context/AuthContext'; // Asegúrate que la ruta sea correcta

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 3. OBTÉN EL USUARIO Y EL ESTADO DE CARGA
  const { user, loading } = useAuth();

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
    <div className="min-h-screen bg-gray-50">
      {/* Navbar fija en la parte superior */}
      {/* Pasa el 'user' al Navbar para que pueda mostrar el nombre de usuario o botón de logout */}
      <Navbar toggleSidebar={toggleSidebar} user={user} />
      
      {/* 5. RENDERIZA LA SIDEBAR DINÁMICAMENTE */}
      {renderSidebar()}
      
      {/* Contenido principal */}
      <main className={`
        pt-16 transition-all duration-300 min-h-screen
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
        bg-white border-t border-gray-200 transition-all duration-300
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