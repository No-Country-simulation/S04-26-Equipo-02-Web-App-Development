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

Durante la auditoría del repositorio se identificó código desarrollado en ramas secundarias que aún no está integrado en la rama `main`:

*   **Rama `gonza-dev`**: 
    *   Implementa el módulo de contratación `/api/v1/hiring` con endpoints para buscar candidatos, crear, editar y borrar ofertas laborales.
    *   Contiene una validación en el registro para impedir la creación manual de usuarios con rol `ADMIN`.
    *   *Nota*: Cambia el middleware de `cors` en el backend a `cors()`, lo cual puede requerir re-configurar `credentials: true` y `origin` para que las cookies `HttpOnly` sigan funcionando.
*   **Rama `feature/company-profile-endpoints`**: 
    *   Implementa el disparador automático para que, al registrar una cuenta de tipo `COMPANY`, se inserte de inmediato su perfil en la tabla `CompanyProfile`.
    *   Agrega los endpoints para leer y actualizar la información de perfiles de empresa.

---

## 1. Autenticación (Auth)

*   **Vistas en Frontend**: `Login.tsx`, `Register.tsx`, `VerifyEmail.tsx`, `App.tsx` (carga de sesión).
*   **Servicios/Stores**: [auth.ts](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/auth.ts), [authStore.ts](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/store/authStore.ts).
*   **Estado de Conexión**: **Parcialmente Conectado**.

| Endpoint Requerido | Método | Propósito | Estado en Backend (`main`) | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Iniciar sesión y establecer cookies `token` y `refreshToken`. | ✅ Implementado. | Ninguna. |
| `/api/v1/auth/register` | `POST` | Registro de nuevos usuarios (Profesionales/Empresas). | ✅ Implementado. | *Avance en `feature/company-profile-endpoints`*: Agrega la creación automática de `CompanyProfile` para el rol `COMPANY`. |
| `/api/v1/auth/verify-email/:token` | `PATCH` | Verificar email mediante token de activación. | ✅ Implementado. | Ninguna. |
| `/api/v1/auth/validate-session` | `GET` | Validar sesión activa en base a las cookies. | ✅ Implementado. | Ninguna. |
| `/api/v1/auth/logout` | `POST` | Cerrar sesión limpiando las cookies `HttpOnly` del navegador. | ❌ **Ausente**. | Crear ruta y controlador en backend que llame a `res.clearCookie('token')` y `res.clearCookie('refreshToken')`. |

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
| `/api/v1/profiles/slug/:slug` | `GET` | Obtener el perfil público del profesional para vista previa de CV o búsquedas. | ❌ **Ausente en rutas** (Existe en servicio). | Agregar la ruta `GET /slug/:slug` en `profiles.routes.ts` y llamar al servicio `getProfileBySlug(slug)`. |

---

## 3. Perfiles de Empresas (Company Profiles)

*   **Vistas en Frontend**: `CompanyDashboard.tsx` (datos generales corporativos), `Profile.tsx` (pestaña de empresa).
*   **Estado de Conexión**: ❌ **Mockeado / LocalStorage** (Listo en rama de desarrollo).

| Endpoint Requerido (Propuesto) | Método | Propósito | Estado en Backend (`main`) | Estado en Otras Ramas | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/profiles/company/me` | `GET` | Obtener los datos del perfil corporativo de la empresa autenticada. | ❌ **Ausente**. | 🛠️ *Desarrollado en `feature/company-profile-endpoints`*. | Fusionar rama y conectar en el frontend. |
| `/api/v1/profiles/company/update` | `PATCH` | Actualizar nombre, industria, descripción, logo y web de la empresa. | ❌ **Ausente**. | 🛠️ *Desarrollado en `feature/company-profile-endpoints`*. | Fusionar rama y conectar en el frontend. |

---

## 4. Diagnóstico Profesional (Diagnostic)

*   **Vistas en Frontend**: `Diagnostic.tsx`.
*   **Servicios/Stores**: [diagnostic.ts](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/diagnostic.ts).
*   **Estado de Conexión**: **Parcialmente Conectado**.

| Endpoint Requerido | Método | Propósito | Estado en Backend (`main`) | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/diagnostic/skills` | `GET` | Obtener el banco de habilidades categorizadas para responder la evaluación. | ✅ Implementado. | Ninguna. |
| `/api/v1/diagnostic/submit` | `POST` | Guardar las puntuaciones autoevaluadas del diagnóstico del profesional. | ✅ Implementado. | Ninguna. |
| `/api/v1/diagnostic` | `GET` | Comprobar si el usuario ya realizó su diagnóstico y ver estado general. | ❌ **Ausente**. | Crear ruta `GET /` en `diagnostic.routes.ts` que consulte la base de datos para ver si el usuario tiene registros en `DiagnosticResult`. |

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
*   **Estado de Conexión**: ❌ **100% Mockeado en main** (Listo en rama de desarrollo).

| Endpoint Requerido (Propuesto) | Método | Propósito | Estado en Backend (`main`) | Estado en Otras Ramas | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/hiring/create-offer` | `POST` | Crear una oferta de empleo vinculada a la empresa autenticada. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | Fusionar rama y crear llamadas API correspondientes en el front. |
| `/api/v1/hiring/offers` | `GET` | Listar todas las ofertas laborales creadas por la propia empresa. | ❌ **Ausente**. | ❌ *Ausente* (la rama `gonza-dev` implementa la creación, pero no el listado por empresa). | Crear endpoint que consulte `JobOffer` filtrando por la empresa asociada al usuario autenticado. |
| `/api/v1/hiring/update-offer` | `PATCH` | Modificar datos de una oferta o su estado. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | Fusionar rama. Nota: recibe el body completo de la oferta. |
| `/api/v1/hiring/delete-offer/:id` | `DELETE` | Eliminar una publicación de vacante. | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | Fusionar rama. |
| `/api/v1/hiring/opportunities` | `GET` | Listar vacantes en el Marketplace de profesionales (Opportunities.tsx) con filtros y ordenamiento. | ❌ **Ausente**. | ❌ *Ausente*. | Crear endpoint que consulte `JobOffer` con filtros avanzados. |

---

## 7. Búsqueda de Talento y Selección (Talent Search & Preselection)

*   **Vistas en Frontend**: `TalentSearch.tsx` (Búsqueda de Talento por Empresa).
*   **Estado de Conexión**: ❌ **100% Mockeado en main** (Listo en rama de desarrollo).

| Endpoint Requerido (Propuesto) | Método | Propósito | Estado en Backend (`main`) | Estado en Otras Ramas | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/hiring/search-candidates` | `GET` | Buscar perfiles profesionales seniors activos usando filtros complejos (expectativa salarial, ubicación, modalidad, habilidades, años de experiencia). | ❌ **Ausente**. | 🛠️ *Desarrollado en `gonza-dev`*. | Fusionar rama. El endpoint soporta filtrados múltiples complejos. |
| `/api/v1/hiring/preselection` | `POST` | Guardar un candidato en el embudo de interés/preselección de la empresa. | ❌ **Ausente**. | ❌ *Ausente*. | Crear endpoint para insertar un registro en la tabla `Preselection`. |
| `/api/v1/hiring/preselection/:id` | `PATCH` | Avanzar el estado de un candidato preseleccionado. | ❌ **Ausente**. | ❌ *Ausente*. | Crear endpoint para modificar el status en `Preselection`. |

---

## 8. Eventos y Calendario (Events)

*   **Vistas en Frontend**: `Events.tsx` (Calendario e inscripciones).
*   **Estado de Conexión**: ❌ **100% Mockeado**.

| Endpoint Requerido (Propuesto) | Método | Propósito | Estado en Backend (`main`) | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/events` | `GET` | Obtener la lista de webinars, talleres y mesas redondas programados. | ❌ **Ausente**. | Declarar modelos `Event` y `EventRegistration` en el schema de Prisma, crear el controlador y la ruta correspondiente. |
| `/api/v1/events/:id/register` | `POST` | Inscribir al profesional logueado en un evento. | ❌ **Ausente**. | Crear endpoint que asocie al profesional con el evento en `EventRegistration`. |
| `/api/v1/events` | `POST` | Crear un evento en la plataforma (Restringido a rol `ADMIN`). | ❌ **Ausente**. | Crear endpoint de administración para poblar el calendario. |

---

## 9. Estadísticas del Dashboard (Stats)

*   **Vistas en Frontend**: `ProfessionalDashboard.tsx`, `CompanyDashboard.tsx`.
*   **Estado de Conexión**: ❌ **100% Mockeado**.

| Endpoint Requerido (Propuesto) | Método | Propósito | Estado en Backend (`main`) | Adaptación / Cambio Requerido |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/stats/professional` | `GET` | Devolver métricas acumuladas del profesional. | ❌ **Ausente**. | Crear controlador que consulte el `completionScore` de su perfil y sume sus progresos en `CourseProgress`. |
| `/api/v1/stats/company` | `GET` | Devolver métricas acumuladas de la empresa. | ❌ **Ausente**. | Crear controlador que cuente las ofertas activas en `JobOffer` y preselecciones de la empresa en la tabla `Preselection`. |
