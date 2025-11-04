// authService.js - Servicios para comunicación con el backend

const API_BASE_URL = 'http://localhost:8080/api/auth';

// Configuración base para las peticiones
const createRequestConfig = (method, data = null) => {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    return config;
};

// Función para manejar respuestas
const handleResponse = async (response) => {
    const data = await response.json();
    return data;
};

// Servicios de autenticación
export const authService = {
    
    // Registrar nuevo usuario
    registro: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/registro`, 
                createRequestConfig('POST', userData)
            );
            return await handleResponse(response);
        } catch (error) {
            console.error('Error en registro:', error);
            throw new Error('Error de conexión con el servidor');
        }
    },

    // Iniciar sesión
    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, 
                createRequestConfig('POST', credentials)
            );
            return await handleResponse(response);
        } catch (error) {
            console.error('Error en login:', error);
            throw new Error('Error de conexión con el servidor');
        }
    },

    // Verificar si username existe
    checkUsername: async (username) => {
        try {
            const response = await fetch(`${API_BASE_URL}/check-username/${username}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error verificando username:', error);
            throw new Error('Error de conexión con el servidor');
        }
    },

    // Verificar si email existe
    checkEmail: async (email) => {
        try {
            const response = await fetch(`${API_BASE_URL}/check-email/${email}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error verificando email:', error);
            throw new Error('Error de conexión con el servidor');
        }
    },

    // Obtener información del usuario por ID
    getUsuario: async (id) => {
        try {
            const response = await fetch(`${API_BASE_URL}/usuario/${id}`);
            return await handleResponse(response);
        } catch (error) {
            console.error('Error obteniendo usuario:', error);
            throw new Error('Error de conexión con el servidor');
        }
    }
};

// Funciones para manejo de localStorage (estado de autenticación)
export const authUtils = {
    
    // Guardar información del usuario
    saveUser: (userData) => {
        localStorage.setItem('usuario', JSON.stringify(userData));
        localStorage.setItem('isAuthenticated', 'true');
    },

    // Obtener información del usuario
    getUser: () => {
        const userData = localStorage.getItem('usuario');
        return userData ? JSON.parse(userData) : null;
    },

    // Verificar si está autenticado
    isAuthenticated: () => {
        return localStorage.getItem('isAuthenticated') === 'true';
    },

    // Cerrar sesión
    logout: () => {
        localStorage.removeItem('usuario');
        localStorage.removeItem('isAuthenticated');
    },

    // Obtener token/ID del usuario (útil para futuras peticiones)
    getUserId: () => {
        const user = authUtils.getUser();
        return user ? user.id : null;
    },

    // Obtener username del usuario actual
    getUsername: () => {
        const user = authUtils.getUser();
        return user ? user.username : null;
    }
};

// Hook personalizado para usar en componentes (opcional, pero útil)
export const useAuth = () => {
    const user = authUtils.getUser();
    const isAuthenticated = authUtils.isAuthenticated();
    
    const login = async (credentials) => {
        const result = await authService.login(credentials);
        if (result.success) {
            authUtils.saveUser(result.usuario);
        }
        return result;
    };

    const registro = async (userData) => {
        return await authService.registro(userData);
    };

    const logout = () => {
        authUtils.logout();
        // Aquí podrías redirigir al login si es necesario
        window.location.href = '/login';
    };

    return {
        user,
        isAuthenticated,
        login,
        registro,
        logout,
        getUserId: authUtils.getUserId,
        getUsername: authUtils.getUsername
    };
};