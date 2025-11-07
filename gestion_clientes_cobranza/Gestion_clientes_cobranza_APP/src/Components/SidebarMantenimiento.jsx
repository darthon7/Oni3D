import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// --- Iconos (sin cambios) ---
import calculadoraIcon from '../assets/calculadoraIcon.png';
import settingsIcon from '../assets/settingsIcon.png';
import listIcon from '../assets/listIcon.png';
import alertIcon from '../assets/alertIcon.png';
import clientesIcon from '../assets/clientesIcon.png';
import addIcon from '../assets/addIcon.png';
import materialIcon from '../assets/materialIcon.png';
import homeIcon from '../assets/homeIcon.png';
import calendar from '../assets/calendar.png';
import pinturaIcon from '../assets/pinturaIcon.png';
import iaIcon from '../assets/iaIcon.png';
import VentasIcon from '../assets/ventasIcon.png';
import refaccionIcon from '../assets/refaccionIcon.png';
// --- Datos del menú (sin cambios) ---
const menuItems = [
    {
      section: "",
      items: [
        { path: "/", icon: homeIcon, label: "Inicio", type: "img" },
        { path: "/AIChat", icon: iaIcon, label: "IA", type: "img" },
      ]
    },
    

    {
      section: "Gestión",
      items: [
        { path: "/Listado_Impresoras", icon: pinturaIcon, label: "Impresoras", type: "img" },
        { path: "/Agregar_Impresora", icon: addIcon, label: "Agregar Impresora", type: "img" },
        { path: "/lista_material", icon: materialIcon, label: "Materiales", type: "img" },
        { path: "/agregar_material", icon: addIcon, label: "Agregar Material", type: "img" },
        { path: "/Listado_Pinturas", icon: pinturaIcon, label: "Pinturas", type: "img" },
        { path: "/Agregar_Pintura", icon: addIcon, label: "Agregar Pintura", type: "img" },
      ]
    },

    {
      section: "Refaccion",
      items: [
        { path: "/listado_Refaccion", icon: refaccionIcon, label: "Refacciones", type: "img" },
        { path: "/agregar_Refaccion", icon: addIcon, label: "Agregar Refaccion", type: "img" },
      ]
    },
];

// --- Variantes de animación para Framer Motion ---
const sidebarVariants = {
  open: {
    x: 0,
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  },
  closed: {
    x: '-100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 }
  }
};

const navItemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

export default function Sidebar({ isOpen, closeSidebar }) {
  
  // --- Clases de estilo mejoradas para el tema oscuro ---
  const linkClass = ({ isActive }) => 
    `flex items-center gap-4 px-4 py-3 mx-4 rounded-lg transition-all duration-300 ease-in-out transform hover:translate-x-2 ${
      isActive 
        ? 'bg-indigo-600 text-white font-semibold shadow-lg' 
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  const renderIcon = (item) => {
    // Se añade un filtro para que los iconos PNG se vean blancos
    const iconStyle = { filter: 'invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(200%) contrast(100%)' };
    
    if (item.type === "img") {
      return <img src={item.icon} alt={item.label} className="w-5 h-5" style={iconStyle} />;
    } else {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
        </svg>
      );
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-60 z-30 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar con animación */}
      <motion.aside 
        className="fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-2xl z-40"
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
      >
        <div className="overflow-y-auto h-full py-8">
          <div className="px-6 mb-8">
             <h2 className="text-2xl font-bold text-white">Tu Logo Aquí</h2>
          </div>

          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {section.section && (
                <div className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  {section.section}
                </div>
              )}
              {/* Contenedor de items con animación escalonada */}
              <motion.nav 
                className="space-y-1"
                initial="hidden"
                animate="visible"
                variants={{
                    visible: { transition: { staggerChildren: 0.05 } }
                }}
              >
                {section.items.map((item, itemIndex) => (
                  <motion.div key={itemIndex} variants={navItemVariants}>
                    <NavLink
                      to={item.path}
                      className={linkClass}
                      onClick={() => {
                        if (window.innerWidth < 1024) {
                          closeSidebar();
                        }
                      }}
                    >
                      {renderIcon(item)}
                      <span>{item.label}</span>
                    </NavLink>
                  </motion.div>
                ))}
              </motion.nav>
            </div>
          ))}
        </div>
      </motion.aside>
    </>
  );
}