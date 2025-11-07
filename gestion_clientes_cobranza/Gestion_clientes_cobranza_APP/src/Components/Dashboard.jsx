import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// --- Iconos SVG ---
const IconSparkles = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L1.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.25 12L17 15.75l-1.25-3.75a4.5 4.5 0 00-3.09-3.09L9 7.875l3.75-1.125a4.5 4.5 0 003.09-3.09L17 0l1.25 3.75a4.5 4.5 0 003.09 3.09L25 7.875l-3.75 1.125a4.5 4.5 0 00-3.09 3.09z"
    />
  </svg>
);

const IconCalculator = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.25-4.5h.008v.008H10.5v-.008zm0 2.25h.008v.008H10.5v-.008zm0 2.25h.008v.008H10.5v-.008zm2.25-4.5h.008v.008H12.75v-.008zm0 2.25h.008v.008H12.75v-.008zm0 2.25h.008v.008H12.75v-.008zm2.25-4.5h.008v.008H15v-.008zm0 2.25h.008v.008H15v-.008zm0 2.25h.008v.008H15v-.008zM4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
    />
  </svg>
);

const IconUsers = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M18 18.72a9.094 9.094 0 00-12 0m12 0a9.094 9.094 0 01-12 0m12 0v.013M6 18.72v.013m6-11.94V9.75m-3.75 3.75h7.5"
    />
  </svg>
);

const IconCube = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
    />
  </svg>
);

const IconPaintBrush = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.388m5.043.025a15.994 15.994 0 011.622 3.388m-5.043-.025a15.998 15.998 0 003.388 1.62m-5.043.025a15.994 15.994 0 01-1.622-3.388"
    />
  </svg>
);

const IconClipboardList = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
    />
  </svg>
);

const IconSettings = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
    />
  </svg>
);

const IconPrinter = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a60.773 60.773 0 012.25-.243m-2.25.243v2.445m18.902-2.688h.006v.008h-.006v-.008zm-18.72.243h.009v.009h-.009v-.009zm13.6-2.556c.232.082.466.166.705.25m-12.423-.604b.75.75 0 11-1.5 0 .75.75 0 011.5 0zm13.065-13.812a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM5.25 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm15-1.368a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM4.5 8.25m12 2.25H3.75a2.25 2.25 0 00-2.25 2.25v4.5a2.25 2.25 0 002.25 2.25h16.5a2.25 2.25 0 002.25-2.25v-4.5a2.25 2.25 0 00-2.25-2.25z"
    />
  </svg>
);

const IconGear = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-8 h-8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.592c.55 0 1.02.398 1.11.94m-.213 9.526c.027.20.1.501.322 1.039.222.538.645.996 1.322 1.252.677.256 1.379.256 2.055 0 .677-.256 1.1-.714 1.322-1.252.222-.538.295-.839.322-1.039m-9.324 0c.027.20.1.501.322 1.039.222.538.645.996 1.322 1.252.677.256 1.379.256 2.055 0 .677-.256 1.1-.714 1.322-1.252.222-.538.295-.839.322-1.039M9 12.75c0-.338.029-.67.085-.995m-1.378 5.116a.75.75 0 00-.364.225m13.356-2.745a.75.75 0 00-.364-.225m0 0a.75.75 0 00-.728.221m0 0A60.407 60.407 0 0115.666 19.75a.75.75 0 00-.02-.25m0 0A60.407 60.407 0 0114.25 4m0 0a.75.75 0 01.02-.25.75.75 0 01.728-.221m0 0A60.408 60.408 0 0116.5 12.75m0 0a.75.75 0 00.364-.225"
    />
  </svg>
);

// Colores vibrantes por categoría
const colorSchemes = {
  IA: {
    gradient: "from-purple-500 via-pink-500 to-rose-500",
    bg: "bg-purple-50",
    hoverBg: "group-hover:bg-purple-500",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    shadow: "hover:shadow-purple-500/50",
  },
  Calculadora: {
    gradient: "from-blue-500 via-cyan-500 to-teal-500",
    bg: "bg-blue-50",
    hoverBg: "group-hover:bg-blue-500",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    shadow: "hover:shadow-blue-500/50",
  },
  Clientes: {
    gradient: "from-emerald-500 via-green-500 to-lime-500",
    bg: "bg-emerald-50",
    hoverBg: "group-hover:bg-emerald-500",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    shadow: "hover:shadow-emerald-500/50",
  },
  Material: {
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bg: "bg-amber-50",
    hoverBg: "group-hover:bg-amber-500",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    shadow: "hover:shadow-amber-500/50",
  },
  Pinturas: {
    gradient: "from-fuchsia-500 via-purple-500 to-indigo-500",
    bg: "bg-fuchsia-50",
    hoverBg: "group-hover:bg-fuchsia-500",
    iconBg: "bg-fuchsia-100",
    iconColor: "text-fuchsia-600",
    shadow: "hover:shadow-fuchsia-500/50",
  },
  Productos: {
    gradient: "from-sky-500 via-blue-500 to-indigo-500",
    bg: "bg-sky-50",
    hoverBg: "group-hover:bg-sky-500",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    shadow: "hover:shadow-sky-500/50",
  },
  Impresoras: {
    gradient: "from-cyan-500 via-blue-500 to-indigo-500",
    bg: "bg-cyan-50",
    hoverBg: "group-hover:bg-cyan-500",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    shadow: "hover:shadow-cyan-500/50",
  },
  Refacciones: {
    gradient: "from-teal-500 via-cyan-500 to-blue-500",
    bg: "bg-teal-50",
    hoverBg: "group-hover:bg-teal-500",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    shadow: "hover:shadow-teal-500/50",
  },
  Settings: {
    gradient: "from-slate-500 via-gray-500 to-zinc-500",
    bg: "bg-slate-50",
    hoverBg: "group-hover:bg-slate-500",
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    shadow: "hover:shadow-slate-500/50",
  },
};

const quickLinks = [
  {
    name: "IA",
    icon: <IconSparkles />,
    href: "/AIChat",
    description: "Asistente inteligente",
  },
  {
    name: "Calculadora",
    icon: <IconCalculator />,
    href: "/Calculadora",
    description: "Cálculadora de impresion 3D",
  },
  {
    name: "Clientes",
    icon: <IconUsers />,
    href: "/listado",
    description: "Lista de clientes",
  },
  {
    name: "Material",
    icon: <IconCube />,
    href: "/lista_material",
    description: "Inventario de materiales",
  },
  {
    name: "Pinturas",
    icon: <IconPaintBrush />,
    href: "/listado_pinturas",
    description: "Catálogo de pinturas",
  },
  {
    name: "Productos",
    icon: <IconClipboardList />,
    href: "/listado_productos",
    description: "Lista de productos",
  },
  {
    name: "Impresoras",
    icon: <IconPrinter />,
    href: "/Listado_Impresoras",
    description: "Gestión de impresoras",
  },
  {
    name: "Refacciones",
    icon: <IconGear />,
    href: "/listado_Refaccion",
    description: "Catálogo de refacciones",
  },
  {
    name: "Settings",
    icon: <IconSettings />,
    href: "/settings",
    description: "Configuración",
  },
];

export default function Dashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e, index) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
    setHoveredCard(index);
  };

  return (
    <div className="min-h-screen ">
      {/* Header con gradiente animado */}
      <div
        className={`mb-12 transform transition-all duration-1000 ${
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}
      >
        <div className="relative">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 animate-gradient">
          Inicio
          </h1>
          <div className="absolute -bottom-2 left-0 w-32 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"></div>
        </div>
        <p className="text-gray-600 text-lg mt-6">
          Gestiona tu negocio ONI3D desde un solo lugar ✨
        </p>
      </div>

      {/* Sección de Acciones Rápidas */}
      <div className="mb-16">
        <div className="flex items-center mb-8 space-x-3">
          <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
          <h2 className="text-3xl font-bold text-gray-800">Acciones Rápidas</h2>
          <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-200 to-transparent"></div>
        </div>

        <div
          className={`
          grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6
          transform transition-all duration-1000 ease-out
          ${
            isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }
        `}
        >
          {quickLinks.map((link, index) => {
            const colors = colorSchemes[link.name];
            return (
              <Link
                key={link.name}
                to={link.href}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden
                          transform transition-all duration-500 ease-out
                          hover:scale-105 hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  transitionDelay: `${index * 50}ms`,
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                }}
                onMouseMove={(e) => handleMouseMove(e, index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Efecto de brillo siguiendo el mouse */}
                {hoveredCard === index && (
                  <div
                    className="absolute w-64 h-64 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 blur-xl pointer-events-none"
                    style={{
                      left: mousePosition.x - 128,
                      top: mousePosition.y - 128,
                      transition: "all 0.3s ease-out",
                    }}
                  />
                )}

                {/* Gradiente de fondo */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                ></div>

                {/* Borde animado */}
                <div
                  className={`absolute inset-0 border-2 border-transparent group-hover:border-current bg-gradient-to-r ${colors.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                  style={{
                    WebkitMask:
                      "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                ></div>

                {/* Contenido */}
                <div className="relative z-10 p-6 flex flex-col items-center text-center space-y-4">
                  {/* Icono con animación */}
                  <div
                    className={`
                    ${colors.iconBg} rounded-2xl p-5
                    transform transition-all duration-500
                    group-hover:scale-110 group-hover:rotate-6
                    ${colors.hoverBg}
                    ${colors.shadow}
                    shadow-lg
                  `}
                  >
                    <div
                      className={`${colors.iconColor} group-hover:text-white transition-colors duration-500`}
                    >
                      {link.icon}
                    </div>
                  </div>

                  {/* Texto */}
                  <div className="space-y-1">
                    <h3
                      className={`font-bold text-lg ${colors.iconColor} group-hover:text-transparent group-hover:bg-gradient-to-r ${colors.gradient} group-hover:bg-clip-text transition-all duration-500`}
                    >
                      {link.name}
                    </h3>
                    <p className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                      {link.description}
                    </p>
                  </div>

                  {/* Indicador de click */}
                  <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                    <svg
                      className={`w-5 h-5 ${colors.iconColor}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                </div>

                {/* Partículas flotantes */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div
                    className={`absolute top-3/4 right-1/4 w-1.5 h-1.5 ${colors.iconBg} rounded-full animate-float-delayed`}
                  ></div>
                  <div
                    className={`absolute bottom-1/4 left-3/4 w-1 h-1 ${colors.iconBg} rounded-full animate-float-slow`}
                  ></div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx>{`
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

        @keyframes gradient {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) scale(1);
            opacity: 0.4;
          }
          50% {
            transform: translateY(-25px) scale(1.2);
            opacity: 1;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 0.5s;
        }

        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite 1s;
        }
      `}</style>
    </div>
  );
}
