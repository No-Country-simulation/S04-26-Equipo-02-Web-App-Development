import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as dotenv from "dotenv";
import { learningModules } from "./schema";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const client = postgres(process.env.DATABASE_URL);
const db = drizzle(client);

const seedModules = [
  // ---- DIGITAL (4 modules) ----
  {
    title: "Presencia Digital y Marca Personal",
    description: "Aprende a construir tu marca personal online. Optimiza tu perfil de LinkedIn, crea contenido profesional y destaca tu experiencia en el mundo digital.",
    category: "DIGITAL" as const,
    contentType: "TALLER" as const,
    durationMinutes: 45,
    difficultyLevel: 1,
    orderInPath: 1,
    content: "En este módulo aprenderás a:\n\n1. **Optimizar tu perfil de LinkedIn** — Foto profesional, titular impactante, resumen que cuente tu historia.\n2. **Crear contenido relevante** — Publica artículos y posts que muestren tu expertise.\n3. **Networking digital** — Cómo conectar con reclutadores y líderes de tu industria.\n4. **Personal Branding** — Define tu propuesta de valor única como profesional +45.",
    resourceUrl: "https://www.linkedin.com/learning/",
    isActive: true,
  },
  {
    title: "Herramientas Colaborativas en la Nube",
    description: "Domina Google Workspace, Microsoft 365 y herramientas de gestión como Trello y Notion para el trabajo remoto moderno.",
    category: "DIGITAL" as const,
    contentType: "VIDEO" as const,
    durationMinutes: 60,
    difficultyLevel: 1,
    orderInPath: 2,
    content: "Contenido del módulo:\n\n1. **Google Workspace** — Drive, Docs, Sheets, Slides para trabajo colaborativo.\n2. **Microsoft 365** — Teams, OneDrive, SharePoint.\n3. **Gestión de proyectos** — Trello, Notion, Asana para organizar tu trabajo.\n4. **Comunicación efectiva** — Zoom, Meet, Slack y buenas prácticas de comunicación remota.",
    resourceUrl: null,
    isActive: true,
  },
  {
    title: "Introducción a la Inteligencia Artificial",
    description: "Descubre cómo las herramientas de IA como ChatGPT, Copilot y Gemini pueden potenciar tu productividad profesional sin necesidad de programar.",
    category: "DIGITAL" as const,
    contentType: "LECTURA" as const,
    durationMinutes: 40,
    difficultyLevel: 2,
    orderInPath: 3,
    content: "Temas clave:\n\n1. **¿Qué es la IA?** — Conceptos accesibles para profesionales no técnicos.\n2. **ChatGPT en tu día a día** — Redacción de emails, resúmenes, análisis de datos.\n3. **Copilot y productividad** — Automatización en Office/Google.\n4. **IA para tu búsqueda laboral** — Optimización de CV, preparación de entrevistas.",
    resourceUrl: null,
    isActive: true,
  },
  {
    title: "Ciberseguridad Personal y Profesional",
    description: "Protege tu identidad digital, gestiona contraseñas de forma segura y reconoce amenazas como phishing y estafas online.",
    category: "DIGITAL" as const,
    contentType: "QUIZ" as const,
    durationMinutes: 30,
    difficultyLevel: 1,
    orderInPath: 4,
    content: "En este módulo evaluaremos tus conocimientos sobre:\n\n1. **Gestión de contraseñas** — Managers, autenticación de dos factores.\n2. **Phishing y estafas** — Cómo identificar correos y sitios web fraudulentos.\n3. **Privacidad en redes** — Configuración de privacidad en tus cuentas.\n4. **Navegación segura** — VPN, HTTPS, wifi público.",
    resourceUrl: null,
    isActive: true,
  },

  // ---- SOCIOEMOCIONAL (4 modules) ----
  {
    title: "Resiliencia y Gestión del Cambio",
    description: "Desarrolla habilidades emocionales para afrontar la transición laboral con confianza. Aprende a manejar la incertidumbre y convertir los desafíos en oportunidades.",
    category: "SOCIOEMOCIONAL" as const,
    contentType: "TALLER" as const,
    durationMinutes: 50,
    difficultyLevel: 1,
    orderInPath: 1,
    content: "Este taller abarca:\n\n1. **Autoconocimiento emocional** — Identifica qué emociones te frenan y cuáles te impulsan.\n2. **Resiliencia activa** — Técnicas para recuperarte de los rechazos laborales.\n3. **Mindset de crecimiento** — Tu experiencia es tu mayor activo, no tu limitación.\n4. **Plan de acción emocional** — Rutinas diarias para mantener la motivación.",
    resourceUrl: null,
    isActive: true,
  },
  {
    title: "Comunicación Asertiva en Entrevistas",
    description: "Perfecciona tu habilidad para comunicar tu valor profesional con claridad y seguridad en entrevistas, networking y presentaciones.",
    category: "SOCIOEMOCIONAL" as const,
    contentType: "VIDEO" as const,
    durationMinutes: 45,
    difficultyLevel: 2,
    orderInPath: 2,
    content: "Aprenderás:\n\n1. **Elevator Pitch perfecto** — Tu presentación profesional en 60 segundos.\n2. **Storytelling profesional** — Cómo contar tu experiencia de forma memorable.\n3. **Manejo de preguntas difíciles** — \"¿Por qué te fuiste?\" \"¿No sos muy senior?\".\n4. **Lenguaje corporal** — Proyecta confianza y credibilidad.",
    resourceUrl: null,
    isActive: true,
  },
  {
    title: "Inteligencia Emocional en el Trabajo",
    description: "Mejora tu capacidad de relacionarte con equipos multigeneracionales, gestionar conflictos y liderar desde la empatía.",
    category: "SOCIOEMOCIONAL" as const,
    contentType: "LECTURA" as const,
    durationMinutes: 35,
    difficultyLevel: 2,
    orderInPath: 3,
    content: "Módulo sobre:\n\n1. **Las 5 dimensiones de la IE** — Autoconciencia, autorregulación, motivación, empatía, habilidades sociales.\n2. **Equipos multigeneracionales** — Colaborar con millennials y gen Z sin fricciones.\n3. **Gestión de conflictos** — Técnicas de mediación y negociación.\n4. **Liderazgo empático** — Tu experiencia te da una ventaja natural como mentor.",
    resourceUrl: null,
    isActive: true,
  },
  {
    title: "Networking Estratégico",
    description: "Construye y activa tu red de contactos profesionales de forma genuina. Aprende a generar valor en cada conexión.",
    category: "SOCIOEMOCIONAL" as const,
    contentType: "TALLER" as const,
    durationMinutes: 40,
    difficultyLevel: 1,
    orderInPath: 4,
    content: "En este taller práctico:\n\n1. **Mapea tu red actual** — Identifica contactos clave y oportunidades latentes.\n2. **Genera valor primero** — El networking no es pedir, es ofrecer.\n3. **Eventos y comunidades** — Dónde y cómo participar activamente.\n4. **Follow-up efectivo** — Mantén las relaciones vivas sin ser invasivo.",
    resourceUrl: null,
    isActive: true,
  },

  // ---- COGNITIVO (4 modules) ----
  {
    title: "Pensamiento Crítico y Resolución de Problemas",
    description: "Fortalece tu capacidad analítica para tomar decisiones estratégicas, evaluar escenarios complejos y proponer soluciones innovadoras.",
    category: "COGNITIVO" as const,
    contentType: "LECTURA" as const,
    durationMinutes: 45,
    difficultyLevel: 2,
    orderInPath: 1,
    content: "Contenido:\n\n1. **Análisis de problemas** — Framework para descomponer situaciones complejas.\n2. **Toma de decisiones** — Modelos para evaluar opciones con datos.\n3. **Sesgos cognitivos** — Reconoce y evita los errores de pensamiento más comunes.\n4. **Design Thinking** — Metodología creativa para proponer soluciones centradas en el usuario.",
    resourceUrl: null,
    isActive: true,
  },
  {
    title: "Adaptabilidad y Aprendizaje Continuo",
    description: "Desarrolla una mentalidad de aprendizaje permanente. Descubre técnicas para adquirir nuevos conocimientos más rápido a cualquier edad.",
    category: "COGNITIVO" as const,
    contentType: "VIDEO" as const,
    durationMinutes: 35,
    difficultyLevel: 1,
    orderInPath: 2,
    content: "Este módulo cubre:\n\n1. **Neuroplasticidad** — Tu cerebro puede seguir aprendiendo a cualquier edad.\n2. **Técnicas de estudio** — Spaced repetition, mapas mentales, Feynman technique.\n3. **Microlearning** — Aprende en bloques cortos y efectivos.\n4. **Comunidades de práctica** — Aprender haciendo y enseñando.",
    resourceUrl: null,
    isActive: true,
  },
  {
    title: "Gestión del Tiempo y Productividad",
    description: "Optimiza tu día con metodologías probadas de productividad. Prioriza lo importante, elimina distracciones y logra más con menos estrés.",
    category: "COGNITIVO" as const,
    contentType: "TALLER" as const,
    durationMinutes: 40,
    difficultyLevel: 1,
    orderInPath: 3,
    content: "Técnicas que dominarás:\n\n1. **Matriz de Eisenhower** — Urgente vs. importante.\n2. **Pomodoro Technique** — Bloques de enfoque con descansos.\n3. **Time blocking** — Planifica tu semana como un profesional.\n4. **GTD (Getting Things Done)** — Sistema para capturar y ejecutar tareas sin olvidar nada.",
    resourceUrl: null,
    isActive: true,
  },
  {
    title: "Creatividad e Innovación Profesional",
    description: "Libera tu potencial creativo para generar ideas de valor. La experiencia de vida es el mayor catalizador para la innovación.",
    category: "COGNITIVO" as const,
    contentType: "QUIZ" as const,
    durationMinutes: 30,
    difficultyLevel: 2,
    orderInPath: 4,
    content: "Evaluaremos tu capacidad en:\n\n1. **Pensamiento lateral** — Salir de lo convencional para encontrar soluciones únicas.\n2. **Brainstorming estructurado** — Técnicas para generar ideas en equipo.\n3. **Innovación aplicada** — Cómo proponer mejoras en cualquier área de trabajo.\n4. **Tu ventaja como +45** — La experiencia te da un contexto único para innovar.",
    resourceUrl: null,
    isActive: true,
  },
];

async function main() {
  console.log("🌱 Seeding learning modules...");

  for (const mod of seedModules) {
    await db.insert(learningModules).values(mod).onConflictDoNothing();
    console.log(`✅ Added module: ${mod.title} [${mod.category}]`);
  }

  console.log(`\n✨ Seeded ${seedModules.length} learning modules (4 DIGITAL, 4 SOCIOEMOCIONAL, 4 COGNITIVO)`);
  await client.end();
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:");
  console.error(err);
  process.exit(1);
});
