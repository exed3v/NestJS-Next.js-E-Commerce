# Convenciones de Base de Datos

## Relaciones

- Todas las relaciones son bidireccionales
- Usar nombres semánticos en `@relation` cuando hay múltiples relaciones entre mismos modelos
- `onDelete: Cascade` para dependencias fuertes

## Nombres

- Modelos: Singular (User, Product, Order)
- Tablas en DB: Plural vía `@@map("users")`
- Campos: camelCase
- Relaciones: plural para colecciones, singular para uno

## Índices

- Indexar campos de búsqueda frecuente: `userId`, `email`, `slug`
- Usar `@@index()` para mejorar performance

## Timestamps

- Siempre incluir `createdAt` y `updatedAt`
- Usar `@default(now())` y `@updatedAt`

## Soft Delete

- Usar campo `isActive` o `deletedAt` en lugar de borrado físico
