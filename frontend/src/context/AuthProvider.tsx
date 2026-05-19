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
        const storedRole = localStorage.getItem('auth_user_role') as User['role'] | null;
        const storedEmail = localStorage.getItem('auth_user_email') || '';
        
        let userName = storedEmail.split('@')[0];
        let firstName = '';
        let lastName = '';
        
        if (storedRole === 'PROFESSIONAL') {
          try {
            const res = await api.get(`${API_ENDPOINTS.profiles}/me`);
            if (res.data && res.data.success && res.data.data) {
              const p = res.data.data;
              firstName = p.firstName || '';
              lastName = p.lastName || '';
              if (p.firstName || p.lastName) {
                userName = `${p.firstName} ${p.lastName}`.trim();
              }
            }
          } catch (e) {
            console.error('Error fetching profile name on checkSession:', e);
          }
        } else if (storedRole === 'COMPANY') {
          const storedCompany = localStorage.getItem(`company_profile_${storedEmail}`);
          if (storedCompany) {
            const c = JSON.parse(storedCompany);
            if (c.companyName) {
              userName = c.companyName;
            }
          }
        }

        setUser({ 
          id: '', 
          email: storedEmail, 
          name: userName, 
          role: storedRole || 'PROFESSIONAL',
          firstName,
          lastName
        });
      } catch {
        setUser(null);
        localStorage.removeItem('auth_user_role');
        localStorage.removeItem('auth_user_email');
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
      
      let userName = credentials.email.split('@')[0];
      let firstName = '';
      let lastName = '';
      
      if (credentials.provider === 'PROFESSIONAL') {
        try {
          const res = await api.get(`${API_ENDPOINTS.profiles}/me`);
          if (res.data && res.data.success && res.data.data) {
            const p = res.data.data;
            firstName = p.firstName || '';
            lastName = p.lastName || '';
            if (p.firstName || p.lastName) {
              userName = `${p.firstName} ${p.lastName}`.trim();
            }
          }
        } catch (e) {
          console.error('Error fetching profile name on login:', e);
        }
      } else if (credentials.provider === 'COMPANY') {
        const storedCompany = localStorage.getItem(`company_profile_${credentials.email}`);
        if (storedCompany) {
          const c = JSON.parse(storedCompany);
          if (c.companyName) {
            userName = c.companyName;
          }
        }
      }

      setUser({ 
        id: '', 
        email: credentials.email, 
        name: userName, 
        role: credentials.provider,
        firstName,
        lastName
      });
      localStorage.setItem('auth_user_role', credentials.provider);
      localStorage.setItem('auth_user_email', credentials.email);
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401) {
          throw new Error('Credenciales incorrectas', { cause: error });
        }
        if (error.status === 0) {
          throw new Error('Sin conexión al servidor', { cause: error });
        }
        throw new Error(error.message, { cause: error });
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
          throw new Error(error.message || 'El email ya está registrado', { cause: error });
        }
        if (error.status === 0) {
          throw new Error('Sin conexión al servidor', { cause: error });
        }
        throw new Error(error.message, { cause: error });
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
    localStorage.removeItem('auth_user_role');
    localStorage.removeItem('auth_user_email');
  };

  const updateUser = (fields: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...fields } : null));
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}