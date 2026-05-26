import {z} from 'zod';

export const enrollUserInEventSchema = z.object({
    params: z.object({
        id: z.string().uuid()
    })
})