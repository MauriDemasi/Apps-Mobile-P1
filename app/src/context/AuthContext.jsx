import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [userType, setUserType] = useState(() => localStorage.getItem('userType') || null);
  const [isLoading, setIsLoading] = useState(true);

  const validarSesion = async () => {

    if (new URLSearchParams(window.location.search).has('demo')) {
      await new Promise((r) => setTimeout(r, 1500));
    }
    const savedToken = localStorage.getItem('token');

    if (!savedToken) {
      setIsLoading(false);
      return;
    }

    try {
      const type = localStorage.getItem('userType');
      if (!type) throw new Error('sin userType');

      const endpoint = type === 'admin' ? '/api/admin/metricas' : '/api/client/perfil';
      await api.get(endpoint);
      setToken(localStorage.getItem('token'));

    } catch (error) {
      if(error.response?.status === 401){
        logout();
      }
      console.log('Sesión expirada o inválida');
    } finally {
      setIsLoading(false);
    }
  };

  const loginClient = async (email, password) => {
    try {
      const res = await api.post('/api/auth/client/login', { email, password });
      localStorage.setItem('refreshToken', res.data.data.refreshToken);
      localStorage.setItem('token', res.data.data.token);
      const perfil = await api.get('/api/client/perfil');
      setUser(perfil.data.data);
      setToken(res.data.data.token);
      setUserType('client');
      localStorage.setItem('user', JSON.stringify(perfil.data.data));
      localStorage.setItem('userType', 'client');
    } catch (error) {
      console.log('Error al iniciar sesión como cliente', error);
      throw error;
    }

  };

  const loginAdmin = async (email, password) => {
   try {
     const res = await api.post('/api/auth/admin/login', { email, password });
     localStorage.setItem('token', res.data.data.token);
     localStorage.setItem('refreshToken', res.data.data.refreshToken);
     const perfil = await api.get('/api/admin/metricas');
     setUser(perfil.data.data);
     setToken(res.data.data.token);
     setUserType('admin');
     localStorage.setItem('user', JSON.stringify(perfil.data.data));
     localStorage.setItem('token', res.data.data.token);
     localStorage.setItem('userType', 'admin');

   } catch (error) {
    console.log('Error al iniciar sesión como administrador', error);
    throw error;
   }
  };

  const logout = async () => {
    try{
      await api.post('/api/auth/logout', {
        refreshToken: localStorage.getItem('refreshToken')
      });
    } catch (error) {
      console.log('Error al cerrar sesión', error);
    } finally {
      setUser(null);
      setToken(null);
      setUserType(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      localStorage.removeItem('userType');
      localStorage.removeItem('refreshToken');
    }
  };

  useEffect(() => {
    validarSesion();
  }, []);

  return <AuthContext.Provider
            value={{user, token, userType, isLoading, validarSesion, loginClient, loginAdmin, logout}}>
      {children}
      </AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
