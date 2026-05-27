# Estado de Integración de Endpoints (Frontend vs Backend)

> [!IMPORTANT]
> **Consola Interactiva del Frontend**: Este documento y su consola interactiva asociada están disponibles en el frontend local en la ruta pública `/about` (por ejemplo, `http://localhost:5173/about` según el puerto configurado).

Este documento detalla la correspondencia entre las vistas/servicios del frontend y la implementación actual en el backend (basado en la rama `main` de Git, añadiendo notas sobre avances identificados en ramas de desarrollo activas como `gonza-dev` y `feature/company-profile-endpoints`).

---

## Índice
1. [Estado de Ramas de Desarrollo (Git)](#estado-de-ramas-de-desarrollo-git)
2. [Autenticación (Auth)](#1-autenticación-auth)
3. [Perfiles de Profesionales (Profiles)](#2-perfiles-de-profesionales-profiles)
4. [Perfiles de Empresas (Company Profiles)](#3-perfiles-de-empresas-company-profiles)
5. [Diagnóstico Profesional (Diagnostic)](#4-diagnóstico-profesional-diagnostic)
6. [Ruta de Aprendizaje y Progreso (Learning)](#5-ruta-de-aprendizaje-y-progreso-learning)
7. [Ofertas Laborales y Oportunidades (Jobs/Hiring)](#6-ofertas-laborales-y-oportunidades-jobshiring)
8. [Búsqueda de Talento y Selección (Talent Search & Preselection)](#7-búsqueda-de-talento-y-selección-talent-search--preselection)
9. [Eventos y Calendario (Events)](#8-eventos-y-calendario-events)
10. [Estadísticas del Dashboard (Stats)](#9-estadísticas-del-dashboard-stats)

---

## Estado de Ramas de Desarrollo (Git)

Durante la auditoría del repositorio se identificaron las siguientes ramas secundarias:

*   **Rama `gonza-dev` (Pendiente de integrar)**:
    *   Implementa el módulo de contratación `/api/v1/hiring` con endpoints completos para crear, editar, borrar y listar ofertas laborales, buscar candidatos con filtros complejos, y preseleccionar o avanzar candidatos.
    *   Implementa los endpoints del módulo de eventos `/api/v1/events` (`GET /get-all`, `POST /enroll/:id`, `POST /create`) para listar, inscribirse y crear eventos.
    *   Implementa el endpoint de logout de sesión (`PATCH /api/v1/auth/logout`) invalidando el token en la BD y limpiando las cookies.
    *   Contiene una validación en el registro para impedir la creación manual de usuarios con rol `ADMIN`.
    *   *Nota*: Cambia el middleware de `cors` en el backend a `cors()`, lo cual puede requerir re-configurar `credentials: true` y `origin` para que las cookies `HttpOnly` sigan funcionando.
*   **Rama `feature/company-profile-endpoints` (Integrada en `main`)**:
    *   Implementó el disparador automático para que, al registrar una cuenta de tipo `COMPANY`, se inserte de inmediato su perfil en la tabla `CompanyProfile`.
    *   Agregó los endpoints para leer y actualizar la información de perfiles de empresa en `main`.
*   **Rama `feature/profile-skills-manual` (Integrada en `main`)**:
    *   Implementó los endpoints para agregar y eliminar de forma manual las habilidades en el perfil del profesional (`POST /api/v1/profiles/skills` y `DELETE /api/v1/profiles/skills/:skillId`).

---

## 1. Autenticación (Auth)

*   **Vistas en Frontend**: `Login.tsx`, `Register.tsx`, `VerifyEmail.tsx`, `App.tsx` (carga de sesión).
*   **Servicios/Stores**: [auth.ts](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/auth.ts), [authStore.ts](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/store/authStore.ts).
*   **Estado de Conexión**: **Parcialmente Conectado**.

| Endpoint Requerido | Método | Propósito | Estado en Backend (`main`) | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Iniciar sesión y establecer cookies `token` y `refreshToken`. | ✅ Implementado. | Ninguna. |
| `/api/v1/auth/register` | `POST` | Registro de nuevos usuarios (Profesionales/Empresas). | ✅ Implementado. | Creación automática de `CompanyProfile` y `ProfessionalProfile` según rol. |
| `/api/v1/auth/verify-email/:token` | `PATCH` | Verificar email mediante token de activación. | ✅ Implementado. | Ninguna. |
| `/api/v1/auth/validate-session` | `GET` | Validar sesión activa en base a las cookies. | ✅ Implementado. | Ninguna. |
| `/api/v1/auth/logout` | `PATCH` | Cerrar sesión limpiando las cookies `HttpOnly` e invalidando la sesión en la base de datos. | ❌ **Ausente en main**. | 🛠️ *Desarrollado en `gonza-dev` como `PATCH /logout`*. Fusionar la rama para activar. **Nota**: El frontend envía un POST, por lo que debe alinearse al fusionar (cambiar frontend a PATCH o backend a POST). |

---

## 2. Perfiles de Profesionales (Profiles)

*   **Vistas en Frontend**: `Profile.tsx`, `CvPreview.tsx` (vista de CV).
*   **Servicios/Stores**: [profiles.ts](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/profiles.ts).
*   **Estado de Conexión**: **Parcialmente Conectado**.

| Endpoint Requerido | Método | Propósito | Estado en Backend (`main`) | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/profiles/me` | `GET` | Obtener perfil completo del profesional autenticado. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/update` | `PATCH` | Actualizar campos básicos del profesional. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/experience` | `POST` | Agregar experiencia laboral. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/experience/:id` | `DELETE` | Eliminar experiencia laboral. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/education` | `POST` | Agregar estudios / formación. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/education/:id` | `DELETE` | Eliminar formación. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/certifications` | `POST` | Agregar una certificación. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/certifications/:id` | `DELETE` | Eliminar una certificación. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/languages` | `POST` | Agregar idiomas. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/languages/:id` | `DELETE` | Eliminar un idioma. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/slug/:slug` | `GET` | Obtener el perfil público del profesional por su slug. | ✅ Implementado. | Ninguna. |
| `/api/v1/profiles/skills` | `POST` | Agregar una habilidad manualmente al perfil. | ✅ Implementado. | Ninguna (Desarrollado en `feature/profile-skills-manual`). |
| `/api/v1/profiles/skills/:skillId` | `DELETE` | Eliminar una habilidad manual del perfil. | ✅ Implementado. | Ninguna (Desarrollado en `feature/profile-skills-manual`). |

---

## 3. Perfiles de Empresas (Company Profiles)

*   **Vistas en Frontend**: `CompanyDashboard.tsx` (datos generales corporativos), `Profile.tsx` (pestaña de empresa).
*   **Estado de Conexión**: ❌ **Mockeado / LocalStorage** (Listo en Backend, falta conectar en Frontend).

| Endpoint Requerido | Método | Propósito | Estado en Backend (`main`) | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/profiles/company/me` | `GET` | Obtener los datos del perfil corporativo de la empresa autenticada. | ✅ Implementado. | Consumir en el frontend y reemplazar el mock actual. |
| `/api/v1/profiles/company/update` | `PATCH` | Actualizar nombre, industria, descripción, logo y web de la empresa. | ✅ Implementado. | Consumir en el frontend para actualizar los datos corporativos. |

---

## 4. Diagnóstico Profesional (Diagnostic)

*   **Vistas en Frontend**: `Diagnostic.tsx`.
*   **Servicios/Stores**: [diagnostic.ts](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/diagnostic.ts).
*   **Estado de Conexión**: **Conectado**.

| Endpoint Requerido | Método | Propósito | Estado en Backend (`main`) | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/diagnostic/skills` | `GET` | Obtener el banco de habilidades categorizadas para responder la evaluación. | ✅ Implementado. | Ninguna. |
| `/api/v1/diagnostic/submit` | `POST` | Guardar las puntuaciones autoevaluadas del diagnóstico del profesional. | ✅ Implementado. | Ninguna. |
| `/api/v1/diagnostic` | `GET` | Comprobar si el usuario ya realizó su diagnóstico y ver estado general. | ✅ Implementado. | Ninguna. |

---

## 5. Ruta de Aprendizaje y Progreso (Learning)

*   **Vistas en Frontend**: `Learning.tsx` (Mi Ruta).
*   **Estado de Conexión**: ❌ **100% Mockeado en Frontend** (Disponible en Backend).

| Endpoint Requerido | Método | Propósito | Estado en Backend (`main`) | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/learning/paths` | `GET` | Obtener todas las rutas formativas y sus respectivos cursos. | ✅ Implementado. | Crear el archivo API `learning.ts` en el frontend, consumir el endpoint y reemplazar los mocks en `Learning.tsx`. |
| `/api/v1/learning/progress` | `GET` | Obtener el progreso del profesional autenticado en sus cursos. Si no tiene, el backend autogenera cursos pendientes de la ruta recomendada. | ✅ Implementado. | Consumir en el frontend para cargar los cursos asignados al profesional. |
| `/api/v1/learning/progress/:courseId` | `POST` | Cambiar el estado de un curso (ej: a `IN_PROGRESS` o `COMPLETED`). | ⚠️ **Diferencia de Firma**. | El backend lo tiene como `/progress/:courseId` (en la URL) recibiendo `{ status }` en el cuerpo. El frontend propuesto asume enviar `courseId` en el cuerpo. Se debe adaptar la API del front. |

---

## 6. Ofertas Laborales y Oportunidades (Jobs / Hiring)

*   **Vistas en Frontend**: `Opportunities.tsx` (Profesional), `Publications.tsx` (Empresa).
*   **Estado de Conexión**: **Conectado (Falta merge del backend)**.

| Endpoint Requerido (Propuesto) | Método | Propósito | Estado en Backend (`main`) | Estado en Otras Ramas | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/hiring/create-offer` | `POST` | Crear una oferta de empleo vinculada a la empresa autenticada. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend**. Fusionar backend de `gonza-dev` para habilitar. |
| `/api/v1/hiring/offers` | `GET` | Listar todas las ofertas laborales creadas por la propia empresa. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend** (getMyOffers). Fusionar backend de `gonza-dev` para habilitar. |
| `/api/v1/hiring/update-offer` | `PATCH` | Modificar datos de una oferta o su estado. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend**. Fusionar backend de `gonza-dev` para habilitar. |
| `/api/v1/hiring/delete-offer/:id` | `DELETE` | Eliminar una publicación de vacante. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend** (deleteOffer). Fusionar backend de `gonza-dev` para habilitar. |
| `/api/v1/hiring/opportunities` | `GET` | Listar vacantes en el Marketplace de profesionales (Opportunities.tsx) con filtros y ordenamiento. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend** (getOpportunities). Fusionar backend de `gonza-dev` para habilitar. |

---

## 7. Búsqueda de Talento y Selección (Talent Search & Preselection)

*   **Vistas en Frontend**: `TalentSearch.tsx` (Búsqueda de Talento por Empresa).
*   **Estado de Conexión**: **Conectado (Falta merge del backend)**.

| Endpoint Requerido (Propuesto) | Método | Propósito | Estado en Backend (`main`) | Estado en Otras Ramas | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/hiring/search-candidates` | `GET` | Buscar perfiles profesionales seniors activos usando filtros complejos (expectativa salarial, ubicación, modalidad, habilidades, años de experiencia). | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend** (searchCandidates). Fusionar backend de `gonza-dev` para habilitar. |
| `/api/v1/hiring/preselection` | `POST` | Guardar un candidato en el embudo de interés/preselección de la empresa. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend** (preselectCandidate). Fusionar backend de `gonza-dev` para habilitar. |
| `/api/v1/hiring/preselection/:id/:status` | `PATCH` | Avanzar el estado de un candidato preseleccionado. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend** (updatePreselectionStatus). Fusionar backend de `gonza-dev` para habilitar. |

---

## 8. Eventos y Calendario (Events)

*   **Vistas en Frontend**: `Events.tsx` (Calendario e inscripciones).
*   **Estado de Conexión**: **Conectado (Falta merge del backend)**.

| Endpoint Requerido (Propuesto) | Método | Propósito | Estado en Backend (`main`) | Estado en Otras Ramas | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/events/get-all` | `GET` | Obtener la lista de webinars, talleres y clases programados. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend** (getAllEvents). Fusionar backend de `gonza-dev` para habilitar. |
| `/api/v1/events/enroll/:id` | `POST` | Inscribir al profesional logueado en un evento. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend** (enrollEvent). Fusionar backend de `gonza-dev` para habilitar. |
| `/api/v1/events/create` | `POST` | Crear un evento en la plataforma (Restringido a rol `ADMIN`). | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | **Conectado en frontend** (createEvent). Fusionar backend de `gonza-dev` para habilitar. |

---

## 9. Estadísticas del Dashboard (Stats)

*   **Vistas en Frontend**: `ProfessionalDashboard.tsx`, `CompanyDashboard.tsx`.
*   **Estado de Conexión**: ❌ **100% Mockeado**.

| Endpoint Requerido (Propuesto) | Método | Propósito | Estado en Backend (`main`) | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/stats/professional` | `GET` | Devolver métricas acumuladas del profesional. | ❌ **Ausente**. | Crear controlador que consulte el `completionScore` de su perfil y sume sus progresos en `CourseProgress`. |
| `/api/v1/stats/company` | `GET` | Devolver métricas acumuladas de la empresa. | ❌ **Ausente**. | Crear controlador que cuente las ofertas activas en `JobOffer` y preselecciones de la empresa en la tabla `Preselection`. |
