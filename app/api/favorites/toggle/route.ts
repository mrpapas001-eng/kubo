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

    const userEmail = session.user.email.toLowerCase().trim();

    const body = await req.json();
    const listingId = String(body.listingId ?? "");

    if (!listingId) {
      return NextResponse.json(
        { ok: false, error: "listingId requerido" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { status: true },
    });

    if (!listing || listing.status !== "active") {
      return NextResponse.json(
        { ok: false, error: "Anuncio no disponible" },
        { status: 404 }
      );
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userEmail_listingId: {
          userEmail,
          listingId,
        },
      },
    });

    if (existing) {
      await prisma.favorite.delete({
        where: {
          userEmail_listingId: {
            userEmail,
            listingId,
          },
        },
      });

      return NextResponse.json({ ok: true, isFavorite: false });
    }

    await prisma.favorite.create({
      data: {
        userEmail,
        listingId,
      },
    });

    return NextResponse.json({ ok: true, isFavorite: true });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error" },
      { status: 500 }
    );
  }
}
