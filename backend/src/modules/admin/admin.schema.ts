import {z} from 'zod';

export const createAdminSchema = z.object({
    email: z.string().email()
})