import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

const ADMIN_EMAIL = "mr.papas001@gmail.com";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (email !== ADMIN_EMAIL) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const listingId = String(body.listingId || "");

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing inválido" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return NextResponse.json(
        { error: "Anuncio no encontrado" },
        { status: 404 }
      );
    }

    if (listing.status !== "hidden" || listing.hiddenReason !== "moderation") {
      return NextResponse.json(
        { error: "El anuncio no está ocultado por moderación" },
        { status: 400 }
      );
    }

    await prisma.listing.update({
      where: { id: listingId },
      data: {
        status: "active",
        hiddenReason: null,
        isPremium: false,
        premiumPlan: null,
        premiumUntil: null,
        isFeatured: false,
        featuredUntil: null,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo restaurar el anuncio" },
      { status: 500 }
    );
  }
}