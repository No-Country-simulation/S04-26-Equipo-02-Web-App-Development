import { prisma } from '../../utils/prisma';
import { UpdateProfileInput, ExperienceInput } from './profiles.schema';

export const getProfileByUserId = async (userId: string) => {
  return await prisma.professionalProfile.findUnique({
    where: { userId },
    include: {
      experience: { orderBy: { startDate: 'desc' } },
      education: { orderBy: { year: 'desc' } },
      certifications: true,
      languages: true,
      skills: {
        include: {
          skill: true
        }
      }
    }
  });
};

export const updateProfile = async (userId: string, data: UpdateProfileInput) => {
  let scoreBonus = 0;
  const keyFields: (keyof UpdateProfileInput)[] = ['professionalTitle', 'valueProposition', 'bio', 'linkedinUrl', 'location'];

  keyFields.forEach(field => {
    if (data[field] && data[field] !== '') {
      scoreBonus += 5;
    }
  });

  return await prisma.professionalProfile.update({
    where: { userId },
    data: {
      ...data,
      completionScore: {
        increment: scoreBonus // ejemplo
      }
    }
  });
};

export const getProfileBySlug = async (slug: string) => {
  return await prisma.professionalProfile.findUnique({
    where: { slug },
    include: {
      experience: { orderBy: { startDate: 'desc' } },
      education: { orderBy: { year: 'desc' } },
      certifications: true,
      languages: true,
      skills: {
        include: {
          skill: true
        }
      }
    }
  });
};

export const addExperience = async (userId: string, data: ExperienceInput) => {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!profile) throw new Error('PROFILE_NOT_FOUND');

  return await prisma.workExperience.create({
    data: {
      ...data,
      profileId: profile.id
    }
  });
};

export const deleteExperience = async (userId: string, experienceId: string) => {
  const profile = await prisma.professionalProfile.findUnique({
    where: { userId },
    select: { id: true }
  });

  if (!profile) throw new Error('PROFILE_NOT_FOUND');

  return await prisma.workExperience.delete({
    where: { 
      id: experienceId,
      profileId: profile.id
    }
  });
};
