import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const ALLOWED_TYPES = new Set(["WHATSAPP_CLICK", "PHONE_CLICK"]);

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const type = String(body?.type ?? "");

    if (!id || !ALLOWED_TYPES.has(type)) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const listing = await prisma.listing.findFirst({
      where: {
        id,
        status: "active",
      },
      select: {
        id: true,
        businessId: true,
      },
    });

    if (!listing) {
      return NextResponse.json({ error: "Anuncio no encontrado" }, { status: 404 });
    }

    await prisma.listingAnalyticsEvent.create({
      data: {
        type: type as "WHATSAPP_CLICK" | "PHONE_CLICK",
        listingId: listing.id,
        businessId: listing.businessId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error registrando métrica:", error);
    return NextResponse.json({ error: "No se pudo registrar" }, { status: 500 });
  }
}
