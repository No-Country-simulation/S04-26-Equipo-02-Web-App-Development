import { useState, useEffect, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import api, { ApiError } from '../api/axios';
import { API_ENDPOINTS } from '../lib/constants';
import type { AuthContextType, User, LoginCredentials, RegisterData } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        await api.get(API_ENDPOINTS.auth.validateSession);
        setUser({ id: '', email: '', name: '', role: 'PROFESSIONAL' });
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      await api.post(API_ENDPOINTS.auth.login, {
        email: credentials.email,
        password: credentials.password,
        provider: credentials.provider,
      });
      setUser({ id: '', email: credentials.email, name: '', role: credentials.provider });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          throw new Error('Credenciales incorrectas');
        }
        if (error.status === 0) {
          throw new Error('Sin conexión al servidor');
        }
        throw new Error(error.message);
      }
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await api.post(API_ENDPOINTS.auth.register, {
        email: data.email,
        password: data.password,
        provider: data.provider,
        firstName: data.firstName,
        lastName: data.lastName,
        location: data.location,
        phone: data.phone,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 422) {
          throw new Error(error.message || 'El email ya está registrado');
        }
        if (error.status === 0) {
          throw new Error('Sin conexión al servidor');
        }
        throw new Error(error.message);
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post(API_ENDPOINTS.auth.logout);
    } catch {
      // Ignorar errores en logout
    }
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}