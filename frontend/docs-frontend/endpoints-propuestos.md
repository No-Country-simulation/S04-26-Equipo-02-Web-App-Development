# Propuesta de Endpoints y Cambios de Base de Datos para Integración con Frontend

Este documento tiene como objetivo especificar los cambios recomendados en la base de datos (`schema.prisma`) y detallar las firmas y contratos de los endpoints del backend necesarios para conectar las vistas del frontend que actualmente consumen mocks (datos simulados).

---

## 1. Cambios Propuestos en la Base de Datos (`schema.prisma`)

Para dar soporte a las nuevas funcionalidades de **Publicaciones de Empleo (Marketplace)** e **Inscripción a Eventos (Calendario)**, se recomienda agregar o extender los siguientes modelos en Prisma:

### 1.1 Modelo `JobPosting` (Vacantes / Ofertas)
Actualmente no existe una entidad de vacantes de empleo en la base de datos.
```prisma
model JobPosting {
  id              String         @id @default(uuid())
  companyId       String
  company         CompanyProfile @relation(fields: [companyId], references: [id])
  title           String
  department      String
  location        String
  modality        JobModality    @default(REMOTE)
  type            String         @default("Tiempo Completo") // Tiempo Completo, Medio Tiempo, Freelance
  status          String         @default("Borrador")        // Activa, Cerrada, Borrador
  vacancies       Int            @default(1)
  salaryMin       Float?
  salaryMax       Float?
  description     String
  skillsRequired  String[]       // Lista de tags de habilidades requeridas
  expirationDate  DateTime?
  viewsCount      Int            @default(0)
  postedDate      DateTime       @default(now())
  
  // Relaciones
  preselections   Preselection[] // Candidatos que aplican o son preseleccionados para esta vacante
  
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
}
```

### 1.2 Extensión de `Preselection` (Postulaciones y Preselección)
Se debe añadir la vinculación opcional con `JobPosting` para saber a qué oferta corresponde cada preselección:
```prisma
model Preselection {
  id                    String              @id @default(uuid())
  companyProfileId      String
  company               CompanyProfile      @relation(fields: [companyProfileId], references: [id])
  professionalProfileId String
  professional          ProfessionalProfile @relation(fields: [professionalProfileId], references: [id])
  jobPostingId          String?             // Nueva FK opcional
  jobPosting            JobPosting?         @relation(fields: [jobPostingId], references: [id])
  status                PreselectionStatus  @default(INTERESTED)
  notes                 String?
  
  feedback              MarketplaceFeedback?
  createdAt             DateTime            @default(now())
}
```

### 1.3 Modelos para `Event` y `EventRegistration` (Webinars y Talleres)
Para soportar el calendario del portal sin datos mockeados en el frontend:
```prisma
model Event {
  id              String         @id @default(uuid())
  title           String
  description     String
  type            String         // Webinar, Taller, Mesa Redonda, Networking
  date            DateTime
  startTime       String         // Ej: "18:00"
  speakerName     String
  speakerTitle    String
  capacity        Int            @default(100)
  registeredCount Int            @default(0)
  price           String         @default("Gratuito") // "Gratuito" o el valor en ARS
  tags            String[]
  status          String         @default("upcoming") // upcoming, past
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt
  
  registrations   EventRegistration[]
}

model EventRegistration {
  id                    String              @id @default(uuid())
  eventId               String
  event                 Event               @relation(fields: [eventId], references: [id])
  professionalProfileId String
  professional          ProfessionalProfile @relation(fields: [professionalProfileId], references: [id])
  registeredAt          DateTime            @default(now())
  
  @@unique([eventId, professionalProfileId])
}
```

---

## 2. Detalle de Endpoints a Desarrollar

### Módulo 1: Autenticación (Auth)
#### `POST /api/v1/auth/logout`
*   **Propósito**: Cerrar sesión del usuario, invalidando las cookies del lado del cliente.
*   **Autorización**: Ninguna.
*   **Request Body**: *(Ninguno)*
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Sesión cerrada correctamente"
    }
    ```

---

### Módulo 2: Perfiles (Profiles)

#### `GET /api/v1/profiles/company/me`
*   **Propósito**: Obtener el perfil de empresa de la cuenta autenticada.
*   **Autorización**: Requerida (Rol: `COMPANY`)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "company-uuid-1",
        "companyName": "TechSolutions AR",
        "industry": "Tecnología",
        "description": "Líderes en soluciones frontend.",
        "website": "https://techsolutions.com.ar",
        "logoUrl": "https://logo-url.png"
      }
    }
    ```

#### `PATCH /api/v1/profiles/company/update`
*   **Propósito**: Actualizar datos del perfil de la empresa.
*   **Autorización**: Requerida (Rol: `COMPANY`)
*   **Request Body**:
    ```json
    {
      "companyName": "TechSolutions AR Modificado",
      "industry": "Tecnología y Cloud",
      "description": "Líderes en desarrollo y arquitectura cloud.",
      "website": "https://techsolutions.com.ar"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "company-uuid-1",
        "companyName": "TechSolutions AR Modificado",
        "industry": "Tecnología y Cloud",
        "description": "Líderes en desarrollo y arquitectura cloud.",
        "website": "https://techsolutions.com.ar"
      }
    }
    ```

#### `GET /api/v1/profiles/slug/:slug`
*   **Propósito**: Exponer el perfil de un profesional por medio de su `slug` único (para ver detalles en Marketplace/búsqueda).
*   **Autorización**: Requerida (Cualquier rol autenticado)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "prof-uuid-1",
        "firstName": "Eduardo",
        "lastName": "López",
        "slug": "eduardo-lopez",
        "professionalTitle": "Backend Developer",
        "valueProposition": "15 años optimizando bases de datos",
        "location": "Mendoza, Argentina",
        "bio": "Desarrollador orientado a resultados...",
        "skills": [
          { "name": "Node.js", "category": "DIGITAL", "isVerified": true }
        ],
        "experience": [],
        "education": [],
        "certifications": []
      }
    }
    ```

---

### Módulo 3: Publicaciones y Ofertas de Trabajo (Jobs)

#### `POST /api/v1/jobs`
*   **Propósito**: Crear una nueva oferta laboral.
*   **Autorización**: Requerida (Rol: `COMPANY`)
*   **Request Body**:
    ```json
    {
      "title": "Desarrollador/a Frontend Senior",
      "department": "Tecnología",
      "location": "CABA",
      "modality": "REMOTE", // REMOTE, ON_SITE, HYBRID
      "type": "Tiempo Completo",
      "salaryMin": 4500000,
      "salaryMax": 5500000,
      "description": "Buscamos un perfil senior para...",
      "skillsRequired": ["React", "TypeScript", "Next.js"],
      "status": "Activa" // Activa, Borrador
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "job-uuid-123",
        "title": "Desarrollador/a Frontend Senior",
        "status": "Activa",
        "postedDate": "2026-05-22T00:00:00.000Z"
      }
    }
    ```

#### `GET /api/v1/jobs/company`
*   **Propósito**: Obtener las ofertas de empleo creadas por la propia empresa autenticada.
*   **Autorización**: Requerida (Rol: `COMPANY`)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "job-uuid-123",
          "title": "Desarrollador/a Frontend Senior",
          "department": "Tecnología",
          "location": "CABA",
          "modality": "REMOTE",
          "status": "Activa",
          "vacancies": 1,
          "viewsCount": 42,
          "postedDate": "2026-05-22T00:00:00.000Z",
          "applicantCount": 5
        }
      ]
    }
    ```

#### `PATCH /api/v1/jobs/:id`
*   **Propósito**: Modificar el estado de la publicación (pausar, cerrar) o editar campos.
*   **Autorización**: Requerida (Rol: `COMPANY`)
*   **Request Body**:
    ```json
    {
      "status": "Cerrada"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "job-uuid-123",
        "status": "Cerrada"
      }
    }
    ```

#### `GET /api/v1/jobs`
*   **Propósito**: Listar ofertas laborales en el Marketplace de candidatos (pantalla *Opportunities.tsx*).
*   **Autorización**: Requerida (Rol: `PROFESSIONAL`)
*   **Query Params**:
    *   `q` (búsqueda de texto en título, empresa o habilidades)
    *   `type` (Tiempo Completo, Medio Tiempo, Freelance)
    *   `modality` (Remoto, Presencial, Híbrido)
    *   `location` (CABA, Córdoba, Mendoza, etc.)
    *   `sortBy` (relevancia, recientes, salario)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "job-uuid-123",
          "company": "TechSolutions AR",
          "position": "Desarrollador/a Frontend Senior",
          "location": "CABA",
          "salaryMin": 4500000,
          "salaryMax": 5500000,
          "type": "Tiempo Completo",
          "modality": "Remoto",
          "skills": ["React", "TypeScript", "Next.js"],
          "postedDaysAgo": 2,
          "matchScore": 95,
          "description": "Buscamos un perfil senior..."
        }
      ]
    }
    ```

---

### Módulo 4: Búsqueda de Talento y Preselecciones (Talent Search & Preselection)

#### `GET /api/v1/company/talents`
*   **Propósito**: Buscar perfiles de profesionales para las empresas con filtros avanzados.
*   **Autorización**: Requerida (Rol: `COMPANY`, `ADMIN`)
*   **Query Params**:
    *   `q` (búsqueda por texto en nombre, biografía, habilidades)
    *   `area` (área profesional)
    *   `location` (ubicación)
    *   `availability` (AVAILABLE, IN_PROCESS, NOT_AVAILABLE)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "prof-uuid-1",
          "firstName": "Ricardo",
          "lastName": "Méndez",
          "slug": "ricardo-mendez",
          "professionalTitle": "Arquitecto de Software Senior",
          "location": "Buenos Aires",
          "availability": "AVAILABLE",
          "preferredModality": "REMOTE",
          "yearsOfExperience": 28,
          "skills": ["Java", "Spring", "AWS"]
        }
      ]
    }
    ```

#### `POST /api/v1/preselection`
*   **Propósito**: Preseleccionar un candidato (añadirlo a la lista de candidatos de interés).
*   **Autorización**: Requerida (Rol: `COMPANY`)
*   **Request Body**:
    ```json
    {
      "professionalProfileId": "prof-uuid-1",
      "jobPostingId": "job-uuid-123", // Opcional, vincula a una oferta
      "status": "INTERESTED", // INTERESTED, CONTACTED, INTERVIEWING, HIRED, REJECTED
      "notes": "Candidato ideal para la vacante Senior."
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "preselection-uuid-789",
        "status": "INTERESTED"
      }
    }
    ```

#### `PATCH /api/v1/preselection/:id`
*   **Propósito**: Cambiar el estado del proceso de selección de un candidato (ej. marcar como Contactado, Entrevistando, etc.).
*   **Autorización**: Requerida (Rol: `COMPANY`)
*   **Request Body**:
    ```json
    {
      "status": "CONTACTED",
      "notes": "Llamada telefónica agendada."
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "preselection-uuid-789",
        "status": "CONTACTED"
      }
    }
    ```

---

### Módulo 5: Ruta de Aprendizaje (Learning)

#### `GET /api/v1/learning/paths`
*   **Propósito**: Obtener todos los módulos y cursos formativos configurados en el portal.
*   **Autorización**: Requerida (Cualquier rol autenticado)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "path-uuid-1",
          "title": "Habilidades Digitales",
          "description": "Herramientas modernas para tu inserción laboral",
          "courses": [
            {
              "id": "course-uuid-1",
              "title": "Colaboración con Google Workspace",
              "description": "Domina herramientas en la nube.",
              "order": 1
            }
          ]
        }
      ]
    }
    ```

#### `GET /api/v1/learning/progress`
*   **Propósito**: Obtener el avance actual del usuario autenticado en cada curso de su ruta.
*   **Autorización**: Requerida (Rol: `PROFESSIONAL`)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "progress-uuid-1",
          "courseId": "course-uuid-1",
          "status": "IN_PROGRESS", // PENDING, IN_PROGRESS, COMPLETED
          "updatedAt": "2026-05-22T01:00:00.000Z"
        }
      ]
    }
    ```

#### `POST /api/v1/learning/progress`
*   **Propósito**: Actualizar o guardar el progreso del profesional en un curso (ej. marcar como completado).
*   **Autorización**: Requerida (Rol: `PROFESSIONAL`)
*   **Request Body**:
    ```json
    {
      "courseId": "course-uuid-1",
      "status": "COMPLETED"
    }
    ```
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "progress-uuid-1",
        "courseId": "course-uuid-1",
        "status": "COMPLETED"
      }
    }
    ```
    *Nota backend: Al completarse un curso (`COMPLETED`), el backend debería marcar de manera automática la skill correspondiente asociada al usuario en el modelo `ProfileSkill` como `isVerified: true`.*

---

### Módulo 6: Eventos y Calendario (Events)

#### `GET /api/v1/events`
*   **Propósito**: Obtener la lista de eventos programados (webinars, talleres).
*   **Autorización**: Requerida (Cualquier rol autenticado)
*   **Query Params**:
    *   `status` (upcoming, past, all)
    *   `type` (Webinar, Taller, Mesa Redonda, Networking, all)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "event-uuid-1",
          "title": "Liderazgo en entornos híbridos",
          "type": "Webinar",
          "date": "2026-06-15T18:00:00.000Z",
          "startTime": "18:00",
          "speakerName": "Dr. Mariana Fernández",
          "speakerTitle": "Consultora",
          "description": "Mejores prácticas para liderar equipos distribuidos.",
          "capacity": 100,
          "registeredCount": 87,
          "price": "Gratuito",
          "tags": ["Liderazgo", "Híbrido"],
          "status": "upcoming"
        }
      ]
    }
    ```

#### `POST /api/v1/events/:id/register`
*   **Propósito**: Inscribir al profesional autenticado a un evento.
*   **Autorización**: Requerida (Rol: `PROFESSIONAL`)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "message": "Inscripción registrada con éxito"
    }
    ```

#### `POST /api/v1/events`
*   **Propósito**: Crear un nuevo evento en el calendario de la plataforma.
*   **Autorización**: Requerida (Rol: `ADMIN`)
*   **Request Body**:
    ```json
    {
      "title": "Taller práctico de LinkedIn",
      "type": "Taller",
      "date": "2026-06-18T16:30:00.000Z",
      "startTime": "16:30",
      "speakerName": "Ing. Pablo Rodríguez",
      "speakerTitle": "Recruiter IT",
      "description": "Optimiza tu presencia digital.",
      "capacity": 50,
      "price": "Gratuito",
      "tags": ["LinkedIn", "Marca Personal"]
    }
    ```
*   **Response (201 Created)**:
    ```json
    {
      "success": true,
      "data": {
        "id": "event-uuid-2",
        "title": "Taller práctico de LinkedIn"
      }
    }
    ```

---

### Módulo 7: Métricas de los Tableros de Mando (Dashboard Stats)

#### `GET /api/v1/company/stats`
*   **Propósito**: Obtener las métricas clave para el panel principal de empresa.
*   **Autorización**: Requerida (Rol: `COMPANY`)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "candidatesViewed": 12,    // Cantidad de preselecciones activas
        "activeJobs": 2,           // Vacantes con status 'Activa'
        "suggestedMatches": 5      // Coincidencias sugeridas estimadas
      }
    }
    ```

#### `GET /api/v1/professional/stats`
*   **Propósito**: Obtener las métricas clave para el panel principal del profesional.
*   **Autorización**: Requerida (Rol: `PROFESSIONAL`)
*   **Response (200 OK)**:
    ```json
    {
      "success": true,
      "data": {
        "daysActive": 32,          // Días desde la creación de la cuenta
        "skillsCount": 8,          // Habilidades asociadas en ProfileSkill
        "eventsAttended": 9,       // Inscripciones a eventos pasados
        "profilePercent": 75       // completionScore del ProfessionalProfile
      }
    }
    ```
