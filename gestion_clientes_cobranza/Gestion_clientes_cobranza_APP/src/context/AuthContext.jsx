import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authService, authUtils } from '../Services/authService';


// Crear el contexto
const AuthContext = createContext();

// Estados posibles
const AuthActionTypes = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    RESTORE_SESSION: 'RESTORE_SESSION'
};

// Estado inicial
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
};

// Reducer para manejar los cambios de estado
const authReducer = (state, action) => {
    switch (action.type) {
        case AuthActionTypes.LOGIN_START:
            return {
                ...state,
                loading: true,
                error: null
            };
        
        case AuthActionTypes.LOGIN_SUCCESS:
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true,
                loading: false,
                error: null
            };
        
        case AuthActionTypes.LOGIN_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload
            };
        
        case AuthActionTypes.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null
            };
        
        case AuthActionTypes.RESTORE_SESSION:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: action.payload.isAuthenticated,
                loading: false
            };
        
        default:
            return state;
    }
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Restaurar sesión al cargar la aplicación
    
    useEffect(() => {
        const savedUser = authUtils.getUser();
        const isAuthenticated = authUtils.isAuthenticated();
        
        dispatch({
            type: AuthActionTypes.RESTORE_SESSION,
            payload: {
                user: savedUser,
                isAuthenticated: isAuthenticated
            }
        });
    }, []);



    

    // Función para login
    const login = async (credentials) => {
        dispatch({ type: AuthActionTypes.LOGIN_START });
        
        try {
            const response = await authService.login(credentials);
            
            if (response.success) {
                // Guardar en localStorage
                authUtils.saveUser(response.usuario);
                
                // Actualizar estado
                dispatch({
                    type: AuthActionTypes.LOGIN_SUCCESS,
                    payload: response.usuario
                });
                
                return { success: true, message: response.message };
            } else {
                dispatch({
                    type: AuthActionTypes.LOGIN_FAILURE,
                    payload: response.message
                });
                return { success: false, message: response.message };
            }
        } catch (error) {
            const errorMessage = 'Error de conexión con el servidor';
            dispatch({
                type: AuthActionTypes.LOGIN_FAILURE,
                payload: errorMessage
            });
            return { success: false, message: errorMessage };
        }
    };

    // Función para registro
    const registro = async (userData) => {
        dispatch({ type: AuthActionTypes.LOGIN_START });
        
        try {
            const response = await authService.registro(userData);
            dispatch({ type: AuthActionTypes.LOGIN_FAILURE, payload: null }); // Reset loading
            return response;
        } catch (error) {
            dispatch({
                type: AuthActionTypes.LOGIN_FAILURE,
                payload: 'Error de conexión con el servidor'
            });
            return { success: false, message: 'Error de conexión con el servidor' };
        }
    };

    // Función para logout
    const logout = () => {
        authUtils.logout();
        dispatch({ type: AuthActionTypes.LOGOUT });
    };

    // Función para verificar si username existe
    const checkUsername = async (username) => {
        try {
            return await authService.checkUsername(username);
        } catch (error) {
            return { existe: false, message: 'Error verificando username' };
        }
    };

    // Función para verificar si email existe
    const checkEmail = async (email) => {
        try {
            return await authService.checkEmail(email);
        } catch (error) {
            return { existe: false, message: 'Error verificando email' };
        }
    };

    // Valor del contexto
    const contextValue = {
        // Estado
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        
        // Funciones
        login,
        registro,
        logout,
        checkUsername,
        checkEmail,
        
        // Utilidades
        getUserId: () => state.user?.id || null,
        getUsername: () => state.user?.username || null,
        getUserEmail: () => state.user?.email || null
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de AuthProvider');
    }
    
    return context;
};

// Hook para verificar autenticación (útil en rutas protegidas)
export const useRequireAuth = () => {
    const { isAuthenticated, user } = useAuth();
    
    return {
        isAuthenticated,
        user,
        canAccess: isAuthenticated && user !== null
    };
};