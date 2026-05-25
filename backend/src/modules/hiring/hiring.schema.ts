import { z } from 'zod';

export const searchCandidatesSchema = z.object({
    professionalTitle: z.string().optional(),
    yearsOfExperience: z.coerce.number().optional(),
    location: z.string().optional(),
    availability: z.string().optional(),
    preferredModality: z.string().optional(),
    salaryExpectation: z.string().optional(),
    experience: z.union([
        z.coerce.number(),
        z.string(),
        z.array(
            z.union([
                z.coerce.number(),
                z.string()
            ])
        )
    ])
        .transform(val => {
            const values = Array.isArray(val) ? val : [val];

            return {
                years: values.find(
                    (v): v is number => typeof v === 'number'
                ),
                roles: values.filter(
                    (v): v is string => typeof v === 'string'
                )
            };
        })
        .optional(),
    education: z.union([
        z.string(),
        z.array(z.string())
    ]).transform(val => {
        const values = Array.isArray(val) ? val : [val];

        return {
            degrees: values.filter(v =>
                !['graduated', 'in-progress'].includes(v)
            )
        };
    })
        .optional(),
    certifications: z.union([z.string(), z.array(z.object({
        name: z.string().optional(),
        issuer: z.string().optional()
    }))])
        .transform(val => Array.isArray(val) ? val : [val])
        .optional(),
    languages: z.union([z.string(), z.array(z.string())])
        .transform(val => Array.isArray(val) ? val : [val])
        .optional(),
    skills: z.union([z.string(), z.array(z.string())])
        .transform(val => Array.isArray(val) ? val : [val])
        .optional()
});

export const createOfferSchema = z.object({
    title: z.string(),
    salaryRange: z.string(),
    contractType: z.string(),
    modality: z.string(),
    description: z.string(),
    education: z.string(),
    experience: z.string()
});

export const updateOfferSchema = z.object({
    id: z.string(),
    title: z.string().optional(),
    salaryRange: z.string().optional(),
    contractType: z.string().optional(),
    modality: z.string().optional(),
    description: z.string().optional(),
    education: z.string().optional(),
    experience: z.string().optional()
});

export const searchOpportunitiesSchema = z.object({
    title: z.string().optional(),
    salaryRange: z.string().optional(),
    contractType: z.string().optional(),
    modality: z.string().optional(),
    experience: z.string().optional(),
    education: z.string().optional(),
    orderBy: z.enum(['updatedAt']).optional()
});

export const preselectionSchema = z.object({
    userId: z.string(),
    notes: z.string()
});