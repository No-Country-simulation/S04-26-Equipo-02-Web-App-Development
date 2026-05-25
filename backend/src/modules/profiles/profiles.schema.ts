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
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  description: z.string().max(2000).optional(),
});

export const languageSchema = z.object({
  name: z.string().min(2, 'El nombre del idioma es obligatorio'),
  level: z.string().min(2, 'El nivel es obligatorio (Ej: B2 - Avanzado)'),
});

export const educationSchema = z.object({
  institution: z.string().min(2, 'La institución es obligatoria'),
  degree: z.string().min(2, 'El título/grado es obligatorio'),
  year: z.number().min(1950).max(new Date().getFullYear()),
});

export const certificationSchema = z.object({
  name: z.string().min(2, 'El nombre de la certificación es obligatorio'),
  issuer: z.string().min(2, 'La entidad emisora es obligatoria'),
  issueDate: z.coerce.date().optional().nullable(),
  url: z.string().url('URL de certificación inválida').optional().nullable().or(z.literal('')),
});

export const companyProfileSchema = z.object({
  companyName: z.string().min(2, 'El nombre de la empresa debe tener al menos 2 caracteres').optional(),
  industry: z.string().max(100).optional(),
  description: z.string().max(2000).optional(),
  website: z.string().url('URL de sitio web inválida').optional().or(z.literal('')),
  logoUrl: z.string().url('URL de logo inválida').optional().or(z.literal('')),
});

export const addSkillSchema = z.object({
  skillId: z.string().uuid('El skillId debe ser un UUID válido'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type LanguageInput = z.infer<typeof languageSchema>;
export type EducationInput = z.infer<typeof educationSchema>;
export type CertificationInput = z.infer<typeof certificationSchema>;
export type CompanyProfileInput = z.infer<typeof companyProfileSchema>;
export type AddSkillInput = z.infer<typeof addSkillSchema>;
