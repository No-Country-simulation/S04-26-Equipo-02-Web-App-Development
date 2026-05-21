# Documentación de Arquitectura y Refactorización del Frontend

Este documento detalla la estructura, organización de archivos y la implementación de mejores prácticas aplicadas en el frontend de la **Red de Bienestar Laboral (+45)**.

---

## 1. Estructura de Directorios (Organización por Roles)

Para mejorar la mantenibilidad y escalabilidad del proyecto, hemos reorganizado las vistas principales bajo el directorio `src/pages` según el rol del usuario que accede a ellas.

```text
frontend/src/
├── api/                  # Capa de Servicios API (Servicios Puros)
│   ├── axios.ts          # Configuración base de Axios e Interceptores
│   ├── auth.ts           # Servicios de Autenticación
│   ├── profiles.ts       # Servicios de Perfil Profesional (Experiencia, Educación, etc.)
│   └── diagnostic.ts     # Servicios de Diagnóstico de Competencias
│
├── components/           # Componentes Visuales Reutilizables
│   ├── dashboard/        # Componentes exclusivos del Panel de Control
│   │   ├── profile/      # Componentes del formulario de Perfil (Tabs, Forms)
│   │   │   └── types.ts  # Tipos y Modelos unificados del Perfil Profesional
│   │   └── ProfileSummaryCard.tsx # Tarjeta de resumen de perfil profesional
│   └── ui/               # Componentes de UI generales (Skeletons, Buttons, etc.)
│
├── pages/                # Vistas de Páginas Completas
│   ├── admin/            # Vistas exclusivas de Administrador
│   │   ├── AdminDashboard.tsx
│   │   └── AdminLogin.tsx
│   │
│   ├── company/          # Vistas exclusivas de Empresas
│   │   └── CompanyDashboard.tsx
│   │
│   ├── professional/     # Vistas exclusivas de Profesionales (+45)
│   │   ├── ProfessionalDashboard.tsx
│   │   └── Diagnostic.tsx
│   │
│   ├── dashboard/        # Vistas compartidas o generales del Dashboard
│   │   ├── GeneralDashboard.tsx  # Despachador de vistas según rol
│   │   └── Profile.tsx           # Vista general para configurar el Perfil
│   │
│   ├── Home.tsx          # Landing page del sitio
│   ├── Login.tsx         # Login general
│   └── Register.tsx      # Registro general
```

---

## 2. Capa de Servicios API (Separación de Preocupaciones)

Hemos abstraído todas las interacciones HTTP y lógica de Axios de los componentes visuales hacia archivos de servicios dedicados bajo `src/api/`. Esto asegura que los componentes se enfoquen estrictamente en renderizar la interfaz y manejar eventos de usuario.

### Configuración Base (`src/api/axios.ts`)
Establece la URL base del backend, el encabezado `Content-Type: application/json` y habilita `withCredentials: true` para enviar cookies de sesión de forma segura. Además, implementa un interceptor de respuesta que unifica el manejo de errores mediante la clase personalizada `ApiError`.

### Servicios Implementados:
* **Autenticación (`src/api/auth.ts`)**:
  * `login(credentials)`: Inicia sesión del usuario por rol.
  * `register(data)`: Registra un nuevo usuario profesional o empresa.
  * `logout()`: Cierra la sesión activa borrando las cookies y el almacenamiento local.
  * `validateSession()`: Verifica si la cookie de sesión actual es válida con el backend.
* **Perfiles (`src/api/profiles.ts`)**:
  * `getMyProfile()`: Obtiene el perfil profesional del usuario autenticado.
  * `updateMyProfile(payload)`: Actualiza los campos básicos del perfil.
  * `addExperience(data)` / `deleteExperience(id)`: Agrega/elimina experiencia laboral.
  * `addEducation(data)` / `deleteEducation(id)`: Agrega/elimina formación académica.
  * `addCertification(data)` / `deleteCertification(id)`: Agrega/elimina certificaciones profesionales.
  * `addLanguage(data)` / `deleteLanguage(id)`: Agrega/elimina idiomas.
* **Diagnóstico (`src/api/diagnostic.ts`)**:
  * `getDiagnosticSkills()`: Recupera la lista de habilidades categorizadas (Digitales, Cognitivas y Socioemocionales) desde el backend.
  * `submitDiagnosticAnswers(answers)`: Envía los resultados de la autoevaluación del profesional.

---

## 3. Enrutamiento y Seguridad (Rutas Protegidas)

El control de acceso en el frontend está gestionado de manera centralizada en `src/App.tsx` utilizando `react-router-dom` y un componente de enrutamiento protegido `ProtectedRoute`.

### Protección de Acceso Basada en Roles
El sistema bloquea accesos directos por URL a apartados no autorizados utilizando subrutas anidadas en `App.tsx`:

```tsx
{/* Rutas exclusivas para Profesionales */}
<Route element={<ProtectedRoute allowedRoles={['PROFESSIONAL']} />}>
  <Route path="diagnostic" element={<Diagnostic />} />
</Route>

{/* Rutas exclusivas para Empresas */}
<Route element={<ProtectedRoute allowedRoles={['COMPANY']} />}>
  <Route path="talent-search" element={<UnderConstruction title="Buscar Talento" />} />
</Route>
```

Si un usuario logueado con rol `COMPANY` intenta entrar manualmente a `/dashboard/diagnostic`, el componente `<ProtectedRoute>` valida los permisos de su rol contra el array `allowedRoles`. Al no cumplir los requisitos, redirige automáticamente al usuario a una ruta segura o a su propio Dashboard sin mostrar contenido privado.

### Redirección Automática si está Logueado
Para mejorar la experiencia de usuario y evitar pantallas duplicadas, si un usuario que ya tiene sesión activa intenta acceder a las páginas de inicio de sesión o registro (`/login`, `/register`, `/admin/login`), un guardia de redirección en estos componentes los envía de inmediato a `/dashboard`.

---

## 4. Tipos y Modelos Unificados

Hemos centralizado las interfaces TypeScript principales para el perfil profesional en `src/components/dashboard/profile/types.ts`. Esto elimina la duplicación de código e inconsistencias de tipos:

* **Modelos Centralizados**: `ProfessionalProfile`, `WorkExperience`, `Education`, `Certification`, `Language`, y `ProfileSkill`.
* **Reducción de Deuda Técnica**: Eliminamos las copias redundantes de tipos en `ProfileSummaryCard.tsx` y otros componentes, consumiendo ahora directamente la definición centralizada.

---

## 5. Compilación y Calidad del Código

El proyecto ha sido verificado con éxito ejecutando el compilador de TypeScript y el constructor de bundles de producción:

```bash
npm run build
```

El build compila sin errores de importación ni fallos en las definiciones de tipos, asegurando una integración fluida en entornos de producción.
