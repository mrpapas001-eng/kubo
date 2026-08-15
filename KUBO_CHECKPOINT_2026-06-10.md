# Kubo checkpoint - 2026-06-10

Este archivo resume el estado actual para retomar el trabajo si el chat se reinicia.

## Estado general

Kubo ya esta en fase de producto funcional con pulido movil. No tocar la Home visual salvo una tarea muy concreta.

La Home actual debe conservar:

- Header
- HomeHero
- HomeCategories
- HomeFeaturedSection
- ReelsSection
- Footer

Evitar volver a meter:

- segundo buscador debajo del hero
- bloque grande de pre-lanzamiento
- chips rapidos duplicados en HomeHero
- filtros gigantes visibles en movil

## Cambios recientes hechos con Codex

### Mobile bottom nav

Archivo nuevo:

- `components/MobileBottomNav.tsx`

Montada globalmente en:

- `app/layout.tsx`

Rutas:

- Inicio -> `/`
- Buscar -> `/buscar`
- Publicar -> `/publish`
- Chats -> `/chat`
- Perfil -> `/mi-cuenta`

Notas:

- Se oculta en `/chat` y `/chat/[id]` para no tapar el input del chat.
- En escritorio queda oculta con `md:hidden`.

### Detalle de anuncio

Archivo:

- `app/listing/[id]/page.tsx`

Hecho:

- usuarios normales no ven anuncios `hidden` o `deleted`
- similares filtran `status: "active"`
- CTA movil fijo con WhatsApp, Chat interno y Compartir
- bloques de promocion solo se muestran al dueno del anuncio
- se agrego boton Guardar visible usando `FavoriteButton` variante inline

Archivo nuevo:

- `components/MobileListingActions.tsx`

### Favoritos

Archivo:

- `app/favoritos/page.tsx`

Hecho:

- solo muestra anuncios `status: "active"`
- estado vacio mas claro
- boton `Buscar anuncios`
- subtitulo bajo el titulo

Nota:

- Textos nuevos se dejaron sin acentos por problemas previos de encoding.

### Mis anuncios

Archivo:

- `app/mis-anuncios/page.tsx`

Hecho:

- anuncios eliminados se ven apagados
- anuncios eliminados no muestran acciones
- ocultos solo dejan reactivar
- activos mantienen promocionar, editar y eliminar

Validado por usuario:

- publicar funciona
- detalle abre
- editar funciona
- promocionar funciona
- eliminar funciona
- eliminado queda gris y sin acciones

### Publicar anuncio

Archivo:

- `app/publish/page.tsx`

Hecho:

- progreso compacto en movil
- panel lateral de pasos solo escritorio
- botones inferiores mas comodos en movil
- mas espacio inferior para bottom nav
- subida de fotos mas clara
- publicar como empresa ya existe

Validado por usuario:

- pasos 1, 2, 3 y 4 se ven bien en movil
- publicacion real creada correctamente

### Buscar

Archivo:

- `app/buscar/page.tsx`

Hecho:

- solo muestra anuncios `status: "active"`
- mas espacio inferior movil
- en movil se oculto boton Inicio porque ya existe en bottom nav
- hero de buscar mas compacto en movil

### Mi cuenta

Archivo:

- `app/mi-cuenta/page.tsx`

Hecho:

- ahora es centro de usuario
- boton destacado Publicar anuncio
- accesos a Mis anuncios, Favoritos, Chats e Inicio
- bloque Datos de cuenta

### Editar anuncio

Archivos:

- `app/listing/[id]/edit/page.tsx`
- `app/api/listings/[id]/route.ts`

Hecho:

- API PUT bloquea editar anuncios `deleted`
- pagina de editar detecta `deleted` y muestra error
- pantalla de editar tiene subtitulo
- botones mejorados en movil
- DELETE ahora valida dueno antes de marcar `status: "deleted"`

### Admin reportes

Archivos:

- `app/admin/reports/page.tsx`
- `components/AdminReportActions.tsx`

Hecho:

- contadores Total, Pendientes y Resueltos
- badge de estado con color
- Resolver se oculta si el reporte ya esta `resolved`
- si el anuncio esta `deleted`, aparece badge `Anuncio eliminado`
- si el anuncio esta `deleted`, se ocultan Ocultar y Eliminar

### Empresas

Archivos:

- `app/company/[slug]/page.tsx`
- `app/listing/[id]/page.tsx`
- `app/verificar-empresa/page.tsx`
- `app/verificar-identidad/page.tsx`
- `app/admin/business-verifications/page.tsx`
- `app/admin/identity-verifications/page.tsx`
- `app/api/business-verification/route.ts`
- `app/api/identity-verification/route.ts`
- `app/api/admin/business-verification/route.ts`
- `app/api/admin/identity-verification/route.ts`
- `components/AdminBusinessVerificationActions.tsx`
- `components/AdminIdentityVerificationActions.tsx`
- `prisma/schema.prisma`

Hecho:

- perfil publico de empresa pulido para movil y escritorio
- textos rotos por encoding corregidos en la pagina de empresa
- el perfil de empresa ya puede abrir aunque la empresa aun no este verificada
- si la empresa no esta verificada, se muestra como `Empresa en Kubo` o `Empresa`
- el detalle de anuncio enlaza al perfil de empresa si existe `businessSlug`
- el detalle ya no fuerza el texto `Empresa verificada` para empresas pendientes
- se agrego flujo para verificar empresa con RUT
- usuario puede solicitar verificacion desde `/verificar-empresa`
- se agrego acceso `Verificar empresa` en `/mi-cuenta`
- admin puede revisar solicitudes en `/admin/business-verifications`
- admin puede aprobar o rechazar solicitudes
- al aprobar, los anuncios de esa empresa y correo quedan con `businessVerified: true`
- al publicar nuevos anuncios, si ya hay solicitud aprobada, salen como empresa verificada automaticamente
- verificacion queda separada de premium/destacado
- se agrego flujo de identidad verificada para vendedores particulares
- usuario puede solicitar verificacion de identidad desde `/verificar-identidad`
- se agrego acceso `Verificar identidad` en `/mi-cuenta`
- admin puede revisar identidades en `/admin/identity-verifications`
- al aprobar identidad, los anuncios de ese correo quedan con `isVerified: true`
- al publicar nuevos anuncios, si ya tiene identidad aprobada, salen como `Identidad verificada`
- tarjetas y detalle muestran sellos separados: `Particular`, `Identidad verificada`, `Empresa`, `Empresa verificada`, `Destacado`, `Premium`
- paso 1 probado con datos temporales: empresa aprobada con RUT, identidad aprobada, anuncio de empresa verificada y anuncio particular con identidad verificada
- despues de la prueba se limpiaron los datos temporales y TypeScript paso sin errores
- paso 2 hecho: tarjetas y detalle separan visualmente confianza del vendedor y visibilidad del anuncio
- en tarjetas se muestra el sello principal y una frase corta: RUT revisado, identidad revisada, empresa sin verificar o vendedor particular
- en detalle se agregaron dos bloques claros: `Confianza del vendedor` y `Visibilidad del anuncio`
- el detalle explica que premium/destacado es visibilidad, no verificacion
- paso 3 hecho: limpieza de textos rotos por encoding en `app`, `components` y `lib`
- se corrigieron textos visibles en publicar, admin, upload y otros archivos afectados
- busqueda final de caracteres rotos (`Ã`, `Â`, `â`, `ð`, `�`) sin resultados
- TypeScript paso sin errores despues de la limpieza
- paso 4 hecho: seguridad y permisos revisados en APIs principales
- crear anuncio ahora usa el correo real de la sesion, no el `ownerEmail` enviado desde el navegador
- subir archivos ahora requiere sesion
- promocionar, premium y destacado requieren sesion, dueno y anuncio activo
- favoritos usan correo normalizado de sesion y solo aceptan anuncios activos
- reportes ya no confian en `reporterEmail` enviado desde navegador y validan anuncio activo
- chat no permite iniciar conversacion con anuncio oculto/eliminado ni con anuncio propio
- API de detalle no expone anuncios ocultos/eliminados a usuarios que no sean dueno o admin
- `listings-by-ids` solo devuelve anuncios activos
- ruta suelta `/api/update` bloquea editar anuncios eliminados
- rutas admin verificadas con control de admin
- TypeScript paso sin errores despues de los ajustes de seguridad
- paso 5 hecho: preparacion de lanzamiento inicial
- se agrego `.env.example` sin secretos
- se agregaron paginas base: `/privacidad`, `/terminos`, `/seguridad`
- README reemplazado por instrucciones reales de Kubo y checklist de lanzamiento
- `next.config.ts` actualizado de `images.domains` a `images.remotePatterns`
- se quitaron logs de depuracion de sponsors
- validaciones finales: TypeScript sin errores, sin logs de depuracion, sin caracteres rotos y `npm run build` exitoso
- extra premium: detalle de anuncio premium ahora tiene borde animado, glow, destello sobre imagen, ribbon premium con brillo, badge animado y precio con gradiente
- build de produccion paso despues del pulido premium
- admin central agregado en `/admin`
- `/admin` muestra metricas de anuncios, activos, ocultos, eliminados, premium, destacados, chats y visitas
- `/admin` muestra tareas pendientes de reportes, identidades y empresas
- reportes, identidades y empresas ahora tienen enlace de vuelta al panel admin
- build de produccion paso despues del panel admin central
- fase 1 iniciada: decision de deploy = Vercel para web + Neon PostgreSQL para base
- guia creada en `docs/FASE_1_DEPLOY.md`
- `.env.example` actualizado con ejemplo de `DATABASE_URL` para Neon
- README actualizado para apuntar a la guia de fase 1
- Prisma sigue en SQLite local hasta tener la URL real de Neon
- siguiente accion: crear proyecto en Neon y pegar la `DATABASE_URL` para cambiar Prisma a PostgreSQL

Nota:

- al revisar la base no habia anuncios activos publicados como empresa
- siguiente paso: decidir deploy real, base de datos de produccion, almacenamiento de archivos y pagos reales

### FavoriteButton

Archivo:

- `components/FavoriteButton.tsx`

Hecho:

- variante default `floating` para cards
- variante `inline` para detalle de anuncio

### TypeScript

Validacion ejecutada varias veces:

```bash
npx.cmd tsc --noEmit
```

Ultimo estado conocido: sin errores.

## Cosas importantes que no tocar sin motivo

- `components/ListingCard.tsx`
- `components/HomeHero.tsx`
- `components/HomeCategories.tsx`
- `components/Footer.tsx`
- `app/page.tsx` salvo ajustes muy concretos
- chat, salvo bug claro
- company page, salvo pulido/revision de empresa

## Pendientes principales

### Empresas

Siguiente bloque recomendado:

- publicar un anuncio como Empresa
- abrir el perfil desde el enlace del vendedor en el detalle
- revisar `/company/[slug]` en movil
- revisar perfil empresa visualmente

Futuro:

- editar perfil empresa
- subir logo real
- portada/cover
- verificacion desde admin

### Limpieza final

- corregir textos con encoding roto: `AÃºn`, `TelÃ©fono`, `DescripciÃ³n`, etc.
- revisar estados vacios
- revisar responsive final
- auditoria de permisos
- revisar deploy y variables de entorno

### Pagos

- el flujo premium/promocionar existe
- falta integrar pagos reales si se va a cobrar

## Estimacion

- beta privada usable: 1 a 3 dias de trabajo adicional
- primera version lanzable sin pagos reales: 3 a 7 dias
- version con pagos, empresas mejoradas y deploy serio: 1 a 3 semanas

## Recomendacion al retomar

Empezar por Empresas:

1. Publicar anuncio como Empresa.
2. Abrir el perfil `/company/[slug]`.
3. Revisar movil.
4. Pulir perfil empresa.
5. Despues hacer limpieza de textos/encoding.
