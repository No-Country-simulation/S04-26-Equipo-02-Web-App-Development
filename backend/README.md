# Backend — Red de Bienestar Laboral

Este repositorio contiene el servidor central para la plataforma. El desarrollo se basa en una arquitectura modular para facilitar el trabajo en paralelo de los tres integrantes del equipo de backend.

---

## Inicio Rápido

1. **Instalación:** Ejecutá `npm install` en la carpeta `backend`.
2. **Entorno:** Copiá `.env.example` a `.env` y configurá tu `DATABASE_URL` local de PostgreSQL.
3. **Base de Datos:**
   - `npx prisma generate` (para actualizar los tipos).
   - `npx prisma migrate dev` (para crear las tablas en tu base local).
4. **Servidor:** `npm run dev` para iniciar con hot-reload.

---

## Guías del Equipo

Si tenés dudas sobre cómo escribir código o cómo manejar la base de datos, consultá los archivos en la carpeta `/docs`:

- **[Arquitectura y Carpetas](./docs/arquitectura.md):** Cómo estructurar tus rutas, controladores y servicios.
- **[Flujo de Prisma](./docs/base-de-datos.md):** Qué comandos ejecutar cuando alguien cambia el esquema de la base de datos.
- **[Convenciones de API](./docs/api.md):** Formatos de respuesta y nombres de endpoints.

---

## Comandos Útiles

- `npx prisma studio`: Abre un panel visual para ver y editar los datos de tu base local.
- `npm run dev`: Modo desarrollo.
- `npx prisma migrate dev`: Aplica cambios del esquema a tu base de datos.

---

## Convenciones de Git

Para mantener el historial de cambios ordenado, los mensajes de commit deben seguir el formato: `prefijo: descripción breve en minúsculas`.

### Prefijos permitidos:
- `feat:` Nueva funcionalidad (ej: `feat: endpoint de registro de usuario`).
- `fix:` Corrección de un error (ej: `fix: validacion de email en login`).
- `docs:` Cambios solo en la documentación (ej: `docs: actualizacion de guia de instalacion`).
- `refactor:` Cambio en el código que no corrige errores ni agrega funcionalidades (ej: `refactor: limpieza de imports`).
- `chore:` Tareas de mantenimiento, actualización de dependencias, configuración de herramientas (ej: `chore: actualizacion de version de prisma`).

**Nota:** Acordate de hacer el commit con cambios chicos, no hagas un commit con cambios de todo lo que hiciste en el dia jaja.
