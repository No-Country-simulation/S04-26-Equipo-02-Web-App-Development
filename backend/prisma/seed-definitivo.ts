import { PrismaClient, Role, SkillCategory, PreselectionStatus, JobAvailability, JobModality } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando siembra definitiva de la base de datos...');

  // ─── Generación de hash de contraseña única para pruebas ───────────────────
  // Contraseña requerida: 123456789
  const passwordHash = await bcrypt.hash('123456789', 12);

  // ─── 1. Habilidades (Skills) ───────────────────────────────────────────────
  const skills = [
    // DIGITALES
    { name: 'IA Generativa para Productividad', category: SkillCategory.DIGITAL, description: 'Uso de ChatGPT, Gemini y herramientas de IA para optimizar tareas de gestión.' },
    { name: 'Herramientas de Colaboración Cloud', category: SkillCategory.DIGITAL, description: 'Dominio de Slack, Microsoft Teams, Google Workspace y entornos compartidos.' },
    { name: 'Ciberseguridad y Privacidad', category: SkillCategory.DIGITAL, description: 'Protección de datos sensibles y buenas prácticas en entornos digitales.' },
    { name: 'Análisis de Datos para Decisión', category: SkillCategory.DIGITAL, description: 'Capacidad de interpretar dashboards y métricas de negocio.' },
    { name: 'Metodologías Ágiles', category: SkillCategory.DIGITAL, description: 'Gestión de proyectos bajo marcos de trabajo como Scrum o Kanban.' },

    // COGNITIVAS
    { name: 'Resolución de Problemas Complejos', category: SkillCategory.COGNITIVE, description: 'Habilidad para desglosar problemas multicausales y proponer soluciones.' },
    { name: 'Pensamiento Crítico', category: SkillCategory.COGNITIVE, description: 'Análisis objetivo de situaciones y evaluación de información.' },
    { name: 'Learnability', category: SkillCategory.COGNITIVE, description: 'Capacidad de aprender nuevas competencias de forma autónoma y continua.' },
    { name: 'Toma de Decisiones Estratégicas', category: SkillCategory.COGNITIVE, description: 'Elección de alternativas basadas en impacto a largo plazo.' },
    { name: 'Creatividad e Innovación', category: SkillCategory.COGNITIVE, description: 'Generación de ideas nuevas aplicadas a procesos existentes.' },

    // SOCIOEMOCIONALES
    { name: 'Liderazgo de Equipos Híbridos', category: SkillCategory.SOCIOEMOTIONAL, description: 'Gestión de personas en entornos presenciales y remotos simultáneamente.' },
    { name: 'Comunicación Asertiva', category: SkillCategory.SOCIOEMOTIONAL, description: 'Expresión clara y respetuosa en entornos corporativos de alta presión.' },
    { name: 'Gestión de la Diversidad Generacional', category: SkillCategory.SOCIOEMOTIONAL, description: 'Habilidad para liderar y colaborar con personas de distintas edades (Gen Z, Millennials).' },
    { name: 'Resiliencia y Adaptabilidad', category: SkillCategory.SOCIOEMOTIONAL, description: 'Capacidad de mantener el rendimiento ante cambios bruscos del mercado.' },
    { name: 'Mentoría y Coaching', category: SkillCategory.SOCIOEMOTIONAL, description: 'Habilidad para transmitir experiencia y guiar el crecimiento de otros perfiles.' },
  ];

  const dbSkills = [];
  for (const skill of skills) {
    const s = await prisma.skill.upsert({
      where: { name: skill.name },
      update: { category: skill.category, description: skill.description },
      create: skill,
    });
    dbSkills.push(s);
  }
  console.log(`✅ Habilidades sembradas: ${dbSkills.length}`);

  // ─── 2. Rutas de Aprendizaje y Cursos (Learning Paths) ─────────────────────
  const learningPaths = [
    {
      title: 'Habilidades Digitales Clave',
      description: 'Domina las herramientas y tecnologías que el mercado laboral moderno exige. Desde inteligencia artificial hasta metodologías ágiles, esta ruta te prepara para la transformación digital.',
      category: SkillCategory.DIGITAL,
      courses: [
        { title: 'Introducción a la IA Generativa', description: 'Aprende a usar ChatGPT, Gemini y Copilot para automatizar tareas repetitivas y mejorar tu productividad diaria. Casos prácticos para perfiles de gestión.', order: 1 },
        { title: 'Colaboración en la Nube con Google Workspace y Teams', description: 'Domina el trabajo asincrónico y remoto. Gestión de documentos compartidos, reuniones efectivas y coordinación de equipos distribuidos.', order: 2 },
        { title: 'Análisis de Datos para la Toma de Decisiones', description: 'Aprende a leer dashboards, interpretar KPIs y presentar información de negocio de forma clara. Uso básico de Excel avanzado y Google Data Studio.', order: 3 },
        { title: 'Metodologías Ágiles: Scrum y Kanban en la Práctica', description: 'Entiende los marcos de trabajo ágiles desde el rol de líder o participant. Ceremonia de sprints, gestión de backlogs y retroalimentación continua.', order: 4 },
      ],
    },
    {
      title: 'Competencias Cognitivas de Alto Impacto',
      description: 'Potencia tu capacidad analítica, creativa y estratégica. Estas habilidades son las más valoradas en perfiles senior que deben tomar decisiones complejas en entornos de alta incertidumbre.',
      category: SkillCategory.COGNITIVE,
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
      category: SkillCategory.SOCIOEMOTIONAL,
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
    console.log(`✅ Ruta sembrada: "${pathInfo.title}" con ${courses.length} cursos`);
  }

  // ─── 3. Usuario Administrador (Admin) ──────────────────────────────────────
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: { passwordHash },
    create: {
      email: 'admin@test.com',
      passwordHash,
      role: Role.ADMIN,
      isActive: true,
    },
  });
  console.log('✅ Usuario ADMIN registrado (admin@test.com)');

  // ─── 4. Usuarios Profesionales (Profiles) ──────────────────────────────────
  // Profesional 1
  const prof1 = await prisma.user.upsert({
    where: { email: 'profesional@test.com' },
    update: { passwordHash },
    create: {
      email: 'profesional@test.com',
      passwordHash,
      role: Role.PROFESSIONAL,
      isActive: true,
      professionalProfile: {
        create: {
          firstName: 'Juan',
          lastName: 'Pérez',
          slug: 'juan-perez',
          professionalTitle: 'Desarrollador Full Stack Senior',
          valueProposition: 'Desarrollo soluciones web robustas, escalables y orientadas a resultados de negocio.',
          yearsOfExperience: 6,
          phone: '+54 261 555-0199',
          location: 'Mendoza, Argentina',
          bio: 'Ingeniero de software con más de 6 años de experiencia. Apasionado por React, Node.js y la optimización de procesos mediante IA.',
          availability: JobAvailability.AVAILABLE,
          preferredModality: JobModality.REMOTE,
          salaryExpectation: '$1.800.000 - $2.400.000 ARS',
          completionScore: 90,
        },
      },
    },
    include: { professionalProfile: true },
  });
  console.log('✅ Usuario PROFESSIONAL 1 registrado (profesional@test.com)');

  // Limpiar relaciones anteriores de Juan para re-sembrar limpiamente
  if (prof1.professionalProfile) {
    await prisma.workExperience.deleteMany({ where: { profileId: prof1.professionalProfile.id } });
    await prisma.education.deleteMany({ where: { profileId: prof1.professionalProfile.id } });
    await prisma.certification.deleteMany({ where: { profileId: prof1.professionalProfile.id } });
    await prisma.language.deleteMany({ where: { profileId: prof1.professionalProfile.id } });

    await prisma.workExperience.createMany({
      data: [
        {
          profileId: prof1.professionalProfile.id,
          company: 'Globant',
          role: 'Semi-Senior Full Stack Developer',
          startDate: new Date('2021-03-01'),
          endDate: new Date('2023-08-31'),
          description: 'Desarrollo de microservicios con Node.js y aplicaciones web dinámicas utilizando React.'
        },
        {
          profileId: prof1.professionalProfile.id,
          company: 'Mercado Libre',
          role: 'Senior Full Stack Developer',
          startDate: new Date('2023-09-01'),
          endDate: null,
          description: 'Liderazgo técnico en la integración de pasarelas de pago y optimización de base de datos.'
        }
      ]
    });

    await prisma.education.createMany({
      data: [
        {
          profileId: prof1.professionalProfile.id,
          institution: 'Universidad Tecnológica Nacional',
          degree: 'Ingeniería en Sistemas de Información',
          year: 2020
        }
      ]
    });

    await prisma.certification.createMany({
      data: [
        {
          profileId: prof1.professionalProfile.id,
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services (AWS)',
          issueDate: new Date('2024-01-15'),
          url: 'https://aws.amazon.com/certification/'
        }
      ]
    });

    await prisma.language.createMany({
      data: [
        {
          profileId: prof1.professionalProfile.id,
          name: 'Español',
          level: 'Nativo'
        },
        {
          profileId: prof1.professionalProfile.id,
          name: 'Inglés',
          level: 'C1 - Avanzado'
        }
      ]
    });

    // Asociar 5 habilidades iniciales
    const skillsToConnect = dbSkills.slice(0, 5);
    for (const sk of skillsToConnect) {
      await prisma.profileSkill.upsert({
        where: { profileId_skillId: { profileId: prof1.professionalProfile.id, skillId: sk.id } },
        update: {},
        create: { profileId: prof1.professionalProfile.id, skillId: sk.id, isVerified: true },
      });
    }
  }

  // Profesional 2
  const prof2 = await prisma.user.upsert({
    where: { email: 'profesional2@test.com' },
    update: { passwordHash },
    create: {
      email: 'profesional2@test.com',
      passwordHash,
      role: Role.PROFESSIONAL,
      isActive: true,
      professionalProfile: {
        create: {
          firstName: 'María',
          lastName: 'Gómez',
          slug: 'maria-gomez',
          professionalTitle: 'Gerente de Proyectos / Scrum Master',
          valueProposition: 'Facilitación de metodologías ágiles enfocadas a la eficiencia y el bienestar laboral de los equipos.',
          yearsOfExperience: 8,
          phone: '+54 11 5555-4321',
          location: 'Buenos Aires, Argentina',
          bio: 'Especialista en Scrum y Kanban con amplia trayectoria coordinando equipos híbridos en empresas líderes del sector Fintech.',
          availability: JobAvailability.AVAILABLE,
          preferredModality: JobModality.HYBRID,
          salaryExpectation: '$2.000.000 - $2.800.000 ARS',
          completionScore: 85,
        },
      },
    },
    include: { professionalProfile: true },
  });
  console.log('✅ Usuario PROFESSIONAL 2 registrado (profesional2@test.com)');

  if (prof2.professionalProfile) {
    await prisma.workExperience.deleteMany({ where: { profileId: prof2.professionalProfile.id } });
    await prisma.education.deleteMany({ where: { profileId: prof2.professionalProfile.id } });
    await prisma.certification.deleteMany({ where: { profileId: prof2.professionalProfile.id } });
    await prisma.language.deleteMany({ where: { profileId: prof2.professionalProfile.id } });

    await prisma.workExperience.createMany({
      data: [
        {
          profileId: prof2.professionalProfile.id,
          company: 'Accenture Argentina',
          role: 'Project Manager',
          startDate: new Date('2018-05-10'),
          endDate: new Date('2022-11-30'),
          description: 'Gestión y coordinación integral de proyectos ágiles para clientes en Norteamérica.'
        },
        {
          profileId: prof2.professionalProfile.id,
          company: 'Despegar.com',
          role: 'Agile Coach / Scrum Master',
          startDate: new Date('2022-12-01'),
          endDate: null,
          description: 'Implementación de frameworks de agilidad a escala en múltiples áreas de producto.'
        }
      ]
    });

    await prisma.education.createMany({
      data: [
        {
          profileId: prof2.professionalProfile.id,
          institution: 'Universidad de Buenos Aires',
          degree: 'Licenciatura en Administración de Empresas',
          year: 2017
        }
      ]
    });

    await prisma.certification.createMany({
      data: [
        {
          profileId: prof2.professionalProfile.id,
          name: 'Certified ScrumMaster (CSM)',
          issuer: 'Scrum Alliance',
          issueDate: new Date('2020-09-20'),
          url: 'https://www.scrumalliance.org/'
        }
      ]
    });

    await prisma.language.createMany({
      data: [
        {
          profileId: prof2.professionalProfile.id,
          name: 'Español',
          level: 'Nativo'
        },
        {
          profileId: prof2.professionalProfile.id,
          name: 'Inglés',
          level: 'C2 - Bilingüe'
        }
      ]
    });

    // Asociar 5 habilidades cognitivas/socioemocionales
    const skillsToConnect = dbSkills.slice(5, 10);
    for (const sk of skillsToConnect) {
      await prisma.profileSkill.upsert({
        where: { profileId_skillId: { profileId: prof2.professionalProfile.id, skillId: sk.id } },
        update: {},
        create: { profileId: prof2.professionalProfile.id, skillId: sk.id, isVerified: true },
      });
    }
  }

  // ─── 5. Usuarios Empresas (Company Profiles) ───────────────────────────────
  // Empresa 1
  const comp1 = await prisma.user.upsert({
    where: { email: 'empresa@test.com' },
    update: { passwordHash },
    create: {
      email: 'empresa@test.com',
      passwordHash,
      role: Role.COMPANY,
      isActive: true,
      companyProfile: {
        create: {
          companyName: 'TechSolutions AR',
          industry: 'Tecnología / Software',
          description: 'Empresa argentina líder en desarrollo de soluciones cloud y software a medida.',
          website: 'https://techsolutions.example.com',
        },
      },
    },
    include: { companyProfile: true },
  });
  console.log('✅ Usuario COMPANY 1 registrado (empresa@test.com)');

  // Empresa 2
  const comp2 = await prisma.user.upsert({
    where: { email: 'empresa2@test.com' },
    update: { passwordHash },
    create: {
      email: 'empresa2@test.com',
      passwordHash,
      role: Role.COMPANY,
      isActive: true,
      companyProfile: {
        create: {
          companyName: 'InnovaCorp Fintech',
          industry: 'Banca y Finanzas / Fintech',
          description: 'Desarrollamos tecnología accesible e inclusiva para transformar los servicios financieros.',
          website: 'https://innovacorp.example.com',
        },
      },
    },
    include: { companyProfile: true },
  });
  console.log('✅ Usuario COMPANY 2 registrado (empresa2@test.com)');

  // ─── 6. Ofertas Laborales (Job Offers) ─────────────────────────────────────
  if (comp1.companyProfile) {
    await prisma.jobOffer.deleteMany({ where: { companyId: comp1.companyProfile.id } });
    await prisma.jobOffer.createMany({
      data: [
        {
          companyId: comp1.companyProfile.id,
          title: 'React Developer Senior',
          salaryRange: '$2500 - $3500 USD',
          contractType: 'Término indefinido',
          modality: 'Remoto',
          description: 'Buscamos un desarrollador frontend senior especializado en React para liderar el desarrollo de nuestras interfaces interactivas y dinámicas de comercio electrónico.',
          education: 'Terciario o Universitario graduado (Deseable)',
          experience: '5+ años de experiencia comprobable'
        },
        {
          companyId: comp1.companyProfile.id,
          title: 'Node.js Backend Engineer',
          salaryRange: '$3000 - $4500 USD',
          contractType: 'Término indefinido',
          modality: 'Híbrido',
          description: 'Únete a nuestro equipo para diseñar e implementar APIs RESTful robustas y microservicios escalables utilizando Node.js, NestJS y PostgreSQL.',
          education: 'Sin requerimiento formal de título',
          experience: '3+ años de experiencia en desarrollo backend'
        }
      ]
    });
    console.log(`✅ Ofertas creadas para ${comp1.companyProfile.companyName}`);
  }

  if (comp2.companyProfile) {
    await prisma.jobOffer.deleteMany({ where: { companyId: comp2.companyProfile.id } });
    await prisma.jobOffer.createMany({
      data: [
        {
          companyId: comp2.companyProfile.id,
          title: 'Project Manager Bilingüe',
          salaryRange: '$2000 - $3000 USD',
          contractType: 'Freelance',
          modality: 'Remoto',
          description: 'Coordinación y supervisión de células de desarrollo ágiles. Reportará directamente al director de tecnología y mantendrá comunicación con clientes extranjeros.',
          education: 'Carreras de administración, sistemas o certificaciones Scrum/PMP',
          experience: '4+ años en gestión de proyectos IT'
        }
      ]
    });
    console.log(`✅ Ofertas creadas para ${comp2.companyProfile.companyName}`);
  }

  // ─── 7. Eventos (Events) ───────────────────────────────────────────────────
  await prisma.eventEnroll.deleteMany({});
  await prisma.event.deleteMany({});

  const ev1 = await prisma.event.create({
    data: {
      title: 'Optimización de Perfiles LinkedIn para Seniors',
      type: 'Taller',
      day: '2026-06-15',
      link: 'https://meet.google.com/abc-defg-hij'
    }
  });

  await prisma.event.create({
    data: {
      title: 'Buenas Prácticas en el Trabajo Asincrónico y Remoto',
      type: 'Clase',
      day: '2026-06-22',
      link: 'https://meet.google.com/xyz-pdq-rst'
    }
  });

  await prisma.event.create({
    data: {
      title: 'IA Generativa aplicada al Management',
      type: 'Taller',
      day: '2026-07-05',
      link: 'https://meet.google.com/mno-pqrs-tuv'
    }
  });
  console.log('✅ Eventos del calendario creados');

  // Inscribir a Juan Pérez en el primer evento
  if (prof1.professionalProfile) {
    await prisma.eventEnroll.create({
      data: {
        eventId: ev1.id,
        professionalId: prof1.professionalProfile.id
      }
    });
    console.log('✅ Profesional Juan Pérez inscrito en evento LinkedIn');
  }

  // ─── 8. Preselección de Candidatos (Preselection) ──────────────────────────
  await prisma.preselection.deleteMany({});
  if (comp1.companyProfile && prof1.professionalProfile) {
    await prisma.preselection.create({
      data: {
        companyProfileId: comp1.companyProfile.id,
        professionalProfileId: prof1.professionalProfile.id,
        status: PreselectionStatus.INTERESTED,
        notes: 'Excelente perfil Full Stack con experiencia en Mercado Libre y alta compatibilidad.'
      }
    });
    console.log('✅ Preselección de ejemplo creada para Juan Pérez en TechSolutions AR');
  }

  console.log('🌱 ¡Siembra de base de datos finalizada exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error durante la siembra:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
