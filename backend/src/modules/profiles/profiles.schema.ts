import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').optional(),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres').optional(),
  professionalTitle: z.string().max(100).optional(),
  valueProposition: z.string().max(500).optional(),
  yearsOfExperience: z.number().min(0).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(1000).optional(),
  linkedinUrl: z.string().url('URL de LinkedIn inválida').optional().or(z.literal('')),
  portfolioUrl: z.string().url('URL de portfolio inválida').optional().or(z.literal('')),

  availability: z.enum(['AVAILABLE', 'IN_PROCESS', 'NOT_AVAILABLE']).optional(),
  preferredModality: z.enum(['REMOTE', 'ON_SITE', 'HYBRID']).optional(),
  salaryExpectation: z.string().optional(),
});

export const experienceSchema = z.object({
  company: z.string().min(2, 'El nombre de la empresa es obligatorio'),
  role: z.string().min(2, 'El cargo es obligatorio'),
  startDate: z.coerce.date({ invalid_type_error: 'Fecha de inicio inválida' }),
  endDate: z.coerce.date().optional().nullable(),
  description: z.string().max(2000).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
