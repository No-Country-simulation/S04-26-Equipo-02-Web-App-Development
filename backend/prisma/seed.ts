/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // ─── Skills ───────────────────────────────────────────────────────────────
  const skills = [
    // DIGITALES
    { name: 'IA Generativa para Productividad', category: 'DIGITAL', description: 'Uso de ChatGPT, Gemini y herramientas de IA para optimizar tareas de gestión.' },
    { name: 'Herramientas de Colaboración Cloud', category: 'DIGITAL', description: 'Dominio de Slack, Microsoft Teams, Google Workspace y entornos compartidos.' },
    { name: 'Ciberseguridad y Privacidad', category: 'DIGITAL', description: 'Protección de datos sensibles y buenas prácticas en entornos digitales.' },
    { name: 'Análisis de Datos para Decisión', category: 'DIGITAL', description: 'Capacidad de interpretar dashboards y métricas de negocio.' },
    { name: 'Metodologías Ágiles', category: 'DIGITAL', description: 'Gestión de proyectos bajo marcos de trabajo como Scrum o Kanban.' },

    // COGNITIVAS
    { name: 'Resolución de Problemas Complejos', category: 'COGNITIVE', description: 'Habilidad para desglosar problemas multicausales y proponer soluciones.' },
    { name: 'Pensamiento Crítico', category: 'COGNITIVE', description: 'Análisis objetivo de situaciones y evaluación de información.' },
    { name: 'Learnability', category: 'COGNITIVE', description: 'Capacidad de aprender nuevas competencias de forma autónoma y continua.' },
    { name: 'Toma de Decisiones Estratégicas', category: 'COGNITIVE', description: 'Elección de alternativas basadas en impacto a largo plazo.' },
    { name: 'Creatividad e Innovación', category: 'COGNITIVE', description: 'Generación de ideas nuevas aplicadas a procesos existentes.' },

    // SOCIOEMOCIONALES
    { name: 'Liderazgo de Equipos Híbridos', category: 'SOCIOEMOTIONAL', description: 'Gestión de personas en entornos presenciales y remotos simultáneamente.' },
    { name: 'Comunicación Asertiva', category: 'SOCIOEMOTIONAL', description: 'Expresión clara y respetuosa en entornos corporativos de alta presión.' },
    { name: 'Gestión de la Diversidad Generacional', category: 'SOCIOEMOTIONAL', description: 'Habilidad para liderar y colaborar con personas de distintas edades (Gen Z, Millennials).' },
    { name: 'Resiliencia y Adaptabilidad', category: 'SOCIOEMOTIONAL', description: 'Capacidad de mantener el rendimiento ante cambios bruscos del mercado.' },
    { name: 'Mentoría y Coaching', category: 'SOCIOEMOTIONAL', description: 'Habilidad para transmitir experiencia y guiar el crecimiento de otros perfiles.' },
  ];

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: {
        name: skill.name,
        category: skill.category as any,
        description: skill.description,
      },
    });
  }
  console.log('✅ Skills sembradas correctamente');

  // ─── Learning Paths ───────────────────────────────────────────────────────
  const learningPaths = [
    {
      title: 'Habilidades Digitales Clave',
      description: 'Domina las herramientas y tecnologías que el mercado laboral moderno exige. Desde inteligencia artificial hasta metodologías ágiles, esta ruta te prepara para la transformación digital.',
      category: 'DIGITAL' as const,
      courses: [
        { title: 'Introducción a la IA Generativa', description: 'Aprende a usar ChatGPT, Gemini y Copilot para automatizar tareas repetitivas y mejorar tu productividad diaria. Casos prácticos para perfiles de gestión.', order: 1 },
        { title: 'Colaboración en la Nube con Google Workspace y Teams', description: 'Domina el trabajo asincrónico y remoto. Gestión de documentos compartidos, reuniones efectivas y coordinación de equipos distribuidos.', order: 2 },
        { title: 'Análisis de Datos para la Toma de Decisiones', description: 'Aprende a leer dashboards, interpretar KPIs y presentar información de negocio de forma clara. Uso básico de Excel avanzado y Google Data Studio.', order: 3 },
        { title: 'Metodologías Ágiles: Scrum y Kanban en la Práctica', description: 'Entiende los marcos de trabajo ágiles desde el rol de líder o participante. Ceremonia de sprints, gestión de backlogs y retroalimentación continua.', order: 4 },
      ],
    },
    {
      title: 'Competencias Cognitivas de Alto Impacto',
      description: 'Potencia tu capacidad analítica, creativa y estratégica. Estas habilidades son las más valoradas en perfiles senior que deben tomar decisiones complejas en entornos de alta incertidumbre.',
      category: 'COGNITIVE' as const,
      courses: [
        { title: 'Pensamiento Crítico y Resolución de Problemas', description: 'Técnicas estructuradas para desglosar problemas complejos, evaluar evidencias y proponer soluciones con impacto. Metodología de los 5 Porqués y Diagrama de Ishikawa.', order: 1 },
        { title: 'Toma de Decisiones Estratégicas bajo Incertidumbre', description: 'Frameworks para decidir con información incompleta. Análisis de riesgos, pensamiento prospectivo y evaluación de escenarios. Ideal para roles gerenciales.', order: 2 },
        { title: 'Creatividad e Innovación Aplicada', description: 'Métodos para generar ideas disruptivas en organizaciones establecidas. Design Thinking, SCAMPER y técnicas de brainstorming estructurado para equipos.', order: 3 },
        { title: 'Learnability: Aprende a Aprender en la Era Digital', description: 'Estrategias de aprendizaje autónomo para mantenerse actualizado en un mercado que cambia constantemente. Técnicas de Pomodoro, mapas mentales y microaprendizaje.', order: 4 },
      ],
    },
    {
      title: 'Liderazgo y Habilidades Socioemocionales',
      description: 'Las habilidades blandas son el diferencial de los perfiles senior. Esta ruta desarrolla tu inteligencia emocional, tu capacidad de liderazgo y tu habilidad para conectar con personas de distintas generaciones.',
      category: 'SOCIOEMOTIONAL' as const,
      courses: [
        { title: 'Liderazgo de Equipos Híbridos y Remotos', description: 'Cómo liderar con efectividad en entornos presenciales y remotos simultáneamente. Confianza, autonomía, motivación y gestión del desempeño a distancia.', order: 1 },
        { title: 'Comunicación Asertiva en Entornos Corporativos', description: 'Técnicas para comunicarte con claridad, respeto y firmeza en situaciones de presión. Feedback constructivo, manejo de conflictos y negociación efectiva.', order: 2 },
        { title: 'Gestión de la Diversidad Generacional', description: 'Cómo colaborar y liderar equipos con Gen Z, Millennials y otras generaciones. Puentes de comunicación, motivaciones distintas y construcción de cultura inclusiva.', order: 3 },
        { title: 'Mentoría, Coaching y Transferencia de Experiencia', description: 'Herramientas para acompañar el crecimiento de perfiles más jóvenes. Técnicas de coaching, escucha activa y cómo capitalizar tu experiencia en valor para la organización.', order: 4 },
      ],
    },
  ];

  for (const pathData of learningPaths) {
    const { courses, ...pathInfo } = pathData;

    const learningPath = await prisma.learningPath.upsert({
      where: { title: pathInfo.title },
      update: { description: pathInfo.description, category: pathInfo.category },
      create: pathInfo,
    });

    for (const course of courses) {
      await prisma.course.upsert({
        where: { learningPathId_order: { learningPathId: learningPath.id, order: course.order } },
        update: { title: course.title, description: course.description },
        create: { ...course, learningPathId: learningPath.id },
      });
    }

    console.log(`✅ Ruta sembrada: "${pathInfo.title}" (${pathInfo.category}) con ${courses.length} cursos`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
