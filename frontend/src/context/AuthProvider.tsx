import { useState, type ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import api from '../api/axios';
import type { AuthContextType, User, LoginCredentials, RegisterData } from '../types';

interface AuthProviderProps {
  children: ReactNode;
}

// Funciones helper para parseo seguro
const getStoredUser = (): User | null => {
  try {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

export function AuthProvider({ children }: AuthProviderProps) {
  // Lazy initialization - se ejecuta solo una vez al mount
  const [user, setUser] = useState<User | null>(() => getStoredUser());
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading] = useState(false);

  const login = async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    const { user: userData, token: authToken } = response.data;

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
  };

  const register = async (data: RegisterData) => {
    const response = await api.post('/auth/register', data);
    const { user: userData, token: authToken } = response.data;

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}