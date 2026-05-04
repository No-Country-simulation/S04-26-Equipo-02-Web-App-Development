# Convenciones de API

Para que el equipo de Frontend reciba siempre datos consistentes, respetamos estas reglas.

## Formato de Respuesta
Todas las respuestas de la API deben seguir esta estructura:

```json
// éxito
{
  "success": true,
  "data": { ... },
  "error": null
}

// error
{
  "success": false,
  "data": null,
  "error": "Mensaje descriptivo del error"
}
```

## Códigos de Estado HTTP
- `200 OK`: Petición exitosa.
- `201 Created`: Recurso creado exitosamente (ej: registro).
- `400 Bad Request`: Error de validación del cliente (datos mal enviados).
- `401 Unauthorized`: No hay token o el token expiró.
- `403 Forbidden`: El usuario no tiene permisos para esa acción (ej: un profesional intentando ver el panel de empresa).
- `404 Not Found`: El recurso no existe.
- `500 Internal Server Error`: Error no controlado en el servidor.

## Rutas
- Usamos el prefijo `/api/v1`.
- Los nombres de las rutas se escriben en minúsculas y con guiones (kebab-case): `/auth/refresh-token`, `/profiles/my-skills` (preferible una sola palabra por ruta, ej: `/login`, `/register`, etc).
