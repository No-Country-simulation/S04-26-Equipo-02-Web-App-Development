import { prisma } from '../../utils/prisma';

export const getAllSkills = async () => {
  return await prisma.skill.findMany({
    orderBy: { category: 'asc' }
  });
};

export const processDiagnosticResults = async (userId: string, answers: { skillId: string, score: number }[]) => {
  return await prisma.$transaction(async (tx) => {
    const profile = await tx.professionalProfile.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!profile) {
      throw new Error('No se encontró el perfil del profesional. Asegúrate de que el usuario tenga un perfil creado.');
    }

    const diagnosticEntries = answers.map((ans) => ({
      userId,
      skillId: ans.skillId,
      score: ans.score,
    }));

    await tx.diagnosticResult.createMany({
      data: diagnosticEntries,
    });

    for (const ans of answers) {
      await tx.profileSkill.upsert({
        where: {
          profileId_skillId: {
            profileId: profile.id,
            skillId: ans.skillId,
          },
        },
        update: {},
        create: {
          profileId: profile.id,
          skillId: ans.skillId,
          isVerified: false,
        },
      });
    }

    const updatedProfile = await tx.professionalProfile.update({
      where: { id: profile.id },
      data: {
        completionScore: { increment: 20 }
      },
    });

    return {
      message: 'Diagnóstico procesado y habilidades vinculadas al perfil',
      newCompletionScore: updatedProfile.completionScore,
    };
  });
};
