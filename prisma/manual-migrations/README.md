# Migraciones manuales

Los archivos de esta carpeta son registros de cambios SQL aplicados manualmente
a la base de datos PostgreSQL/Neon (por ejemplo, con `prisma db execute`).

- No son ejecutados automáticamente por `prisma migrate deploy`.
- No deben repetirse en producción.
- El historial oficial de Prisma (`prisma/migrations/`) actualmente pertenece a
  SQLite y está bloqueado por el error P3019; debe repararse mediante un
  baseline PostgreSQL en una tarea futura separada.
