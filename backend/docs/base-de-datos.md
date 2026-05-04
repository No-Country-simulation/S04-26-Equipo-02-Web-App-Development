# Flujo de Base de Datos con Prisma

En este proyecto, la base de datos se maneja exclusivamente a través de Prisma.

## Flujo de Trabajo en Equipo

### 1. Cuando alguien sube un cambio en el esquema
Si ves que el archivo `prisma/schema.prisma` cambió después de hacer un `git pull`:

1. Ejecutá `npx prisma generate`: Esto actualiza el cliente de Prisma en tu proyecto para que el autocompletado de TypeScript reconozca las nuevas tablas o campos.
2. Ejecutá `npx prisma migrate dev`: Esto aplicará esos cambios en tu base de datos PostgreSQL local.

### 2. Cuando vos necesitás agregar una tabla o campo
1. Modificá el archivo `prisma/schema.prisma`.
2. Ejecutá `npx prisma migrate dev --name descripcion_del_cambio`.
3. Esto creará una carpeta en `prisma/migrations`. Subí tanto el `schema.prisma` como esa nueva carpeta a Git.

## Visualización de Datos
Para ver qué hay en tu base de datos sin usar herramientas externas, ejecutá:
`npx prisma studio`

Esto abrirá una interfaz web en `http://localhost:5555` donde podés cargar datos de prueba manualmente.
