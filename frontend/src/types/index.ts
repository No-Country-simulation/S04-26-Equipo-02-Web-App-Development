// Tipos compartidos de la aplicación

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'PROFESSIONAL' | 'COMPANY';
  createdAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  provider: 'PROFESSIONAL' | 'COMPANY';
}

export interface RegisterData {
  email: string;
  password: string;
  provider: 'PROFESSIONAL' | 'COMPANY';
  firstName: string;
  lastName: string;
  location: string;
  phone: string;
}

export interface AuthResponse {
  message: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Tipos para el contexto de autenticación
export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}