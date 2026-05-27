import api from './axios';
import { API_ENDPOINTS } from '../lib/constants';

// ── Types ────────────────────────────────────────────────────────────────────

export interface BackendEvent {
  id: string;
  title: string;
  type: string;
  day: string;
  link: string;
  createdAt: string;
}

export interface CreateEventPayload {
  title: string;
  type: string;
  day: string;
  link: string;
}

// ── API Functions ────────────────────────────────────────────────────────────

/** 2.1 Obtener todos los eventos */
export async function getAllEvents(): Promise<BackendEvent[]> {
  const res = await api.get<BackendEvent[]>(API_ENDPOINTS.events.getAll);
  return res.data;
}

/** 2.2 Inscribirse en un evento (PROFESSIONAL) */
export async function enrollEvent(
  id: string
): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>(
    API_ENDPOINTS.events.enroll(id)
  );
  return res.data;
}

/** 2.3 Crear un evento (ADMIN) */
export async function createEvent(
  data: CreateEventPayload
): Promise<{ message: string }> {
  const res = await api.post<{ message: string }>(
    API_ENDPOINTS.events.create,
    data
  );
  return res.data;
}
