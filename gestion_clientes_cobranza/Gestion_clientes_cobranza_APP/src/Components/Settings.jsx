import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, PencilIcon, TrashIcon, XMarkIcon, UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

// PASO 1: Importar el hook useAuth desde tu AuthContext
import { useAuth } from '../context/AuthContext'; // Asegúrate que la ruta sea correcta

export default function Settings() {
    // PASO 2: Obtener el usuario logeado desde el contexto
    const { user: currentUser } = useAuth(); // Renombramos a 'currentUser' para evitar conflictos

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        tipoCuenta: 'VENTAS'
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/admin/usuarios');
            if (!response.ok) {
                throw new Error('No se pudo obtener la lista de usuarios.');
            }
            const data = await response.json();
            setUsers(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ... (El resto de tus funciones como openEditModal, closeModal, handleSave, etc., no necesitan cambios)
    const openEditModal = (user) => {
        setSelectedUser(user);
        setFormData({
            username: user.username,
            email: user.email,
            password: '',
            tipoCuenta: user.tipoCuenta
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
        setError(null);
        setFormData({ username: '', email: '', password: '', tipoCuenta: 'VENTAS' });
    };

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setError(null);
        if (!selectedUser) return;
        
        // Validaciones
        if (!formData.username.trim()) {
            setError('El nombre de usuario es requerido.');
            return;
        }
        if (!formData.email.trim()) {
            setError('El email es requerido.');
            return;
        }
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            setError('El email no es válido.');
            return;
        }
        
        try {
            // Si no se proporciona password, no lo enviamos en el body
            const updateData = { ...formData };
            if (!updateData.password || updateData.password.trim() === '') {
                delete updateData.password;
            }
            
            const response = await fetch(`http://localhost:8080/api/admin/usuarios/${selectedUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateData)
            });
            
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Error al guardar los cambios.');
            }
            await fetchUsers();
            closeModal();
        } catch (err) {
            setError(err.message || 'Error al guardar los cambios. Intenta nuevamente.');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar a este usuario?')) return;
        try {
            const response = await fetch(`http://localhost:8080/api/admin/usuarios/${userId}`, {
                method: 'DELETE'
            });
             const data = await response.json();
            if (!data.success) { // Asumiendo que tu backend devuelve { success: boolean, ... }
                throw new Error(data.message || 'Error al eliminar el usuario.');
            }
            await fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };
    
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                >
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold text-lg">Cargando usuarios...</p>
                </motion.div>
            </div>
        );
    }

    // PASO 3: Filtrar la lista de usuarios para excluir al usuario actual
    // Usamos el ID del currentUser para encontrar y quitar a ese usuario de la lista a mostrar
    const visibleUsers = users.filter(user => user.id !== currentUser?.id);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white rounded-2xl shadow-2xl overflow-hidden">
                        <div className="relative p-8">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                            <div className="relative flex items-center gap-4">
                                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20">
                                    <ShieldCheckIcon className="w-8 h-8" />
                                </div>
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg mb-2">
                                        Gestión de Cuentas
                                    </h1>
                                    <p className="text-blue-100 text-base md:text-lg font-medium">
                                        👥 Administra los usuarios del sistema
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            
                {error && !isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl shadow-lg border-2 border-red-200"
                        role="alert"
                    >
                        <div className="flex items-center gap-2 text-red-800">
                            <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <span className="font-semibold">{error}</span>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
                >
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gradient-to-r from-gray-800 via-gray-900 to-black">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Username</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Tipo de Cuenta</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {visibleUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                            <div className="flex flex-col items-center gap-3">
                                                <UserIcon className="w-12 h-12 text-gray-300" />
                                                <p className="text-lg font-semibold">No hay usuarios disponibles</p>
                                                <p className="text-sm">Todos los usuarios están siendo mostrados.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    visibleUsers.map((user, index) => (
                                        <motion.tr
                                            key={user.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">{user.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{user.username}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-3 py-1.5 inline-flex text-xs leading-5 font-bold rounded-full ${
                                                    user.tipoCuenta === 'ADMINISTRADOR' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white' :
                                                    user.tipoCuenta === 'MANTENIMIENTO' ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' :
                                                    'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                                                }`}>
                                                    {user.tipoCuenta}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center justify-center gap-3">
                                                    <motion.button
                                                        onClick={() => openEditModal(user)}
                                                        className="p-2 rounded-xl text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-200"
                                                        title="Editar"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <PencilIcon className="w-5 h-5" />
                                                    </motion.button>
                                                    <motion.button
                                                        onClick={() => handleDelete(user.id)}
                                                        className="p-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all border border-transparent hover:border-red-200"
                                                        title="Eliminar"
                                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <TrashIcon className="w-5 h-5" />
                                                    </motion.button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Modal de Edición */}
                <AnimatePresence>
                {isModalOpen && selectedUser && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex justify-center items-center p-4"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 50 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border-4 border-blue-100"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header del Modal */}
                            <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                            <PencilIcon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">Editar Usuario</h2>
                                            <p className="text-blue-100 text-sm mt-1">Modifica la información del usuario</p>
                                        </div>
                                    </div>
                                    <motion.button
                                        onClick={closeModal}
                                        className="p-2 rounded-full hover:bg-white/20 transition-all"
                                        whileHover={{ scale: 1.1, rotate: 90 }}
                                        whileTap={{ scale: 0.9 }}
                                        aria-label="Cerrar modal"
                                    >
                                        <XMarkIcon className="w-6 h-6" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Contenido del Modal */}
                            <form onSubmit={handleSave} className="p-6">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl"
                                    >
                                        <div className="flex items-center gap-2 text-red-800">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            <span className="font-semibold">{error}</span>
                                        </div>
                                    </motion.div>
                                )}

                                <div className="space-y-5">
                                    {/* Campo Username */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <UserIcon className="w-5 h-5 text-blue-600" />
                                            Nombre de Usuario
                                        </label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                                            placeholder="Ingresa el nombre de usuario"
                                            required
                                        />
                                    </div>

                                    {/* Campo Email */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                                            placeholder="usuario@ejemplo.com"
                                            required
                                        />
                                    </div>

                                    {/* Campo Password (Opcional) */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <LockClosedIcon className="w-5 h-5 text-blue-600" />
                                            Nueva Contraseña
                                            <span className="text-xs font-normal text-gray-500">(Opcional - deja en blanco para mantener la actual)</span>
                                        </label>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium"
                                            placeholder="Deja en blanco para mantener la contraseña actual"
                                        />
                                    </div>

                                    {/* Campo Tipo de Cuenta */}
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                            <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                                            Tipo de Cuenta
                                        </label>
                                        <select
                                            name="tipoCuenta"
                                            value={formData.tipoCuenta}
                                            onChange={handleFormChange}
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm font-medium bg-white"
                                            required
                                        >
                                            <option value="VENTAS">VENTAS</option>
                                            <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                                            <option value="ADMINISTRADOR">ADMINISTRADOR</option>
                                        </select>
                                        <p className="mt-2 text-xs text-gray-500">
                                            Selecciona el tipo de cuenta para este usuario
                                        </p>
                                    </div>
                                </div>

                                {/* Botones de Acción */}
                                <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
                                    <motion.button
                                        type="button"
                                        onClick={closeModal}
                                        className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all shadow-md"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Cancelar
                                    </motion.button>
                                    <motion.button
                                        type="submit"
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Guardar Cambios
                                    </motion.button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
        </div>
    );
}