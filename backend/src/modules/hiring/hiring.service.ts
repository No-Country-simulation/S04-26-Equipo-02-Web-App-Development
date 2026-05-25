import { z } from 'zod';
import { prisma } from '../../utils/prisma';
import { searchCandidatesSchema } from './hiring.schema';

export const searchCandidatesService = async (parsed: z.infer<typeof searchCandidatesSchema>) => {


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
            ...(parsed.salaryExpectation && {
                salaryExpectation: {
                    contains: parsed.salaryExpectation,
                    mode: 'insensitive',
                },
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
        const experience = parsed.experience;
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

export const createOfferService = async (userId: string, parsedBody: any) => {

    const { title, salaryRange, contractType, modality, description, education, experience } = parsedBody;

    const companyProfile = await prisma.companyProfile.findUnique({
        where: { userId: userId }
    });

    if (!companyProfile) {
        throw new Error("COMPANY_PROFILE_NOT_FOUND");
    }

    await prisma.jobOffer.create({
        data: {
            companyId: companyProfile.id,
            title,
            salaryRange,
            contractType,
            modality,
            description,
            education,
            experience
        },
    });

    return "Oferta de trabajo creada";
}

export const updateOfferService = async (userId: string, parsedBody: any) => {

    const { id, title, salaryRange, contractType, modality, description, education, experience } = parsedBody;

    const companyProfile = await prisma.companyProfile.findUnique({
        where: { userId: userId }
    });

    if (!companyProfile) {
        throw new Error("COMPANY_PROFILE_NOT_FOUND");
    }

    await prisma.jobOffer.update({
        where: { id: id },
        data: {
            ...(title && { title }),
            ...(salaryRange && { salaryRange }),
            ...(contractType && { contractType }),
            ...(modality && { modality }),
            ...(description && { description }),
            ...(education && { education }),
            ...(experience && { experience }),
            updatedAt: new Date()
        },
    });

    return "Oferta de trabajo actualizada";
}

export const deleteOfferService = async (id: string) => {

    await prisma.jobOffer.delete({
        where: { id: id }
    });

    return "Oferta de trabajo eliminada";
}

export const getOffersService = async (userId: string) => {

    const companyProfile = await prisma.companyProfile.findUnique({
        where: { userId: userId }
    });

    if (!companyProfile) {
        throw new Error("COMPANY_PROFILE_NOT_FOUND");
    }

    const offers = await prisma.jobOffer.findMany({
        where: {
            companyId: companyProfile.id
        }
    });

    return offers;

}