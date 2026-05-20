import { z } from 'zod';

// Schema para inicio de sesión
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
  provider: z.enum(['professional', 'company']),
});

// Schema para registro (profesional o empresa)
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'El nombre es requerido')
      .min(2, 'El nombre debe tener al menos 2 caracteres'),
    lastName: z
      .string()
      .min(1, 'El apellido es requerido')
      .min(2, 'El apellido debe tener al menos 2 caracteres'),
    email: z
      .string()
      .min(1, 'El email es requerido')
      .email('Ingresa un email válido'),
    password: z
      .string()
      .min(1, 'La contraseña es requerida')
      .min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmar contraseña es requerido'),
    role: z.enum(['professional', 'company']),
    location: z
      .string()
      .min(1, 'La ubicación es requerida'),
    phone: z
      .string()
      .min(1, 'El teléfono es requerido'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

// Schema para inicio de sesión de administrador (ADM)
export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido'),
  password: z
    .string()
    .min(1, 'La contraseña es requerida')
    .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

// Tipos inferidos de los schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;