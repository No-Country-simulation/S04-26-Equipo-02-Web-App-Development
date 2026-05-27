import api from './axios';
import { API_ENDPOINTS } from '../lib/constants';
import type { ProfessionalProfile, CompanyFormState } from '../components/dashboard/profile/types';

export async function getMyProfile(): Promise<ProfessionalProfile> {
  const res = await api.get(`${API_ENDPOINTS.profiles}/me`);
  return res.data.data;
}

export async function updateMyProfile(payload: Record<string, unknown>): Promise<{ success: boolean; data?: ProfessionalProfile }> {
  const res = await api.patch<{ success: boolean; data?: ProfessionalProfile }>(`${API_ENDPOINTS.profiles}/update`, payload);
  return res.data;
}

export async function addExperience(data: {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description?: string;
}): Promise<unknown> {
  const res = await api.post(`${API_ENDPOINTS.profiles}/experience`, data);
  return res.data;
}

export async function deleteExperience(id: string): Promise<unknown> {
  const res = await api.delete(`${API_ENDPOINTS.profiles}/experience/${id}`);
  return res.data;
}

export async function addEducation(data: {
  institution: string;
  degree: string;
  year: number;
}): Promise<unknown> {
  const res = await api.post(`${API_ENDPOINTS.profiles}/education`, data);
  return res.data;
}

export async function deleteEducation(id: string): Promise<unknown> {
  const res = await api.delete(`${API_ENDPOINTS.profiles}/education/${id}`);
  return res.data;
}

export async function addCertification(data: {
  name: string;
  issuer: string;
  issueDate: string | null;
  url: string | null;
}): Promise<unknown> {
  const res = await api.post(`${API_ENDPOINTS.profiles}/certifications`, data);
  return res.data;
}

export async function deleteCertification(id: string): Promise<unknown> {
  const res = await api.delete(`${API_ENDPOINTS.profiles}/certifications/${id}`);
  return res.data;
}

export async function addLanguage(data: {
  name: string;
  level: string;
}): Promise<unknown> {
  const res = await api.post(`${API_ENDPOINTS.profiles}/languages`, data);
  return res.data;
}

export async function deleteLanguage(id: string): Promise<unknown> {
  const res = await api.delete(`${API_ENDPOINTS.profiles}/languages/${id}`);
  return res.data;
}

export async function getCompanyProfile(): Promise<CompanyFormState> {
  const res = await api.get(`${API_ENDPOINTS.profiles}/company/me`);
  return res.data.data;
}

export async function updateCompanyProfile(payload: CompanyFormState): Promise<{ success: boolean; data?: CompanyFormState }> {
  const res = await api.patch<{ success: boolean; data?: CompanyFormState }>(`${API_ENDPOINTS.profiles}/company/update`, payload);
  return res.data;
}
