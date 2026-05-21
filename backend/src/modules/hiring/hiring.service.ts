import { prisma } from '../../utils/prisma';
import { searchCandidatesSchema } from './hiring.schema';

export const searchCandidatesService = async (query: Object) => {

    const parsed = searchCandidatesSchema.parse(query);

    const { experience } = parsed;

    const candidates = await prisma.professionalProfile.findMany({
        where: {
            ...(parsed.professionalTitle && {
                professionalTitle: {
                    contains: parsed.professionalTitle,
                    mode: 'insensitive',
                },
            }),
            ...(parsed.yearsOfExperience && {
                yearsOfExperience: {
                    gte: parsed.yearsOfExperience,
                },
            }),
            ...(parsed.location && {
                location: {
                    contains: parsed.location,
                    mode: 'insensitive',
                },
            }),
            ...(parsed.availability && {
                availability: parsed.availability as any,
            }),
            ...(parsed.preferredModality && {
                preferredModality: parsed.preferredModality as any,
            }),
            ...(parsed.skills?.length && {
                skills: {
                    some: {
                        skill: {
                            name: { in: parsed.skills, mode: 'insensitive' },
                        },
                    },
                },
            }),
            ...(parsed.experience?.roles?.length && {
                experience: {
                    some: {
                        role: { in: parsed.experience.roles, mode: 'insensitive' }
                    },
                },
            }),
            ...(parsed.education?.degrees?.length && {
                education: {
                    some: {
                        OR: parsed.education.degrees.map(degree => ({
                            degree: {
                                contains: degree,
                                mode: 'insensitive' as const,
                            }
                        })),
                    },
                },
            }),
            ...(parsed.certifications?.length && {
                certifications: {
                    some: {
                        OR: (parsed.certifications as any[]).map(cert => {
                            if (typeof cert === 'string') {
                                return {
                                    OR: [
                                        { name: { contains: cert, mode: 'insensitive' as const } },
                                        { issuer: { contains: cert, mode: 'insensitive' as const } }
                                    ]
                                };
                            } else {
                                return {
                                    AND: [
                                        ...(cert.name ? [{ name: { contains: cert.name, mode: 'insensitive' as const } }] : []),
                                        ...(cert.issuer ? [{ issuer: { contains: cert.issuer, mode: 'insensitive' as const } }] : [])
                                    ]
                                };
                            }
                        })
                    },
                },
            }),
            ...(parsed.languages?.length && {
                languages: {
                    some: {
                        name: { in: parsed.languages, mode: 'insensitive' },
                    },
                },
            }),
        },
        include: {
            skills: { include: { skill: true } },
            experience: true,
            education: true,
            certifications: true,
            languages: true,
        },
        orderBy: {
            completionScore: 'desc',
        },
    });

    const filteredCandidates = candidates.filter(candidate => {
        const yearsRequired = experience?.years;

        if (!yearsRequired) return true;

        const totalMonths = candidate.experience.reduce((acc, exp) => {
            if (
                experience?.roles?.length &&
                !experience.roles.some((role: string) =>
                    exp.role.toLowerCase().includes(role.toLowerCase())
                )
            ) {
                return acc;
            }

            const start = new Date(exp.startDate);
            const end = exp.endDate
                ? new Date(exp.endDate)
                : new Date();

            const months =
                (end.getFullYear() - start.getFullYear()) * 12 +
                (end.getMonth() - start.getMonth());

            return acc + months;
        }, 0);

        return (totalMonths / 12) >= yearsRequired;
    });

    return filteredCandidates;
};