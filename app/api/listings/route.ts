// app/api/listings/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const take = Number(url.searchParams.get("take") ?? 12);
  const skip = Number(url.searchParams.get("skip") ?? 0);
  const city = (url.searchParams.get("city") ?? "").trim();

  let items: any[] = [];
  let total = 0;
  let fallbackUsed = false;

  if (city) {
    items = await prisma.listing.findMany({
      where: { city },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take,
      skip,
    });

    total = await prisma.listing.count({
      where: { city },
    });
  }

  if (!city || items.length === 0) {
    fallbackUsed = true;

    items = await prisma.listing.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take,
      skip,
    });

    total = await prisma.listing.count();
  }

  const nextSkip = skip + items.length;
  const hasMore = nextSkip < total;

  return NextResponse.json({
    items,
    nextSkip,
    hasMore,
    fallbackUsed,
  });
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión para publicar" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const incomingDetails =
      typeof body.details === "object" && body.details !== null ? body.details : {};

    const details = {
      ...incomingDetails,
      ownerEmail: session.user.email,
      ownerName: session.user.name ?? null,
      ownerImage: session.user.image ?? null,
    };

    const listing = await prisma.listing.create({
      data: {
        title: String(body.title ?? ""),
        description: String(body.description ?? ""),
        phone: String(body.phone ?? ""),
        price: Number(body.price ?? 0),
        currency: String(body.currency ?? "COP"),
        city: String(body.city ?? "Madrid, Cundinamarca"),
        categorySlug: String(body.categorySlug ?? "general"),
        subcategorySlug: String(body.subcategorySlug ?? "general"),
        template: String(body.template ?? "GENERAL"),
        sellerType: String(body.sellerType ?? "PARTICULAR"),
        isVerified: Boolean(body.isVerified ?? false),
        imageUrl: body.imageUrl ? String(body.imageUrl) : null,
        details,
      },
    });

    return NextResponse.json({ ok: true, listing });
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: e?.message ?? "Error creando listing" },
      { status: 400 }
    );
  }
}