# Frontend — Red de Bienestar Laboral

Este repositorio contiene el cliente web para la plataforma de empleabilidad de profesionales +45. El desarrollo se basa en una arquitectura modular para facilitar el trabajo en paralelo del equipo.

---

## Inicio Rápido

1. **Instalación:** Ejecutá `npm install` en la carpeta `frontend`.
2. **Entorno:** Creá un archivo `.env` con `VITE_API_URL=http://localhost:3001` (o la URL del backend).
3. **Servidor:** `npm run dev` para iniciar con hot-reload.

---

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router v7
- TanStack React Query
- Axios
- Tailwind CSS v4
- Redux Toolkit + React Redux

---

## Estructura

```
src/
├── api/            # Axios + endpoints
├── components/     # Componentes reutilizables
├── context/        # Auth Context
├── hooks/          # Custom hooks
├── pages/          # Vistas
├── store/          # Redux store
└── types/          # TypeScript interfaces
```

---

## Comandos Útiles

- `npm run dev` — Levantar dev server
- `npm run build` — Build producción
- `npm run lint` — Lint
- `npm run preview` — Previsualizar build

---

## Convenciones de Git

Para mantener el historial de cambios ordenado, los mensajes de commit deben seguir el formato: `prefijo: descripción breve en minúsculas`.

### Prefijos permitidos:

- `feat:` Nueva funcionalidad (ej: `feat: agregar página de diagnóstico`).
- `fix:` Corrección de un error (ej: `fix: corregir redirect tras login`).
- `docs:` Cambios solo en la documentación (ej: `docs: actualizar readme`).
- `refactor:` Cambio en el código que no corrige errores ni agrega funcionalidades (ej: `refactor: mover lógica de auth a hook`).
- `chore:` Tareas de mantenimiento, actualización de dependencias, configuración de herramientas (ej: `chore: agregar tailwind`).
- `style:` Cambios en estilos (ej: `style: actualizar colores del navbar`).

**Nota:** Acordate de hacer el commit con cambios chicas, no hagas un commit con cambios de todo lo que hiciste en el día.