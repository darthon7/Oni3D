// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Importar componentes de autenticación
import Login from "./Components/Login";
import Registro from "./Components/Registro";
import {
  ProtectedRoute,
  PublicRoute
} from "./Components/ProtectedRoute";

// Importar nuevo layout y dashboard (reemplazando MainLayout)
import DashboardLayout from "./Components/Dashboardlayout";
import Dashboard from "./Components/Dashboard";

// Importar tus componentes existentes
import Listado_Empleados from "./empleados/Listado_Empleados";
import Agregar_Empleado from "./empleados/Agregar_Empleado";
import Editar_Empleado from "./empleados/Editar_Empleado";

import Agregar_Material from "./Materiales/Agregar_Material";
import Editar_Material from "./Materiales/Editar_Material";
import Listado_Material from "./Materiales/Listado_Material";
import Calculadora from "./Components/Calculadora";
import AgregarAlerta from "./Components/AgregarAlerta";
import Listado_Productos from "./Productos/Listado_Productos"
import Editar_Producto from "./Productos/Editar_Producto";
// nuevas opciones
import Settings from "./Components/Settings";
import CalendarioEntregas from "./Components/calendario";
import Listado_Pinturas from "./Pínturas/Listado_Pinturas";
import Agregar_Pintura from "./Pínturas/Agregar_Pintura";
import Editar_Pintura from "./Pínturas/Editar_Pintura";
import Agregar_Producto from "./Productos/Agregar_Producto";
import AgregarAlerta2 from "./Components/Editar_Alerta";
import AIChat from "./Components/AIChat";
import ProductosVendidos from "./Ventas/ProductosVendidos";
import Listado_Refaccion from "./Refaccion/Listado_Refaccion";
import Agregar_Refaccion from "./Refaccion/Agregar_Refaccion";
import Editar_Refaccion from "./Refaccion/Editar_Refaccion";
import Listado_Impresoras from "./Impresoras/Listado_Impresoras";
import Agregar_Impresora from "./Impresoras/Agregar_Impresora";
import Editar_Impresora from "./Impresoras/Editar_Impresora";


export default function App() {
  return (
    <div className="App">
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/registro"
          element={
            <PublicRoute>
              <Registro />
            </PublicRoute>
          }
        />

        {/* Todas las rutas protegidas envueltas en DashboardLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout/>
            </ProtectedRoute>
          }
        >
          {/* Dashboard principal (reemplaza Pag_Inicio) */}
          <Route index element={<Dashboard />} />
          
          {/* Rutas de empleados/clientes */}
          <Route path="listado" element={<Listado_Empleados />} />
          <Route path="agregar" element={<Agregar_Empleado />} />
          <Route path="editar/:id" element={<Editar_Empleado />} />
          <Route path="AIChat" element={<AIChat/>} />
          {/* Rutas de materiales */}
          <Route path="agregar_material" element={<Agregar_Material />} />
          <Route path="lista_material" element={<Listado_Material />} />
          <Route path="editar_material/:id" element={<Editar_Material />} />

          {/* Ruta de prueba */}
          <Route path="Calculadora" element={<Calculadora />} />
          <Route path="AgregarAlerta" element={<AgregarAlerta />} />
          <Route path="calendario" element={<CalendarioEntregas/>} />
          <Route path="Editar_Alerta/:id" element={<AgregarAlerta2/>}/>


          {/* Rutas de productos */}
          <Route path="listado_productos" element={<Listado_Productos />} />
          <Route path="Editar_Producto/:id" element={<Editar_Producto />}/>
          <Route path="Agregar_Producto" element={<Agregar_Producto />} />
          {/* Ruta para Settings */}
          <Route path="settings" element={<Settings />} />
          
          {/* Rutas de refacciones */}
          <Route path="listado_refaccion" element={<Listado_Refaccion />} />
          <Route path="Agregar_Refaccion" element={<Agregar_Refaccion />} />
          <Route path="Editar_Refaccion/:id" element={<Editar_Refaccion />} />
                    {/* Rutas de refacciones */}
          <Route path="listado_impresoras" element={<Listado_Impresoras />} />
          <Route path="Agregar_Impresora" element={<Agregar_Impresora />} />
          <Route path="Editar_Impresora/:id" element={<Editar_Impresora />} />

          {/* Rutas de pinturas */}
          <Route path="listado_pinturas" element={<Listado_Pinturas />} />
          <Route path="Agregar_Pintura" element={<Agregar_Pintura />} />
          <Route path="Editar_Pintura/:id" element={<Editar_Pintura />} />
          {/* Ruta Productos Vendidos */}
          <Route path="ProductosVendidos" element={<ProductosVendidos />} />
          {/* Ruta por defecto para rutas no encontradas */}
          <Route
            path="*"
            element={
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Página no encontrada</h2>
                <p className="text-gray-600 mb-6">La página que buscas no existe.</p>
                <a href="/" className="text-blue-600 hover:text-blue-800 font-medium">
                  Volver al inicio
                </a>
              </div>
            }
          />
        </Route>
      </Routes>
    </div>
  );
}