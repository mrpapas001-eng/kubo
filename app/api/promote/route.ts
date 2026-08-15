import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email?.toLowerCase().trim() ?? null;

    if (!userEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const id = String(formData.get("id") ?? "");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID no recibido" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      return NextResponse.json(
        { ok: false, error: "Anuncio no encontrado" },
        { status: 404 }
      );
    }

    const ownerEmail = listing.ownerEmail?.toLowerCase().trim();

    if (!ownerEmail || ownerEmail !== userEmail) {
      return NextResponse.json(
        { ok: false, error: "No puedes promocionar este anuncio." },
        { status: 403 }
      );
    }

    if (listing.status !== "active") {
      return NextResponse.json(
        { ok: false, error: "Solo puedes promocionar anuncios activos." },
        { status: 400 }
      );
    }

    const now = new Date();

    const premiumDays = 7;
    const premiumUntil = new Date(
      now.getTime() + premiumDays * 24 * 60 * 60 * 1000
    );

    await prisma.listing.update({
      where: { id },
      data: {
        isPremium: true,
        premiumUntil,
      },
    });

    return NextResponse.redirect(new URL(`/listing/${id}`, req.url));
  } catch (error: any) {
    console.error("PROMOTE ERROR:", error);

    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error promocionando anuncio" },
      { status: 500 }
    );
  }
}
