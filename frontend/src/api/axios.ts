import axios, { type AxiosError } from 'axios';
import { ApiError, handleApiError } from '../lib/errors';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = handleApiError(error);
    return Promise.reject(apiError);
  }
);

export default api;
export { ApiError };