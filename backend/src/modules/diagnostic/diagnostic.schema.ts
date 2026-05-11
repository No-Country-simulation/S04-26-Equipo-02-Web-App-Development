import { z } from 'zod';

export const diagnosticAnswersSchema = z.object({
  answers: z.array(z.object({
    skillId: z.string().uuid(),
    score: z.number().min(1).max(5),
  })).min(1),
});
