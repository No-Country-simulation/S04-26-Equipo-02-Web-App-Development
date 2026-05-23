import { z } from 'zod';

export const updateProgressSchema = z.object({
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']),
});

export type UpdateProgressInput = z.infer<typeof updateProgressSchema>;
