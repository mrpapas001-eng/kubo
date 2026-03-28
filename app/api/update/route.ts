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

    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { ok: false, error: "ID requerido" },
        { status: 400 }
      );
    }

    const updated = await prisma.listing.update({
      where: { id: String(body.id) },
      data: {
        title: String(body.title ?? ""),
        description: String(body.description ?? ""),
        price: Number(body.price ?? 0),
        phone: String(body.phone ?? ""),
        city: String(body.city ?? "Pereira"),
      },
    });

    return NextResponse.json({ ok: true, listing: updated });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error actualizando anuncio" },
      { status: 500 }
    );
  }
}