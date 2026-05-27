# Estado de Integración — Frontend vs Backend
> **Última actualización:** 27 de mayo 2026 · Rama `main`

> [!IMPORTANT]
> **Consola interactiva** disponible en la ruta pública `/about` del frontend local (`http://localhost:5173/about`).

---

## Resumen Rápido

| Módulo | Estado |
| :--- | :--- |
| Autenticación | ✅ Conectado |
| Perfil Profesional | ✅ Conectado |
| Perfil Empresa | ✅ Conectado |
| Diagnóstico | ✅ Conectado |
| Rutas de Aprendizaje | ⚠️ Backend listo — Falta conectar en Frontend |
| Ofertas Laborales (Empresa) | ✅ Conectado |
| Marketplace de Oportunidades (Profesional) | ✅ Conectado |
| Postulación a Ofertas | 🟡 **Simulado con LocalStorage** (ver nota) |
| Búsqueda de Talentos (Empresa) | ✅ Conectado |
| Preselección de Candidatos desde TalentSearch | ✅ Conectado (endpoint real en backend) |
| Panel de Postulantes (CompanyDashboard) | 🟡 **Simulado con LocalStorage** (ver nota) |
| Eventos — Ver y Crear | ✅ Conectado |
| Eventos — Inscripción / Cancelación | ✅ Conectado |
| Eventos — "Mis Eventos" (filtro profesional) | ✅ Conectado (usa enrolls del backend) |
| Estadísticas del Dashboard | ❌ Maquetado (endpoint ausente en backend) |

---

## 1. Autenticación (Auth)

**Vistas:** `Login.tsx`, `Register.tsx`, `VerifyEmail.tsx`
**Servicio:** [`auth.ts`](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/auth.ts)

| Endpoint | Método | Estado | Nota |
| :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | ✅ Conectado | Credenciales: `usuario@test.com`, `empresa@test.com`, `admin@test.com` / `123456789` |
| `/api/v1/auth/register` | `POST` | ✅ Conectado | Crea automáticamente `ProfessionalProfile` o `CompanyProfile` según rol |
| `/api/v1/auth/verify-email/:token` | `PATCH` | ✅ Conectado | Token de activación por email |
| `/api/v1/auth/validate-session` | `GET` | ✅ Conectado | Usado en el AuthStore al iniciar la app |
| `/api/v1/auth/logout` | `PATCH` | ✅ Conectado | Limpia cookies HttpOnly e invalida sesión |

---

## 2. Perfiles Profesionales

**Vistas:** `Profile.tsx`, `CvPreview.tsx`
**Servicio:** [`profiles.ts`](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/profiles.ts)

| Endpoint | Método | Estado |
| :--- | :--- | :--- |
| `/api/v1/profiles/me` | `GET` | ✅ Conectado |
| `/api/v1/profiles/update` | `PATCH` | ✅ Conectado |
| `/api/v1/profiles/experience` | `POST` | ✅ Conectado |
| `/api/v1/profiles/experience/:id` | `DELETE` | ✅ Conectado |
| `/api/v1/profiles/education` | `POST` | ✅ Conectado |
| `/api/v1/profiles/education/:id` | `DELETE` | ✅ Conectado |
| `/api/v1/profiles/certifications` | `POST` | ✅ Conectado |
| `/api/v1/profiles/certifications/:id` | `DELETE` | ✅ Conectado |
| `/api/v1/profiles/languages` | `POST` | ✅ Conectado |
| `/api/v1/profiles/languages/:id` | `DELETE` | ✅ Conectado |
| `/api/v1/profiles/skills` | `POST` | ✅ Conectado |
| `/api/v1/profiles/skills/:skillId` | `DELETE` | ✅ Conectado |
| `/api/v1/profiles/slug/:slug` | `GET` | ✅ Conectado — Vista pública del CV |

---

## 3. Perfiles de Empresa

**Vistas:** `CompanyDashboard.tsx`, `Profile.tsx` (pestaña empresa)
**Servicio:** [`profiles.ts`](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/profiles.ts)

| Endpoint | Método | Estado |
| :--- | :--- | :--- |
| `/api/v1/profiles/company/me` | `GET` | ✅ Conectado |
| `/api/v1/profiles/company/update` | `PATCH` | ✅ Conectado |

---

## 4. Diagnóstico Profesional

**Vista:** `Diagnostic.tsx`
**Servicio:** [`diagnostic.ts`](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/diagnostic.ts)

| Endpoint | Método | Estado |
| :--- | :--- | :--- |
| `/api/v1/diagnostic/skills` | `GET` | ✅ Conectado |
| `/api/v1/diagnostic/submit` | `POST` | ✅ Conectado |
| `/api/v1/diagnostic` | `GET` | ✅ Conectado |

---

## 5. Rutas de Aprendizaje

**Vista:** `Learning.tsx`
**Servicio:** [`learning.ts`](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/learning.ts) (creado, pendiente de integrar en vista)

| Endpoint | Método | Estado | Nota |
| :--- | :--- | :--- | :--- |
| `/api/v1/learning/paths` | `GET` | ⚠️ Backend listo — Falta en Vista | El archivo `learning.ts` existe, pero `Learning.tsx` aún usa datos mockeados |
| `/api/v1/learning/progress` | `GET` | ⚠️ Backend listo — Falta en Vista | Autogenera cursos sugeridos según diagnóstico |
| `/api/v1/learning/progress/:courseId` | `POST` | ⚠️ Backend listo — Falta en Vista | Body: `{ status: "COMPLETED" }` |

---

## 6. Ofertas Laborales y Marketplace

**Vistas:** `Publications.tsx` (empresa), `Opportunities.tsx` (profesional)
**Servicio:** [`hiring.ts`](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/hiring.ts)

| Endpoint | Método | Vista | Estado |
| :--- | :--- | :--- | :--- |
| `/api/v1/hiring/create-offer` | `POST` | Publications | ✅ Conectado |
| `/api/v1/hiring/offers` | `GET` | Publications / CompanyDashboard | ✅ Conectado |
| `/api/v1/hiring/update-offer` | `PATCH` | Publications | ✅ Conectado |
| `/api/v1/hiring/delete-offer/:id` | `DELETE` | Publications | ✅ Conectado |
| `/api/v1/hiring/opportunities` | `GET` | Opportunities | ✅ Conectado (con filtros y búsqueda) |

> [!NOTE]
> **Postulación a ofertas (Opportunities.tsx):** El botón "Postularme" y el estado "Postulado ✓" se simulan con **localStorage** porque no existe un endpoint de postulación desde el lado del profesional en el backend. El backend tiene `POST /hiring/preselection` pero es para que la **empresa** marque a un profesional — no para que el profesional se postule. Las postulaciones se guardan en `professional_applications_{userId}` y en `global_job_applications` para ser leídas por el dashboard de empresa.

---

## 7. Búsqueda de Talentos y Selección

**Vista:** `TalentSearch.tsx`
**Servicio:** [`hiring.ts`](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/hiring.ts)

| Endpoint | Método | Estado |
| :--- | :--- | :--- |
| `/api/v1/hiring/search-candidates` | `GET` | ✅ Conectado — Busca en `ProfessionalProfile` con filtros |
| `/api/v1/hiring/preselection` | `POST` | ✅ Conectado — Empresa marca un candidato como interesante |
| `/api/v1/hiring/preselection/:id/:status` | `PATCH` | ✅ Conectado — Avanza estado del candidato |

> [!NOTE]
> **Panel de postulantes en CompanyDashboard:** Los candidatos que se postularon via "Postularme" (localStorage) se cruzan con las ofertas reales de la empresa para mostrar el funnel. El avance de fases (Interesado → Contactado → Entrevistando → Contratado) también se simula en localStorage. Si en el futuro se agrega un endpoint `POST /hiring/apply/:offerId`, esta lógica puede migrar a persistencia real sin cambios en la UI.

---

## 8. Eventos y Calendario

**Vista:** [`Events.tsx`](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/pages/dashboard/shared/Events.tsx)
**Servicio:** [`events.ts`](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/src/api/events.ts)

| Endpoint | Método | Estado |
| :--- | :--- | :--- |
| `/api/v1/events/get-all` | `GET` | ✅ Conectado — Incluye `enrolls[]` para saber inscriptos |
| `/api/v1/events/enroll/:id` | `POST` | ✅ Conectado — Solo PROFESSIONAL |
| `/api/v1/events/unenroll/:id` | `POST` | ✅ Conectado — Cancelar inscripción |
| `/api/v1/events/create` | `POST` | ✅ Conectado — Solo ADMIN |

**Funcionalidades adicionales implementadas en el frontend:**
- ✅ Pestaña **"Mis Eventos"** visible solo para profesionales — filtra por eventos donde el profesional ya tiene un `EventEnroll` en la base de datos
- ✅ **Fix "Invalid Date"** — helper `parseDateString()` que extrae solo `YYYY-MM-DD` de strings ISO completos (`2026-06-15T03:00:00.000Z`)
- ✅ **Script de seed vía API** en [`frontend/scripts/seed-via-api.mjs`](file:///c:/Users/Hernan/Documents/GitHub/S04-26-Equipo-02-Web-App-Development/frontend/scripts/seed-via-api.mjs) — pobla eventos, ofertas e inscripciones usando credenciales HTTP sin acceso directo a la base de datos

---

## 9. Estadísticas del Dashboard

**Vistas:** `ProfessionalDashboard.tsx`, `CompanyDashboard.tsx`

| Endpoint | Método | Estado | Nota |
| :--- | :--- | :--- | :--- |
| `/api/v1/stats/professional` | `GET` | ❌ Endpoint ausente en backend | Las métricas del dashboard profesional son datos estáticos/maquetados |
| `/api/v1/stats/company` | `GET` | `PARTIAL` | El conteo de postulantes y vacantes en `CompanyDashboard` se calcula combinando `getMyOffers()` (real) + `global_job_applications` (localStorage) |
