import api from './axios';
import { API_ENDPOINTS } from '../lib/constants';

export interface DiagnosticResult {
  status: string;
  timestamp: string;
}

export async function getDiagnostic(): Promise<DiagnosticResult> {
  const response = await api.get<DiagnosticResult>(API_ENDPOINTS.diagnostic);
  return response.data;
}
