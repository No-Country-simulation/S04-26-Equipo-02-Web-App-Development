/// <reference types="node" />
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
