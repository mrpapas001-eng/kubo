import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID requerido" },
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

    return NextResponse.json({ ok: true, listing });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error cargando anuncio" },
      { status: 500 }
    );
  }
}