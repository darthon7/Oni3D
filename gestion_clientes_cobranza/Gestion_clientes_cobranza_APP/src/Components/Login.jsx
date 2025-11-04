import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import print from '../assets/print.png';

export default function AuthPage() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login: loginWithContext } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    if (error) setError("");
  };

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

  return (
    <main className="w-full flex min-h-screen">
      {/* Panel izquierdo (promocional) */}
      <div className="relative flex-1 hidden items-center justify-center h-screen bg-gray-900 lg:flex">
        <div className="relative z-10 w-full max-w-md">
          <img
            src={print}
            alt="GIF de bienvenida"
            className="w-70 h-70 rounded-md object-cover"
            loading="lazy"
          />
          <div className=" mt-16 space-y-3">
            <h3 className="text-white text-3xl font-bold">ONI 3D</h3>
            <p className="text-gray-300">
              Negocio de impresion 3D
            </p>
          </div>
        </div>
        <div
          className="absolute inset-0 my-auto h-[500px]"
          style={{
            background:
              "linear-gradient(152.92deg, rgba(192, 132, 252, 0.2) 4.54%, rgba(232, 121, 249, 0.26) 34.2%, rgba(192, 132, 252, 0.1) 77.55%)",
            filter: "blur(118px)",
          }}
        />
      </div>

      {/* Panel derecho (login) */}
      <div className="flex-1 flex items-center justify-center h-screen">
        <div className="w-full max-w-md space-y-8 px-6 py-6 bg-white text-gray-600 sm:px-8 sm:py-10 shadow-lg rounded-lg">
          <div>
            <img src="https://floatui.com/logo.svg" width={150} className="lg:hidden" alt="logo" />
            <div className="mt-5 space-y-2">
              <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">Iniciar sesión</h3>
            </div>
          </div>

          {/* Formulario de Login */}
          <form onSubmit={handleSubmit} className="space-y-5 w-full">
            <div>
              <label className="font-medium text-gray-700 block mb-1">Usuario</label>
              <input
                name="usernameOrEmail"
                type="text"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                placeholder="Ingresa tu usuario o email"
                required
                className="w-full mt-1 px-3 py-2 text-gray-700 bg-transparent outline-none border border-gray-200 focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700 block mb-1">Contraseña</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Ingresa tu contraseña"
                required
                className="w-full mt-1 px-3 py-2 text-gray-700 bg-transparent outline-none border border-gray-200 focus:border-indigo-600 shadow-sm rounded-lg"
              />
            </div>

            {error && (
              <div className="mt-1 text-sm text-red-600 bg-red-50 border border-red-200 p-2 rounded">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className={`w-full px-4 py-2 text-white font-medium bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-600 rounded-lg duration-150 ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>

            <p className="text-center text-sm text-gray-500">
              ¿No tienes cuenta?{" "}
              <Link to="/registro" className="text-indigo-600 hover:text-indigo-500 font-medium">Regístrate</Link>
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
