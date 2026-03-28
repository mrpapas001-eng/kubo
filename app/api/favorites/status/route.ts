import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ ok: true, isFavorite: false });
    }

    const url = new URL(req.url);
    const listingId = url.searchParams.get("listingId");

    if (!listingId) {
      return NextResponse.json(
        { ok: false, error: "listingId requerido" },
        { status: 400 }
      );
    }

    const existing = await prisma.favorite.findUnique({
      where: {
        userEmail_listingId: {
          userEmail: session.user.email,
          listingId,
        },
      },
    });

    return NextResponse.json({ ok: true, isFavorite: Boolean(existing) });
  } catch (error: any) {
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error" },
      { status: 500 }
    );
  }
}