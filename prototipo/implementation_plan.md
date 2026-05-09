# 🚀 Plan Maestro — MVP Red de Bienestar Laboral


IMPORTANTE 
prototipo\middleware.ts
SE RENOMBRO A PROXY.TS PARA QUE FUNCIONE CON NEXTJS 16.2.6
The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy

Plan completo de lo que **ya existe** vs. lo que **falta construir** para cumplir con el desafío de la plataforma de empleabilidad +45.

---

## 📊 Estado Actual del Proyecto

### ✅ Lo que YA ESTÁ construido y funcional

| Módulo | Estado | Detalles |
|--------|--------|----------|
| **Landing Page** | ✅ Completa | Header, Hero, How It Works, For Professionals, For Companies, Community, CTA, Footer |
| **Autenticación** | ✅ Funcional | Better Auth con email/password, login, registro, sesiones |
| **Registro de usuarios** | ✅ Funcional | Con roles (PROFESSIONAL, COMPANY, ADMIN, SUPER_ADMIN) |
| **Onboarding / Diagnóstico Inicial** | ✅ Funcional | 2 pasos: Perfil (área, industria, situación laboral) + Habilidades (Digitales, Socioemocionales, Cognitivas) → guarda en DB |
| **Dashboard Layout** | ✅ Funcional | Sidebar role-based, responsive, animaciones, tema Buildbox |
| **Dashboard Profesional** | ✅ Parcial | Radial chart dinámico con stats de tareas, tareas semanales (hardcoded), actividades destacadas (hardcoded) |
| **Dashboard Empresa** | ✅ Esqueleto | Stats cards vacías, placeholder de búsqueda de talento |
| **Dashboard Admin** | ✅ Esqueleto | Stats hardcoded, placeholder gráfico, validaciones mock |
| **Sidebar Navegación** | ✅ Funcional | Rutas por rol: Profesional (5), Empresa (4), Admin (4), Super Admin (4) |
| **Perfil General** | ✅ UI Completa | Info de contacto, detalles profesionales, badges (datos hardcoded) |
| **Configuración** | ✅ Funcional | Cambio de contraseña con Better Auth + email de confirmación |
| **API: Onboarding** | ✅ Funcional | POST para guardar diagnóstico y crear perfil profesional |
| **API: Profile** | ✅ Funcional | GET perfil profesional + stats de tareas completadas |
| **Base de Datos (Drizzle + PostgreSQL)** | ✅ Funcional | Tablas: users, sessions, accounts, verifications, professional_profiles, company_profiles, job_posts, events, user_tasks |
| **Emails** | ✅ Funcional | `lib/mail.ts` para envío de emails |
| **Backend Express (separado)** | ✅ Parcial | Express + Prisma con auth route (parece un backend alternativo, no integrado con prototipo) |
| **Frontend Vite (separado)** | ✅ Parcial | React + Vite con páginas: Login, Register, Dashboard, etc. (parece MVP anterior) |

---

### ❌ Lo que FALTA construir (por pilar del desafío)

---

## 🎯 PILAR 1: Learning Experience (Upskilling / Reskilling)

> **Estado actual**: Solo existe el diagnóstico inicial (onboarding). No hay rutas de aprendizaje reales ni contenido.

### 1.1 Rutas de Aprendizaje Personalizadas
- **Archivo actual**: `app/dashboard/profesional/ruta/page.tsx` → Solo muestra 2 fases hardcoded
- [ ] **Crear lógica de generación de ruta** basada en el diagnóstico
  - Analizar skills faltantes del usuario (18 posibles - seleccionadas)
  - Generar módulos recomendados en 3 categorías (Digital, Socioemocional, Cognitivo)
  - Guardar la ruta personalizada en DB
- [ ] **Crear tabla `learning_modules`** en schema.ts:
  ```
  - id, title, description, category (Digital/Socioemocional/Cognitivo)
  - content_type (video/artículo/quiz/taller)
  - duration_minutes, difficulty_level
  - order_in_path
  ```
- [ ] **Crear tabla `user_learning_progress`**:
  ```
  - id, userId, moduleId, status (not_started/in_progress/completed)
  - started_at, completed_at, score
  ```
- [ ] **Implementar página de Ruta de Aprendizaje** con:
  - Vista de timeline/mapa visual con fases
  - Módulos expandibles por cada fase
  - Progress bars por categoría
  - Estimación de tiempo restante
- [ ] **Crear contenido seed** (al menos 9-12 módulos de ejemplo)

### 1.2 Contenidos Formativos
- [ ] **Página de detalle de módulo** (`/dashboard/profesional/ruta/[moduleId]`)
  - Descripción completa del módulo
  - Recursos (videos, PDFs, links)
  - Quiz de evaluación
  - Botón de "Marcar como completado"
- [ ] **API para tracking de progreso** (`/api/learning/progress`)
  - POST: marcar módulo como iniciado/completado
  - GET: obtener progreso del usuario

### 1.3 Tracking de Progreso
- [ ] **Actualizar el Radial Chart** del dashboard para reflejar progreso REAL de módulos
- [ ] **Calcular progreso total** basado en:
  - Módulos completados / Total de módulos en ruta
  - Habilidades validadas
  - Eventos asistidos

---

## 🎯 PILAR 2: Perfil Profesional Dinámico ("CV Vivo")

> **Estado actual**: Perfil básico muestra datos de sesión (nombre, email). Skills hardcoded. Sin edición.

### 2.1 Construcción del Perfil Dinámico
- [ ] **Expandir `professional_profiles`** en schema con campos:
  ```
  - headline (título profesional)
  - summary (resumen profesional/propuesta de valor)
  - linkedin_url
  - portfolio_url
  - certifications (JSON: array de certificaciones)
  - languages (JSON: idiomas y nivel)
  - work_experience (JSON: array de experiencias)
  - education (JSON: array de formación)
  - availability_status (disponible/en_proceso/no_disponible)
  - salary_expectation
  - modality_preference (remoto/presencial/híbrido)
  ```
- [ ] **Crear tabla `professional_skills`** (normalizada):
  ```
  - id, userId, skill_name, category, level (1-5)
  - validated (boolean), validated_by, validated_at
  - evidence_url
  ```
- [ ] **Implementar página de edición de perfil** (`/dashboard/profesional/perfil/editar`)
  - Formulario completo con secciones colapsables
  - Upload de foto de perfil
  - Selección de habilidades con nivel
  - Preview del perfil público
- [ ] **Crear vista pública del perfil** (`/perfil/[userId]`)
  - CV dinámico renderizado con diseño premium
  - Skills con indicador de nivel y validación
  - Historial de aprendizaje y logros en la plataforma
  - Badges/sellos de la red

### 2.2 Integración con Learning
- [ ] **Auto-actualizar skills** cuando se completen módulos relacionados
- [ ] **Mostrar badges de aprendizaje** en el perfil público
- [ ] **Generar "score de empleabilidad"** basado en perfil + progreso

---

## 🎯 PILAR 3: Talent Marketplace

> **Estado actual**: Página de búsqueda de talento para empresas = placeholder vacío. Marketplace de empleos para profesionales = placeholder vacío.

### 3.1 Para Empresas: Búsqueda y Preselección de Talento
- [ ] **API de búsqueda de talento** (`/api/talent/search`)
  - Filtros: área, industria, skills, disponibilidad, ubicación, experiencia
  - Paginación
  - Ranking por match con requisitos
- [ ] **Implementar página de Talent Marketplace** (`/dashboard/empresa/talento`)
  - Barra de búsqueda con filtros avanzados
  - Cards de perfiles profesionales con:
    - Foto, nombre, headline
    - Skills principales con nivel
    - Score de empleabilidad
    - Progreso en la plataforma
    - Botón "Ver perfil completo"
    - Botón "Guardar" / "Contactar"
  - Vista de lista vs grid
- [ ] **Crear tabla `talent_interactions`**:
  ```
  - id, company_userId, professional_userId
  - action_type (viewed/saved/contacted/shortlisted)
  - created_at, notes
  ```
- [ ] **Sistema de preselección**
  - Lista de candidatos guardados
  - Notas internas por candidato
  - Estado del proceso (nuevo/en_revisión/preseleccionado/rechazado)

### 3.2 Para Empresas: Publicación de Vacantes
- [ ] **API CRUD de vacantes** (`/api/jobs`)
  - POST: crear vacante
  - GET: listar vacantes (propias y todas las activas)
  - PUT: editar vacante
  - PATCH: cambiar estado
- [ ] **Expandir tabla `job_posts`**:
  ```
  - skills_required (JSON)
  - modality (remoto/presencial/híbrido)
  - location
  - salary_range
  - experience_required
  - application_deadline
  - company_profile_id (FK)
  ```
- [ ] **Implementar formulario de publicación** (`/dashboard/empresa/publicaciones/nueva`)
- [ ] **Implementar lista de vacantes con gestión** (`/dashboard/empresa/publicaciones`)

### 3.3 Para Profesionales: Exploración de Oportunidades
- [ ] **Implementar marketplace de empleos** (`/dashboard/profesional/empleos`)
  - Feed de vacantes activas
  - Filtros por área, modalidad, ubicación
  - Match score basado en perfil
  - Botón "Postularme"
- [ ] **Crear tabla `job_applications`**:
  ```
  - id, job_post_id, professional_userId
  - status (applied/reviewing/shortlisted/rejected/hired)
  - cover_letter, applied_at
  - company_feedback, feedback_at
  ```

### 3.4 Feedback Estructurado
- [ ] **Crear tabla `feedback`**:
  ```
  - id, from_userId (empresa), to_userId (profesional)
  - job_post_id, type (interview/profile_review/general)
  - rating (1-5), comment, areas_to_improve
  - created_at
  ```
- [ ] **Vista de feedback para profesional** en su dashboard
- [ ] **Vista de feedback dado para empresa**

---

## 🎯 PILAR 4: Gestión de Eventos y Publicaciones (Admin / Red de Bienestar Laboral)

> **Estado actual**: Admin tiene tabla de eventos hardcoded. No hay CRUD real. No hay publicación de contenido como talleres/webinars.

### 4.1 CRUD de Eventos (Admin)
- [ ] **API CRUD de eventos** (`/api/events`)
  - POST: crear evento (webinar, taller, networking, curso)
  - GET: listar eventos (con filtros por tipo y fecha)
  - PUT: editar evento
  - DELETE: eliminar/archivar evento
- [ ] **Formulario de creación de evento** en admin (`/dashboard/admin/eventos/nuevo`)
  - Título, descripción, tipo, fecha, hora inicio/fin
  - Link de Zoom, link de registro
  - Imagen del evento
  - ¿Es gratuito?
- [ ] **Implementar la gestión real** en `/dashboard/admin/eventos`
  - Tabla con datos reales de DB
  - Acciones: editar, eliminar, duplicar
  - Filtros por tipo y estado

### 4.2 Eventos para Profesionales
- [ ] **Implementar lista de eventos real** en `/dashboard/profesional/eventos`
  - Cards con imagen, fecha, tipo, speaker
  - Botón "Inscribirme"
  - Separación: próximos / pasados
- [ ] **Crear tabla `event_registrations`**:
  ```
  - id, event_id, userId
  - registered_at, attended (boolean)
  ```
- [ ] **Registrar asistencia** y vincular con `user_tasks` para tracking de progreso

### 4.3 Publicaciones / Contenido de la Red
- [ ] **Crear tabla `publications`** para gestionar contenido de la comunidad:
  ```
  - id, title, content, type (artículo/guía/recurso/noticia)
  - author_userId, image, tags
  - status (draft/published), published_at
  - created_at, updated_at
  ```
- [ ] **Panel de publicaciones para admin** (`/dashboard/admin/publicaciones`)
  - CRUD de publicaciones
  - Editor de contenido rich-text
- [ ] **Sección de recursos para profesionales** (`/dashboard/profesional/recursos`)
  - Lista de publicaciones/guías/artículos
  - Filtros por categoría

---

## 🎯 PILAR 5: Panel de Administración Completo

> **Estado actual**: Métricas hardcoded. Usuarios hardcoded. Sin funcionalidad real.

### 5.1 Métricas Reales
- [ ] **API de métricas** (`/api/admin/metrics`)
  - Total de usuarios por rol
  - Usuarios nuevos por período
  - Eventos creados / asistidos
  - Módulos completados
  - Matches empresa-profesional
- [ ] **Implementar dashboard de métricas real** (`/dashboard/admin/metricas`)
  - Gráficos de crecimiento (Recharts)
  - KPIs en tiempo real
  - Exportación de datos

### 5.2 Gestión de Usuarios
- [ ] **API de usuarios** (`/api/admin/users`)
  - GET: listar usuarios con paginación y filtros
  - PUT: cambiar rol, estado de validación
  - DELETE: desactivar usuario
- [ ] **Implementar gestión de usuarios real** (`/dashboard/admin/usuarios`)
  - Tabla con datos reales
  - Filtros por rol, estado
  - Acciones: validar, cambiar rol, desactivar

---

## 🎯 PILAR 6: Tareas Semanales Dinámicas

> **Estado actual**: Tareas hardcoded en el dashboard profesional.

- [ ] **API de tareas** (`/api/tasks`)
  - GET: obtener tareas del usuario por semana
  - POST: crear tarea automática o manual
  - PATCH: marcar como completada
- [ ] **Generador automático de tareas** basado en:
  - Ruta de aprendizaje actual
  - Eventos próximos
  - Perfil incompleto
  - Networking pendiente
- [ ] **Vincular tareas con progreso** en el radial chart

---

## 🔧 Mejoras Técnicas Necesarias

| Mejora | Prioridad | Detalle |
|--------|-----------|---------|
| Middleware de protección de rutas | 🔴 Alta | Proteger rutas por rol (profesional no accede a admin, etc.) |
| API de Company Profile | 🔴 Alta | CRUD para perfil de empresa |
| Onboarding para Empresas | 🟡 Media | Flujo de onboarding específico para empresas |
| Validación de formularios (Zod) | 🟡 Media | Validar inputs en APIs y formularios |
| Upload de imágenes | 🟡 Media | Para fotos de perfil, eventos, publicaciones |
| Notificaciones | 🟢 Baja | Sistema de notificaciones in-app |
| SSR/SEO mejoras | 🟢 Baja | Metadata dinámica por página |
| Tests | 🟢 Baja | E2E y unit tests |

---

## 📋 Orden de Implementación Sugerido (Sprints)

### Sprint 1 — Fundaciones (2-3 días)
1. Crear tablas nuevas en DB (`learning_modules`, `user_learning_progress`, `professional_skills`, `event_registrations`)
2. Migrations con Drizzle
3. Middleware de protección de rutas
4. API CRUD de eventos

### Sprint 2 — Learning Experience (3-4 días)
1. Módulos de aprendizaje seed
2. Lógica de generación de ruta personalizada
3. Página de Ruta de Aprendizaje completa
4. Tracking de progreso (API + UI)
5. Tareas semanales dinámicas

### Sprint 3 — Perfil Dinámico (2-3 días)
1. Expandir schema de perfil profesional
2. Página de edición de perfil
3. Vista pública del perfil ("CV Vivo")
4. Score de empleabilidad

### Sprint 4 — Marketplace (3-4 días)
1. API y CRUD de vacantes
2. Búsqueda de talento para empresas
3. Marketplace de empleos para profesionales
4. Sistema de postulaciones
5. Feedback estructurado

### Sprint 5 — Admin & Eventos (2-3 días)
1. CRUD real de eventos
2. Registro de asistencia
3. Gestión de usuarios real
4. Métricas en tiempo real
5. Publicaciones/contenido de la red

---

## Open Questions

> [!IMPORTANT]
> 1. **¿Quieren priorizar algún pilar específico?** Los 5 pilares son grandes. ¿Hay alguno que sea más urgente para la presentación del MVP?
> 2. **¿El backend Express separado (`/backend`) se va a usar o se queda todo en el prototipo Next.js?** Hay un backend con Prisma que parece un esfuerzo paralelo no integrado.
> 3. **¿El frontend Vite separado (`/frontend`) se va a descartar?** Parece un MVP anterior con Login/Register/Dashboard en React + Vite.
> 4. **¿Las publicaciones de talleres/webinars que mencionan se hacen desde el admin o también las pueden hacer las fundadoras (Vanina, Ana, Evelyn) como "moderadoras"?**
> 5. **¿Hay diseños (Figma) o nos basamos en el estilo Buildbox ya establecido?**
