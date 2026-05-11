import { z } from 'zod';

export const updateProfileSchema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().optional(),
  phone: z.string().optional(),
});
