import api from './axios';
import { API_ENDPOINTS } from '../lib/constants';

export interface Skill {
  id: string;
  name: string;
  category: 'DIGITAL' | 'COGNITIVE' | 'SOCIOEMOTIONAL';
  description: string | null;
}

export interface SubmitAnswer {
  skillId: string;
  score: number;
}

export interface DiagnosticResult {
  status: string;
  timestamp: string;
}

export async function getDiagnostic(): Promise<DiagnosticResult> {
  const response = await api.get<DiagnosticResult>(API_ENDPOINTS.diagnostic);
  return response.data;
}

export async function getDiagnosticSkills(): Promise<Skill[]> {
  const res = await api.get(`${API_ENDPOINTS.diagnostic}/skills`);
  if (res.data && res.data.success) {
    return res.data.data;
  }
  throw new Error('No se pudo cargar la lista de habilidades.');
}

export async function submitDiagnosticAnswers(answers: SubmitAnswer[]): Promise<{ success: boolean; message?: string }> {
  const res = await api.post(`${API_ENDPOINTS.diagnostic}/submit`, { answers });
  return res.data;
}

