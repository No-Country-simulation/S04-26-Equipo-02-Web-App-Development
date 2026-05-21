import api from './axios';
import { API_ENDPOINTS } from '../lib/constants';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types';
import { ApiError } from '../lib/errors';

const LOGIN_ERROR_MESSAGES: Record<number, string> = {
  401: 'Contraseña incorrecta. Revisá los datos e intentá de nuevo.',
  403: 'No tenés permiso para acceder con este usuario.',
  404: 'No encontramos una cuenta con este email. ¿Querés registrarte?',
  422: 'Verificá que los datos ingresados sean correctos.',
  429: 'Demasiados intentos. Esperá unos minutos y volvé a intentar.',
};

export async function login(credentials: LoginCredentials): Promise<void> {
  try {
    await api.post<AuthResponse>(API_ENDPOINTS.auth.login, credentials);
  } catch (error) {
    if (error instanceof ApiError) {
      const message = LOGIN_ERROR_MESSAGES[error.status]
        ?? (error.status >= 500 ? 'El servidor no está respondiendo. Intentá más tarde.' : error.message);
      throw new Error(message);
    }
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No pudimos conectar con el servidor. Revisá tu conexión a internet.');
    }
    throw new Error('Ocurrió un error al iniciar sesión. Intentá de nuevo.');
  }
}

const REGISTER_ERROR_MESSAGES: Record<number, string> = {
  409: 'Este email ya está registrado. Iniciá sesión en lugar de registrarte.',
  422: 'Algunos datos no son válidos. Revisá los campos e intentá de nuevo.',
  429: 'Demasiados intentos. Esperá unos minutos y volvé a intentar.',
};

export async function register(data: RegisterData): Promise<void> {
  try {
    await api.post<AuthResponse>(API_ENDPOINTS.auth.register, data);
  } catch (error) {
    if (error instanceof ApiError) {
      const message = REGISTER_ERROR_MESSAGES[error.status]
        ?? (error.status >= 500 ? 'El servidor no está respondiendo. Intentá más tarde.' : error.message);
      throw new Error(message);
    }
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('No pudimos conectar con el servidor. Revisá tu conexión a internet.');
    }
    throw new Error('Ocurrió un error al registrarte. Intentá de nuevo.');
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post(API_ENDPOINTS.auth.logout);
  } catch {
    // Silently swallow errors — logout is best-effort
  }
}

export async function validateSession(): Promise<void> {
  await api.get(API_ENDPOINTS.auth.validateSession);
}
