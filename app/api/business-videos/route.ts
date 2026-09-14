import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { CATEGORIES } from "@/data/categories";

const MAX_DESCRIPTION_LENGTH = 300;
const MAX_TEXT_FIELD_LENGTH = 120;
const MIN_DURATION_SECONDS = 15;
const MAX_DURATION_SECONDS = 60;
const MAX_TAKE = 50;
const DEFAULT_TAKE = 20;

// Catálogo real usado por /categoria y el panel de sponsors (@/data/categories).
// Nota: app/api/listings/route.ts mantiene su propio PUBLISH_CATEGORIES (no
// exportado) con un subconjunto distinto de slugs para lo que se puede vender.
// Para "Videos de empresas" validamos contra @/data/categories por ser la
// única fuente de categorías exportada y reutilizada en el resto del proyecto.
const VALID_CATEGORY_SLUGS = new Set(CATEGORIES.map((category) => category.slug));

// Vercel Blob no expone un identificador de "store" verificable en el propio
// código sin leer BLOB_READ_WRITE_TOKEN (prohibido por política de secretos).
// Esta allowlist de hostname solo confirma que la URL pertenece a la red de
// Vercel Blob en general, no que provenga exclusivamente del store de este
// proyecto. Por eso todo registro queda en PENDING con revisión administrativa
// obligatoria antes de publicarse (ver POST más abajo).
const ALLOWED_BLOB_HOSTNAMES = [
  /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i,
  /^[a-z0-9-]+\.blob\.vercel-storage\.com$/i,
];

function isAllowedBlobUrl(rawValue: string): boolean {
  const value = String(rawValue ?? "").trim();
  if (!value) return false;

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (url.protocol !== "https:") return false;
  if (url.username || url.password) return false;

  return ALLOWED_BLOB_HOSTNAMES.some((pattern) => pattern.test(url.hostname));
}

// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_PATTERN = /[\x00-\x1f\x7f]/;

function sanitizeCity(rawValue: string): string | null {
  const value = String(rawValue ?? "").trim();
  if (!value || value.length > MAX_TEXT_FIELD_LENGTH) return null;
  // Las ciudades son texto libre en todo el proyecto (Listing.city admite
  // "Otra" + texto manual), así que no se valida contra una lista cerrada;
  // solo se sanea longitud y caracteres de control.
  if (CONTROL_CHARS_PATTERN.test(value)) return null;
  return value;
}

function parsePagination(searchParams: URLSearchParams) {
  const rawTake = Number(searchParams.get("take"));
  const rawSkip = Number(searchParams.get("skip"));

  const take =
    Number.isFinite(rawTake) && rawTake > 0
      ? Math.min(Math.trunc(rawTake), MAX_TAKE)
      : DEFAULT_TAKE;

  const skip = Number.isFinite(rawSkip) && rawSkip > 0 ? Math.trunc(rawSkip) : 0;

  return { take, skip };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const city = searchParams.get("city")?.trim();
    const categorySlug = searchParams.get("categorySlug")?.trim();
    const { take, skip } = parsePagination(searchParams);

    const videos = await prisma.businessVideo.findMany({
      where: {
        status: "APPROVED",
        ...(city ? { city } : {}),
        ...(categorySlug ? { categorySlug } : {}),
      },
      orderBy: [{ approvedAt: "desc" }, { createdAt: "desc" }],
      take,
      skip,
      select: {
        id: true,
        videoUrl: true,
        thumbnailUrl: true,
        description: true,
        categorySlug: true,
        city: true,
        durationSeconds: true,
        approvedAt: true,
        createdAt: true,
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            businessType: true,
            city: true,
            whatsapp: true,
            phone: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, videos });
  } catch (error) {
    console.error("GET /api/business-videos error:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron cargar los videos." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email?.toLowerCase().trim();

    if (!sessionEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => null);

    const requestedBusinessId = String(body?.businessId ?? "").trim();

    if (!requestedBusinessId) {
      return NextResponse.json(
        { ok: false, error: "businessId es obligatorio." },
        { status: 400 }
      );
    }

    // Se busca la empresa exacta solicitada y se confirma su propiedad con el
    // mismo criterio usado en app/api/listings/route.ts (ownerEmail
    // insensible a mayúsculas). Un usuario con varias empresas debe poder
    // elegir cuál promociona; nunca se asume la "primera" empresa del correo.
    const business = await prisma.business.findFirst({
      where: {
        id: requestedBusinessId,
        ownerEmail: {
          equals: sessionEmail,
          mode: "insensitive",
        },
        isActive: true,
      },
      select: {
        id: true,
        isVerified: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { ok: false, error: "No tienes permiso sobre esta empresa o no existe." },
        { status: 403 }
      );
    }

    if (!business.isVerified) {
      return NextResponse.json(
        { ok: false, error: "Tu empresa debe estar verificada para publicar un video." },
        { status: 403 }
      );
    }

    const description = String(body?.description ?? "").trim();
    const categorySlug = String(body?.categorySlug ?? "").trim();
    const city = sanitizeCity(body?.city);
    const videoUrl = String(body?.videoUrl ?? "").trim();
    const thumbnailUrlRaw = body?.thumbnailUrl;
    const durationSeconds = Number(body?.durationSeconds);

    if (!description || description.length > MAX_DESCRIPTION_LENGTH) {
      return NextResponse.json(
        {
          ok: false,
          error: `La descripción es obligatoria y debe tener máximo ${MAX_DESCRIPTION_LENGTH} caracteres.`,
        },
        { status: 400 }
      );
    }

    if (!categorySlug || !VALID_CATEGORY_SLUGS.has(categorySlug)) {
      return NextResponse.json(
        { ok: false, error: "La categoría no es válida." },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        { ok: false, error: "La ciudad es obligatoria." },
        { status: 400 }
      );
    }

    // durationSeconds viene del cliente y no puede verificarse aquí contra el
    // archivo real; es solo una validación preliminar de rango. La duración
    // real debe comprobarse en la interfaz antes de subir (metadata del
    // <video>) y quedará sujeta a revisión administrativa obligatoria.
    if (
      !Number.isFinite(durationSeconds) ||
      durationSeconds < MIN_DURATION_SECONDS ||
      durationSeconds > MAX_DURATION_SECONDS
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: `La duración debe estar entre ${MIN_DURATION_SECONDS} y ${MAX_DURATION_SECONDS} segundos.`,
        },
        { status: 400 }
      );
    }

    if (!videoUrl || !isAllowedBlobUrl(videoUrl)) {
      return NextResponse.json(
        { ok: false, error: "El video debe provenir del almacenamiento permitido." },
        { status: 400 }
      );
    }

    let thumbnailUrl: string | null = null;
    if (thumbnailUrlRaw !== undefined && thumbnailUrlRaw !== null && String(thumbnailUrlRaw).trim()) {
      const candidate = String(thumbnailUrlRaw).trim();
      if (!isAllowedBlobUrl(candidate)) {
        return NextResponse.json(
          { ok: false, error: "La miniatura debe provenir del almacenamiento permitido." },
          { status: 400 }
        );
      }
      thumbnailUrl = candidate;
    }

    // upsert evita condiciones de carrera si la empresa reenvía la solicitud
    // dos veces casi al mismo tiempo; el registro es único por businessId.
    const video = await prisma.businessVideo.upsert({
      where: { businessId: business.id },
      create: {
        businessId: business.id,
        videoUrl,
        thumbnailUrl,
        description,
        categorySlug,
        city,
        durationSeconds: Math.trunc(durationSeconds),
        status: "PENDING",
      },
      update: {
        videoUrl,
        thumbnailUrl,
        description,
        categorySlug,
        city,
        durationSeconds: Math.trunc(durationSeconds),
        status: "PENDING",
        adminNote: null,
        approvedAt: null,
        rejectedAt: null,
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ ok: true, video });
  } catch (error) {
    console.error("POST /api/business-videos error:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo guardar el video." },
      { status: 500 }
    );
  }
}
