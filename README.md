# Kubo Anuncios

Marketplace local construido con Next.js, Prisma y NextAuth.

## Desarrollo local

1. Instala dependencias:

```bash
npm install
```

2. Crea `.env.local` usando `.env.example` como guia.

3. Sincroniza la base local:

```bash
npx prisma db push
```

4. Inicia el proyecto:

```bash
npm run dev
```

Abre `http://localhost:3000`.

## Variables necesarias

- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `NEXT_PUBLIC_SITE_URL`
- `DATABASE_URL`

## Rutas importantes

- `/publish`: publicar anuncio
- `/buscar`: busqueda
- `/mis-anuncios`: gestion del vendedor
- `/favoritos`: favoritos
- `/chat`: conversaciones
- `/verificar-identidad`: solicitud de identidad verificada
- `/verificar-empresa`: solicitud de empresa verificada
- `/admin/reports`: reportes
- `/admin/identity-verifications`: revisar identidad
- `/admin/business-verifications`: revisar empresas
- `/privacidad`: politica de privacidad inicial
- `/terminos`: terminos de uso iniciales
- `/seguridad`: consejos de seguridad

## Lanzamiento

Antes de publicar:

- Seguir la guia `docs/FASE_1_DEPLOY.md`.
- Revisar textos legales con asesoria adecuada.
- Migrar de SQLite a una base de produccion si el trafico sera real.
- Configurar almacenamiento persistente para archivos subidos.
- Definir manejo de documentos de identidad/RUT: acceso, retencion y eliminacion.
- Activar pagos reales si se van a cobrar planes premium o destacados.
- Revisar que `NEXTAUTH_URL` y `NEXT_PUBLIC_SITE_URL` apunten al dominio real.
- Confirmar que `.env` y `.env.local` no se suban al repositorio.

## Notas de producto

- Verificacion significa confianza, no visibilidad.
- Premium/destacado significa visibilidad, no verificacion.
- La Home visual esta congelada salvo cambios solicitados explicitamente.
