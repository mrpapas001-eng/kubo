import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión" },
        { status: 401 }
      );
    }

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

    let details: any = listing.details;

    if (typeof details === "string") {
      details = JSON.parse(details);
    }

    if (details?.ownerEmail !== session.user.email) {
      return NextResponse.json(
        { ok: false, error: "No autorizado" },
        { status: 403 }
      );
    }

    await prisma.listing.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }
}