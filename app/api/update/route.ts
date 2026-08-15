import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    const sessionEmail = session?.user?.email?.toLowerCase().trim();

    if (!sessionEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const id = String(body?.id ?? "").trim();

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID requerido." },
        { status: 400 }
      );
    }

    const existing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Anuncio no encontrado." },
        { status: 404 }
      );
    }

    const ownerEmail = String(existing.ownerEmail ?? "")
      .toLowerCase()
      .trim();

    if (!ownerEmail || ownerEmail !== sessionEmail) {
      return NextResponse.json(
        { ok: false, error: "No tienes permiso para editar este anuncio." },
        { status: 403 }
      );
    }

    if (existing.status === "deleted") {
      return NextResponse.json(
        { ok: false, error: "No puedes editar un anuncio eliminado." },
        { status: 400 }
      );
    }

    const title = String(body?.title ?? "").trim();
    const description = String(body?.description ?? "").trim();
    const phone = String(body?.phone ?? "").replace(/\D/g, "").slice(0, 10);
    const city = String(body?.city ?? "Pereira").trim();

    const rawPrice = String(body?.price ?? "").replace(/\D/g, "");
    const price = rawPrice ? Number(rawPrice) : null;

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "El título es obligatorio." },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { ok: false, error: "La descripción es obligatoria." },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 7) {
      return NextResponse.json(
        { ok: false, error: "El teléfono no es válido." },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        { ok: false, error: "La ciudad es obligatoria." },
        { status: 400 }
      );
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: {
        title,
        description,
        price,
        phone,
        city,
      },
    });

    return NextResponse.json({
      ok: true,
      listing: updated,
    });
  } catch (error: any) {
    console.error("POST /api/listings/update error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Error actualizando anuncio.",
      },
      { status: 500 }
    );
  }
}
