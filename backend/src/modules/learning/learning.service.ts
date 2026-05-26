import { prisma } from '../../utils/prisma';
import { CourseStatus, SkillCategory } from '@prisma/client';

export const getLearningPaths = async () => {
  return await prisma.learningPath.findMany({
    where: { isActive: true },
    include: {
      courses: {
        orderBy: { order: 'asc' },
      },
    },
  });
};

const mapCourseToSkillName = (courseTitle: string): string[] => {
  const title = courseTitle.toLowerCase();
  
  if (title.includes('ia generativa')) return ['IA Generativa para Productividad'];
  if (title.includes('colaboración en la nube') || title.includes('google workspace')) return ['Herramientas de Colaboración Cloud'];
  if (title.includes('análisis de datos')) return ['Análisis de Datos para Decisión'];
  if (title.includes('metodologías ágiles') || title.includes('scrum')) return ['Metodologías Ágiles'];
  
  if (title.includes('pensamiento crítico') || title.includes('resolución de problemas')) {
    return ['Pensamiento Crítico', 'Resolución de Problemas Complejos'];
  }
  if (title.includes('decisiones estratégicas')) return ['Toma de Decisiones Estratégicas'];
  if (title.includes('creatividad e innovación')) return ['Creatividad e Innovación'];
  if (title.includes('learnability') || title.includes('aprende a aprender')) return ['Learnability'];
  
  if (title.includes('liderazgo de equipos') || title.includes('híbridos')) return ['Liderazgo de Equipos Híbridos'];
  if (title.includes('comunicación asertiva')) return ['Comunicación Asertiva'];
  if (title.includes('diversidad generacional')) return ['Gestión de la Diversidad Generacional'];
  if (title.includes('mentoría') || title.includes('coaching')) {
    return ['Mentoría y Coaching', 'Resiliencia y Adaptabilidad'];
  }
  
  return [];
};

/**
 * obtiene el progreso del usuario. si no existe progreso inicializado,
 * analiza los resultados de su diagnóstico para auto-recomendar la ruta
 * de la categoría con menor puntaje promedio en el diagnóstico..
 */
export const getUserProgress = async (userId: string) => {
  const existingProgress = await prisma.courseProgress.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          learningPath: true,
        },
      },
    },
    orderBy: { course: { order: 'asc' } },
  });

  if (existingProgress.length > 0) {
    return existingProgress;
  }

  const diagnosticResults = await prisma.diagnosticResult.findMany({
    where: { userId },
    include: { skill: true },
  });

  if (diagnosticResults.length === 0) {
    return [];
  }

  const categoryScores: Record<SkillCategory, { total: number; count: number }> = {
    DIGITAL: { total: 0, count: 0 },
    COGNITIVE: { total: 0, count: 0 },
    SOCIOEMOTIONAL: { total: 0, count: 0 },
  };

  diagnosticResults.forEach((res) => {
    const category = res.skill.category;
    categoryScores[category].total += res.score;
    categoryScores[category].count += 1;
  });

  let recommendedCategory: SkillCategory = 'DIGITAL';
  let lowestAverage = Infinity;

  (Object.keys(categoryScores) as SkillCategory[]).forEach((cat) => {
    const data = categoryScores[cat];
    const average = data.count > 0 ? data.total / data.count : 0;
    if (average < lowestAverage) {
      lowestAverage = average;
      recommendedCategory = cat;
    }
  });

  const recommendedPath = await prisma.learningPath.findFirst({
    where: { category: recommendedCategory, isActive: true },
    include: { courses: { orderBy: { order: 'asc' } } },
  });

  if (!recommendedPath) {
    return [];
  }

  const progressData = recommendedPath.courses.map((course) => ({
    userId,
    courseId: course.id,
    status: CourseStatus.PENDING,
  }));

  await prisma.courseProgress.createMany({
    data: progressData,
  });

  return await prisma.courseProgress.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          learningPath: true,
        },
      },
    },
    orderBy: { course: { order: 'asc' } },
  });
};


export const updateCourseProgress = async (userId: string, courseId: string, status: CourseStatus) => {
  const progress = await prisma.courseProgress.findFirst({
    where: { userId, courseId },
    include: { course: true },
  });

  let updatedProgress;

  if (progress) {
    updatedProgress = await prisma.courseProgress.update({
      where: { id: progress.id },
      data: { status, updatedAt: new Date() },
      include: {
        course: {
          include: {
            learningPath: true,
          },
        },
      },
    });
  } else {
    updatedProgress = await prisma.courseProgress.create({
      data: {
        userId,
        courseId,
        status,
      },
      include: {
        course: {
          include: {
            learningPath: true,
          },
        },
      },
    });
  }

  if (status === CourseStatus.COMPLETED && updatedProgress.course) {
    const courseTitle = updatedProgress.course.title;
    const skillNamesToVerify = mapCourseToSkillName(courseTitle);

    if (skillNamesToVerify.length > 0) {
      const profile = await prisma.professionalProfile.findUnique({
        where: { userId },
        select: { id: true },
      });

      if (profile) {
        const skills = await prisma.skill.findMany({
          where: {
            name: { in: skillNamesToVerify },
          },
          select: { id: true },
        });

        const skillIds = skills.map((s) => s.id);

        if (skillIds.length > 0) {
          await prisma.profileSkill.updateMany({
            where: {
              profileId: profile.id,
              skillId: { in: skillIds },
            },
            data: {
              isVerified: true,
            },
          });
        }
      }
    }
  }

  return updatedProgress;
};
