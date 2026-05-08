# Sugerencias para el Equipo de Backend

Este documento detalla mejoras identificadas durante el desarrollo del prototipo frontend para mejorar la arquitectura y la experiencia de usuario (UX).

## 1. Simplificación del Flujo de Login
**Situación Actual:**
El endpoint `/auth/login` requiere obligatoriamente el campo `provider` (`PROFESSIONAL` o `COMPANY`) y lanza un error `PROVIDER_MISMATCH` si no coincide con el rol del usuario en la base de datos.

**Propuesta:**
*   Eliminar la obligatoriedad del campo `provider` en el `loginSchema`.
*   El backend debe buscar al usuario por `email`, verificar la contraseña y, tras la validación exitosa, devolver el `role` del usuario en el objeto de respuesta.
*   **Beneficio:** Permite un login unificado en el frontend sin que el usuario tenga que recordar o seleccionar su rol manualmente.

## 2. Validación de Teléfono
**Situación Actual:**
El backend acepta cualquier string en el campo `phone`.

**Propuesta:**
*   Implementar una validación básica (Regex) para asegurar que el teléfono contenga solo números (o formato internacional con `+`).
*   **Beneficio:** Integridad de datos en la base de datos.

## 3. Manejo de Perfiles de Empresa (CompanyProfile)
**Situación Actual:**
El registro con rol `COMPANY` crea el usuario pero no genera el perfil de empresa, lo que causa errores en el frontend al intentar acceder a datos inexistentes.

**Propuesta:**
*   Asegurar que el `authService` cree un registro en `CompanyProfile` al registrarse una empresa, similar a como ya hace con `ProfessionalProfile`.
