# Validaciones con Zod

Zod es una librería que nos permite validar los datos que llegan desde el exterior (Frontend o APIs externas) en tiempo de ejecución.

## Por qué lo necesitamos
TypeScript solo nos protege mientras escribimos código (tiempo de compilación). Una vez que la aplicación está corriendo, TypeScript no puede evitar que un usuario envíe un texto donde esperábamos un número. 

Zod actúa como un "filtro" en la entrada de nuestros controladores para asegurar que solo pasen datos válidos.


## Ejemplo real: Qué podría pasar sin Zod
Imaginá que en el registro de un profesional, el Frontend olvida validar el email o alguien hace una petición directamente a la API con un email vacío.

1. **Sin Zod:** El usuario manda un email vacío o mal formado. El backend lo recibe, intenta guardarlo en la base de datos y **PostgreSQL tira un error de base de datos**. El servidor podría caerse o devolver un error 500 confuso al usuario.
2. **Con Zod:** Antes de tocar la base de datos, Zod detecta que el email no es válido y devuelve un **Error 400 (Bad Request)** detallado. 

Esto mantiene nuestra base de datos limpia y nuestro servidor estable.



## Cómo se implementa
Definimos un esquema que describe cómo deben ser los datos:

```typescript
import { z } from 'zod';

// definimos el contrato
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['PROFESSIONAL', 'COMPANY'])
});

// en el controlador lo usamos así:
const validatedData = registerSchema.parse(req.body);
```


## Este pedazo de chad explica muy bien el tema de validaciones con zod y en 15 minutos. Les recomiendo que lo vean. Está en ingles pero pueden cambiar la pista a español.
- https://youtu.be/ZPa9I_pvRU0