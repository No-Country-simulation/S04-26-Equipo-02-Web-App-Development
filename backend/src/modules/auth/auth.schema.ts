import { z } from 'zod';
import { Role } from "@prisma/client";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    provider: z.string()
});

export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    provider: z.nativeEnum(Role),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    location: z.string().min(1),
    phone: z.string().min(1)
});

export const validateEmailSchema = z.object({
    token: z.string().min(1)
});