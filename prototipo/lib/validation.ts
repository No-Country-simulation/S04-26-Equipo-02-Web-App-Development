import { z } from "zod";

/**
 * Esquema de validación para el Registro
 * Se usa tanto en el Frontend (validación inmediata) 
 * como en el Backend (protección final).
 */
export const registerSchema = z.object({
  name: z.string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre es demasiado largo"),
  email: z.string()
    .email("Por favor, introduce un correo electrónico válido"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe incluir al menos una letra mayúscula")
    .regex(/[a-z]/, "Debe incluir al menos una letra minúscula") // Nueva!
    .regex(/[0-9]/, "Debe incluir al menos un número")
    .regex(/[^A-Za-z0-9]/, "Debe incluir al menos un carácter especial"),
});

/**
 * Esquema de validación para el Login
 */
export const loginSchema = z.object({
  email: z.string()
    .email("Por favor, introduce un correo electrónico válido"),
  password: z.string()
    .min(1, "La contraseña es obligatoria"),
});

// Inferencia de tipos para usar en los componentes
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
