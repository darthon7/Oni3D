import React from 'react';
import { NavLink } from 'react-router-dom';
import calculadoraIcon from '../assets/calculadoraIcon.png';
import settingsIcon from '../assets/settingsIcon.png';
import listIcon from '../assets/listIcon.png';
import alertIcon from '../assets/alertIcon.png';
import clientesIcon from '../assets/clientesIcon.png';
import addIcon from '../assets/addIcon.png';
import materialIcon from '../assets/materialIcon.png';
import homeIcon from '../assets/homeIcon.png';

const menuItems = [
{
    section: "",
    items: [
      { path: "/", 
        icon: homeIcon, 
        label: "Inicio",
        type: "img" },


      { path: "/Calculadora", 
        icon: calculadoraIcon, 
        label: "Calculadora", 
        type: "img" },
      
      { path: "/AgregarAlerta", 
        icon: alertIcon, 
        label: "AgregarAlerta",
        type: "img"
      },

    ]
  },
  
  // ... Seccion cientes ...

  {
    section: "Clientes",
    items: [
      { path: "/listado", 
        icon: clientesIcon, 
        label: "Clientes",
        type: "img" },

      { path: "/agregar", 
        icon: addIcon, 
        label: "Agregar Cliente", 
        type: "img" },
    ]
  },
   
  // ... secciones existentes ...
  {
    section: "Productos",
    items: [
      { path: "/Listado_Productos", 
        icon: listIcon, 
        label: "Lista de productos",
        type: "img" }
    ]
  },
  

  
];
export default function Sidebar({ isOpen, closeSidebar }) {
  const linkClass = ({ isActive }) => 
    `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:border-r-4 hover:border-blue-600 transition-all duration-200 ${
      isActive ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600 font-semibold' : ''
    }`;

  // Función para renderizar el icono según el tipo
  const renderIcon = (item) => {
    if (item.type === "img") {
      // Para imágenes PNG
      return <img src={item.icon} alt={item.label} className="w-5 h-5" />;
    } else {
      // Para iconos SVG (por defecto)
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
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg transform transition-transform duration-300 z-40
        ${isOpen ? 'translate-x-0' : '-translate-x-0'}
        lg:translate-x-0
      `}>
        <div className="overflow-y-auto h-full py-4">
          {menuItems.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-6">
              {section.section && (
                <div className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.section}
                </div>
              )}
              <nav className="space-y-1">
                {section.items.map((item, itemIndex) => (
                  <NavLink
                    key={itemIndex}
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
                ))}
              </nav>
            </div>
          ))}

         
        </div>
      </aside>
    </>
  );
}