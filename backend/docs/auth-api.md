# 🔐 API Reference: Authentication

**Base URL:** `/api/v1/auth`

Esta sección detalla los endpoints necesarios para el flujo de autenticación y registro. Todas las peticiones deben enviarse con el header `Content-Type: application/json`.

---

## 1. Registro de Usuario
Crea una nueva cuenta. El usuario se crea en estado inactivo hasta que verifique su email.

*   **URL:** `/register`
*   **Método:** `POST`
*   **Cuerpo de la Petición (JSON):**
    ```json
    {
      "email": "test@example.com",
      "password": "securepassword123",
      "provider": "PROFESSIONAL", // Opciones: "PROFESSIONAL", "COMPANY", "ADMIN"
      "firstName": "Nombre",
      "lastName": "Apellido",
      "location": "Ciudad, País",
      "phone": "+123456789"
    }
    ```
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": { "message": "Usuario registrado. Por favor verifica tu email." },
      "error": null
    }
    ```
*   **Errores posibles:**
    *   `400`: Datos inválidos o el usuario ya existe.

---

## 2. Login
Inicia sesión y establece las cookies de autenticación.

*   **URL:** `/login`
*   **Método:** `POST`
*   **Cuerpo de la Petición (JSON):**
    ```json
    {
      "email": "test@example.com",
      "password": "securepassword123",
      "provider": "PROFESSIONAL"
    }
    ```
*   **Respuesta Exitosa (200 OK):**
    > **IMPORTANTE:** El servidor responde con dos cookies `HttpOnly`: `token` (Access Token, corta duración) y `refreshToken` (Larga duración). El frontend no necesita manejar el token manualmente, se enviará solo en peticiones subsiguientes.
    ```json
    {
      "success": true,
      "data": { "message": "Login exitoso" },
      "error": null
    }
    ```
*   **Errores posibles:**
    *   `401`: Contraseña incorrecta.
    *   `404`: Usuario no encontrado o no verificado.

---

## 3. Verificar Email
Activa la cuenta del usuario mediante un token.

*   **URL:** `/verify-email/:token`
*   **Método:** `PATCH`
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": { "message": "Email verificado correctamente" },
      "error": null
    }
    ```

---

## 4. Validar Sesión
Verifica si el usuario tiene una sesión activa y válida (cookies presentes).

*   **URL:** `/validate-session`
*   **Método:** `GET`
*   **Requerimiento:** Debe enviarse con `withCredentials: true` en Axios o `credentials: 'include'` en Fetch.
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": { "message": "Sesión válida" },
      "error": null
    }
    ```
*   **Respuesta Error (401 Unauthorized):**
    ```json
    {
      "success": false,
      "data": null,
      "error": "Token expirado o inválido"
    }
    ```
