# 👤 Módulo de Perfiles Profesionales (CV Vivo)

Este módulo gestiona toda la información del profesional senior, desde sus datos básicos hasta su historial laboral y educativo.

**Base URL:** `/api/v1/profiles`

---

## 1. Obtener mi Perfil Completo
Muestra toda la información del usuario logueado, incluyendo experiencia, educación, idiomas y habilidades.

*   **URL:** `/me`
*   **Método:** `GET`
*   **Autenticación:** Requerida (`withCredentials: true`).
*   **Respuesta Exitosa (200 OK):** Devuelve el objeto perfil con todos sus "includes".

---

## 2. Actualizar Información Básica
Usa este endpoint para los campos de "Información Personal" y "Preferencias Laborales".

*   **URL:** `/update`
*   **Método:** `PATCH`
*   **Payload (JSON):**
    ```json
    {
      "professionalTitle": "Director de Operaciones",
      "valueProposition": "Liderazgo de equipos senior con enfoque en resultados...",
      "yearsOfExperience": 25,
      "location": "Córdoba, Argentina",
      "linkedinUrl": "https://linkedin.com/in/hernan-casasola",
      "availability": "AVAILABLE",
      "preferredModality": "REMOTE",
      "salaryExpectation": "$1.500.000 - $2.000.000 ARS"
    }
    ```
    *Nota: Todos los campos son opcionales. `availability` admite: `AVAILABLE`, `IN_PROCESS`, `NOT_AVAILABLE`. `preferredModality` admite: `REMOTE`, `ON_SITE`, `HYBRID`.*

---

## 3. Gestión de Experiencia Laboral
*   **Crear:** `POST /experience`
    ```json
    {
      "company": "Tech Global",
      "role": "Senior Manager",
      "startDate": "2010-05-01",
      "endDate": null,
      "description": "Liderazgo de transformación digital..."
    }
    ```
*   **Eliminar:** `DELETE /experience/:id`

---

## 4. Gestión de Idiomas
*   **Crear:** `POST /languages`
    ```json
    {
      "name": "Inglés",
      "level": "C1 - Avanzado"
    }
    ```
*   **Eliminar:** `DELETE /languages/:id`

---

## 5. Gestión de Educación
*   **Crear:** `POST /education`
    ```json
    {
      "institution": "UBA",
      "degree": "Licenciatura en Administración",
      "year": 1995
    }
    ```
*   **Eliminar:** `DELETE /education/:id`

---

## 6. Gestión de Certificaciones
*   **Crear:** `POST /certifications`
    ```json
    {
      "name": "PMP - Project Management Professional",
      "issuer": "PMI",
      "issueDate": "2020-01-15",
      "url": "https://certs.pmi.org/..."
    }
    ```
*   **Eliminar:** `DELETE /certifications/:id`

---

## 💡 Tips para Postman:
1.  **Auth:** Asegurate de haber hecho login antes (`POST /auth/login`). Postman guardará la cookie automáticamente.
2.  **Dates:** Usá formato `YYYY-MM-DD`. El backend las convertirá a Date automáticamente.
3.  **IDs:** Para los `DELETE`, primero hacé un `GET /me` para obtener los IDs de las experiencias o idiomas que quieras borrar.
