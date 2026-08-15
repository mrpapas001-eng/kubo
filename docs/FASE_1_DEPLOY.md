# Fase 1 - Web en Vercel + PostgreSQL en Neon

Objetivo: lanzar Kubo como web publica usando Vercel para la app y Neon para la base de datos PostgreSQL.

## Decision tomada

- Web: Vercel
- Base de datos: Neon PostgreSQL
- App movil: despues, con Capacitor o Expo

## Estado actual

Kubo funciona localmente con SQLite:

```txt
DATABASE_URL=file:./dev.db
```

Para produccion se usara PostgreSQL:

```txt
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
```

No cambiar `prisma/schema.prisma` a PostgreSQL hasta tener la URL real de Neon.

## Paso 1 - Crear base en Neon

1. Entrar en `https://neon.com`.
2. Crear cuenta o iniciar sesion.
3. Crear proyecto nuevo.
4. Elegir PostgreSQL.
5. Copiar la connection string.
6. Usar preferiblemente la URL con connection pooling si Neon la muestra.

Guardar esa URL como:

```txt
DATABASE_URL=...
```

No pegar esta URL en archivos que se suben al repositorio.

## Paso 2 - Cambiar Prisma a PostgreSQL

Cuando ya tengamos la URL real, cambiar:

```prisma
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}
```

por:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

Despues ejecutar:

```bash
npx prisma db push
npx prisma generate
npm run build
```

## Paso 3 - Crear proyecto en Vercel

1. Entrar en `https://vercel.com`.
2. Importar el proyecto Kubo desde GitHub.
3. Configurar variables de entorno.
4. Deploy.

Variables necesarias:

```txt
NEXTAUTH_URL=https://TU-DOMINIO.com
NEXTAUTH_SECRET=valor-seguro
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_SITE_URL=https://TU-DOMINIO.com
DATABASE_URL=postgresql://...
```

## Paso 4 - Google Login

En Google Cloud Console hay que agregar:

```txt
https://TU-DOMINIO.com/api/auth/callback/google
```

Tambien mantener para desarrollo:

```txt
http://localhost:3000/api/auth/callback/google
```

## Paso 5 - Archivos subidos

Ahora Kubo guarda imagenes/documentos en:

```txt
public/uploads
```

Eso sirve en local, pero no es suficiente para produccion. En Vercel los archivos subidos asi no son persistentes.

Pendiente despues de fase 1:

- Cloudinary
- S3
- Vercel Blob

Recomendacion inicial: Vercel Blob o Cloudinary.

## Checklist antes de publicar

- `npm run build` pasa sin errores.
- `DATABASE_URL` apunta a Neon.
- `NEXTAUTH_URL` apunta al dominio real.
- Google login tiene callback de produccion.
- Admin probado en `/admin`.
- Publicar anuncio probado en produccion.
- Favoritos, chat, reportes y verificaciones probados.
- Archivos/documentos no se usan con datos reales hasta configurar almacenamiento persistente.
