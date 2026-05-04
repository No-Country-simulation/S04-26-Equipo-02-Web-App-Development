# Arquitectura del Código

Para que el código de los tres sea consistente y fácil de leer, usamos el patrón de **tres capas** dentro de cada módulo. Esto seria ideal aunque puede variar.

## Estructura de un Módulo

Cada carpeta dentro de `src/modules/` (ej: `auth`, `learning`, `profiles`) debe tener esta estructura:

1. **Routes (`*.routes.ts`):**
   - Su única responsabilidad es definir los endpoints y asignar los middlewares.
   - Llama al Controller. No tiene lógica de negocio.

2. **Controller (`*.controller.ts`):**
   - Recibe la petición (`req`) y devuelve la respuesta (`res`).
   - Valida que los datos de entrada sean correctos (usando Zod).
   - Llama al Service para procesar la información.
   - No toca la base de datos directamente.

3. **Service (`*.service.ts`):**
   - Contiene la lógica de negocio (cálculos, validaciones complejas, condicionales).
   - Es el único lugar donde se usa `prisma`.
   - No sabe nada de Express (no usa `req` ni `res`).

## Por qué lo hacemos así
Si Benja tiene que arreglar un bug en el módulo que hizo Gonza, vas a saber que la lógica está en el **Service** y los endpoints en las **Routes**. Esto evita que nos pisemos y facilita las pruebas.
