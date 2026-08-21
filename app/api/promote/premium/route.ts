import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { claimLaunchPromotion } from "@/lib/launchPromotion";

const messages: Record<string, string> = {
  CAMPAIGN_INACTIVE: "La promoción gratuita de lanzamiento no está activa.",
  NOT_FOUND: "Anuncio no encontrado.",
  FORBIDDEN: "No puedes promocionar este anuncio.",
  BUSINESS_ONLY: "La promoción de lanzamiento está disponible para anuncios de empresa.",
  NOT_ACTIVE: "Solo puedes promocionar anuncios activos.",
  NOT_TODAY: "Los cupos gratuitos son solo para anuncios publicados hoy.",
  ALREADY_PROMOTED: "Este anuncio ya tiene una promoción activa.",
  USER_DAILY_LIMIT: "Ya utilizaste tu promoción gratuita de hoy.",
  SOLD_OUT: "Los 5 cupos Premium de hoy ya se agotaron. Mañana habrá nuevos cupos para anuncios nuevos.",
};

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const listingId = searchParams.get("listingId");
  if (!listingId) {
    return NextResponse.json({ error: "Falta listingId" }, { status: 400 });
  }

  try {
    await claimLaunchPromotion(
      listingId,
      session.user.email.toLowerCase().trim(),
      "premium"
    );
    return NextResponse.redirect(new URL(`/listing/${listingId}`, request.url));
  } catch (error) {
    const code = error instanceof Error ? error.message : "UNKNOWN";
    const message = messages[code] ?? "No se pudo activar Premium.";
    const status = code === "NOT_FOUND" ? 404 : code === "FORBIDDEN" ? 403 : code === "SOLD_OUT" ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
