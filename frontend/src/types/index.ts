// Tipos compartidos de la aplicación

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'professional' | 'company';
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'professional' | 'company';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Tipos para el contexto de autenticación
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}