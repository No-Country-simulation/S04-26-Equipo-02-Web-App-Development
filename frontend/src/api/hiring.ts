import api from './axios';
import { API_ENDPOINTS } from '../lib/constants';

// ── Types ────────────────────────────────────────────────────────────────────

export interface Offer {
  id: string;
  companyId: string;
  title: string;
  salaryRange: string;
  contractType: string;
  modality: string;
  description: string;
  education: string;
  experience: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfferPayload {
  title: string;
  salaryRange: string;
  contractType: string;
  modality: string;
  description: string;
  education: string;
  experience: string;
}

export type UpdateOfferPayload = Partial<CreateOfferPayload> & { id: string };

export interface OpportunityFilters {
  title?: string;
  salaryRange?: string;
  contractType?: string;
  modality?: string;
  experience?: string;
  education?: string;
  orderBy?: string;
}

export interface CandidateSkill {
  skill: { name: string };
}

export interface CandidateExperience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string | null;
}

export interface CandidateSearchResult {
  id: string;
  userId: string;
  professionalTitle: string;
  yearsOfExperience: number;
  location: string;
  availability: string;
  preferredModality: string;
  salaryExpectation: string;
  completionScore: number;
  skills: CandidateSkill[];
  experience: CandidateExperience[];
  education: unknown[];
  certifications: unknown[];
  languages: unknown[];
}

export interface CandidateFilters {
  professionalTitle?: string;
  yearsOfExperience?: number;
  location?: string;
  availability?: string;
  preferredModality?: string;
  salaryExpectation?: string;
  skills?: string | string[];
  experience?: number | string | (number | string)[];
  education?: string | string[];
  certifications?: string | { name?: string; issuer?: string }[];
  languages?: string | string[];
}

export interface PreselectionPayload {
  userId: string;
  notes: string;
}

// ── API Functions ────────────────────────────────────────────────────────────

/** 1.5 Buscar oportunidades de empleo (público) */
export async function getOpportunities(
  filters: OpportunityFilters = {}
): Promise<Offer[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  const url = qs
    ? `${API_ENDPOINTS.hiring.opportunities}?${qs}`
    : API_ENDPOINTS.hiring.opportunities;
  const res = await api.get<Offer[]>(url);
  return res.data;
}

/** 1.4 Obtener ofertas de la empresa autenticada */
export async function getMyOffers(): Promise<Offer[]> {
  const res = await api.get<Offer[]>(API_ENDPOINTS.hiring.offers);
  return res.data;
}

/** 1.1 Crear oferta de trabajo */
export async function createOffer(
  data: CreateOfferPayload
): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>(
    API_ENDPOINTS.hiring.createOffer,
    data
  );
  return res.data;
}

/** 1.2 Actualizar oferta de trabajo */
export async function updateOffer(
  data: UpdateOfferPayload
): Promise<{ message: string }> {
  const res = await api.patch<{ message: string }>(
    API_ENDPOINTS.hiring.updateOffer,
    data
  );
  return res.data;
}

/** 1.3 Eliminar oferta de trabajo */
export async function deleteOffer(id: string): Promise<{ message: string }> {
  const res = await api.delete<{ message: string }>(
    API_ENDPOINTS.hiring.deleteOffer(id)
  );
  return res.data;
}

/** 1.6 Buscar candidatos */
export async function searchCandidates(
  filters: CandidateFilters = {}
): Promise<CandidateSearchResult[]> {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== '' && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, String(v)));
      } else {
        params.set(key, String(value));
      }
    }
  });
  const qs = params.toString();
  const url = qs
    ? `${API_ENDPOINTS.hiring.searchCandidates}?${qs}`
    : API_ENDPOINTS.hiring.searchCandidates;
  const res = await api.get<CandidateSearchResult[]>(url);
  return res.data;
}

/** 1.7 Preseleccionar candidato */
export async function preselectCandidate(
  data: PreselectionPayload
): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>(
    API_ENDPOINTS.hiring.preselection,
    data
  );
  return res.data;
}

/** 1.8 Avanzar estado de preselección */
export async function updatePreselectionStatus(
  id: string,
  status: 'AVANZADO' | 'RECHAZADO'
): Promise<{ message: string }> {
  const res = await api.patch<{ message: string }>(
    API_ENDPOINTS.hiring.preselectionStatus(id, status)
  );
  return res.data;
}
