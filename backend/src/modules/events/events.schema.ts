import {z} from 'zod';

export const enrollUserInEventSchema = z.object({
    params: z.object({
        id: z.string().uuid()
    })
});

export const createEventSchema = z.object({
    title: z.string().min(1),
    type: z.string().min(1),
    day: z.string().min(1),
    link: z.string().min(1)
});