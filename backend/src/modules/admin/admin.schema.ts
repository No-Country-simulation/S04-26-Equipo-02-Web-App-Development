import {z} from 'zod';

export const createAdminSchema = z.object({
    email: z.string().email()
})

export const queryAdminSchema = z.object({
    role: z.enum(['ADMIN', 'PROFESSIONAL', 'COMPANY']).optional(),
    email: z.string().email().optional()
})