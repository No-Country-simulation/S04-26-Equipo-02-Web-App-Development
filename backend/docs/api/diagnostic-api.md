# Módulo de Diagnóstico

Este módulo permite a los profesionales realizar su test inicial de competencias.

**Base URL:** `/api/v1/diagnostic`

---

## 1. Obtener lista de habilidades
Usa este endpoint para renderizar las preguntas del test.

*   **URL:** `/skills`
*   **Método:** `GET`
*   **Autenticación:** No requerida (Pública).
*   **Respuesta Exitosa (200 OK):**
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "uuid-skill-123",
          "name": "IA Generativa para Productividad",
          "category": "DIGITAL",
          "description": "..."
        }
      ]
    }
    ```

---

## 2. Enviar resultados del test
Envía las respuestas del usuario para actualizar su perfil profesional.

*   **URL:** `/submit`
*   **Método:** `POST`
*   **Autenticación:** Requerida (Cookie `token`).
*   **Cuerpo de la petición (JSON):**
    ```json
    {
      "answers": [
        { "skillId": "uuid-skill-123", "score": 4 },
        { "skillId": "uuid-skill-456", "score": 5 }
      ]
    }
    ```
    *Nota: `score` debe ser un número del 1 al 5.*

*   **Respuesta Exitosa (201 Created):**
    ```json
    {
      "success": true,
      "data": {
        "message": "Diagnóstico procesado y habilidades vinculadas al perfil",
        "newCompletionScore": 20
      }
    }
    ```

*   **Errores posibles:**
    *   `401 Unauthorized`: No hay token o es inválido.
    *   `400 Bad Request`: Formato de JSON inválido o faltan campos.
    *   `404 Not Found`: El usuario no tiene un perfil profesional creado todavía.

---

## Notas de Implementación:
1.  **Categorías:** Las habilidades vienen categorizadas como `DIGITAL`, `COGNITIVE` o `SOCIOEMOTIONAL`. Se sugiere agrupar las preguntas por categoría en la UI.
2.  **Manejo de Cookies:** El backend maneja la autenticación vía cookies (`HttpOnly`). El frontend no necesita adjuntar el token manualmente en los headers, pero debe asegurarse de que la petición incluya las credenciales (`withCredentials: true` en Axios).
