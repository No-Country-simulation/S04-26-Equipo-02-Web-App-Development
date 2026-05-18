export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export type ErrorResponse = {
  message: string;
  code?: string;
  details?: unknown;
};

export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status ?? 0;
    const data = error.response?.data as ErrorResponse | undefined;

    if (status === 0) {
      return new ApiError('Sin conexión al servidor', 0, 'NETWORK_ERROR');
    }

    if (status === 401) {
      return new ApiError(
        data?.message || 'Sesión expirada',
        401,
        data?.code || 'UNAUTHORIZED'
      );
    }

    if (status === 403) {
      return new ApiError(
        data?.message || 'No tienes permisos',
        403,
        data?.code || 'FORBIDDEN'
      );
    }

    if (status === 404) {
      return new ApiError(
        data?.message || 'Recurso no encontrado',
        404,
        data?.code || 'NOT_FOUND'
      );
    }

    if (status === 422) {
      return new ApiError(
        data?.message || 'Datos inválidos',
        422,
        data?.code || 'VALIDATION_ERROR',
        data?.details
      );
    }

    if (status === 429) {
      return new ApiError(
        data?.message || 'Demasiadas peticiones. Intenta más tarde',
        429,
        data?.code || 'RATE_LIMIT'
      );
    }

    if (status >= 500) {
      return new ApiError(
        data?.message || 'Error del servidor',
        status,
        data?.code || 'SERVER_ERROR'
      );
    }

    return new ApiError(
      data?.message || error.message,
      status,
      data?.code
    );
  }

  return new ApiError('Error desconocido', 0, 'UNKNOWN');
};

import axios from 'axios';

export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};