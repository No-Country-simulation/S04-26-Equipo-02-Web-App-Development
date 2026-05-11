import { Prisma } from '@prisma/client';
import { prisma } from '../../utils/prisma';

export const getProfileByUserId = async (userId: string) => {
  return await prisma.professionalProfile.findUnique({
    where: { userId },
    include: {
      skills: { include: { skill: true } },
      experience: true,
      education: true,
    },
  });
};

export const updateProfile = async (userId: string, data: Prisma.ProfessionalProfileUpdateInput) => {
  return await prisma.professionalProfile.update({
    where: { userId },
    data,
  });
};
