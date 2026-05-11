import { prisma } from '../../utils/prisma';

export const processDiagnosticResults = async (userId: string, answers: { skillId: string, score: number }[]) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Obtener el perfil del usuario (necesitamos el profileId, no solo el userId)
    const profile = await tx.professionalProfile.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!profile) {
      throw new Error('No se encontró el perfil del profesional. Asegúrate de que el usuario tenga un perfil creado.');
    }

    // 2. Guardar resultados históricos del diagnóstico
    const diagnosticEntries = answers.map((ans) => ({
      userId,
      skillId: ans.skillId,
      score: ans.score,
    }));

    await tx.diagnosticResult.createMany({
      data: diagnosticEntries,
    });

    // 3. Vincular o actualizar habilidades en el perfil profesional
    for (const ans of answers) {
      await tx.profileSkill.upsert({
        where: {
          profileId_skillId: {
            profileId: profile.id,
            skillId: ans.skillId,
          },
        },
        update: {}, // Por ahora no actualizamos el nivel aquí, solo aseguramos que exista
        create: {
          profileId: profile.id,
          skillId: ans.skillId,
          isVerified: false,
        },
      });
    }

    // 4. Actualizar el score de completitud del perfil (+20 puntos)
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
