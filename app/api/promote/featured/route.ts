import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

function getValidDays(value: string | null) {
  const days = Number(value);

  if ([7, 15, 30].includes(days)) {
    return days;
  }

  return 7;
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const userEmail = session.user.email.toLowerCase().trim();

  const { searchParams } = new URL(request.url);

  const listingId = searchParams.get("listingId");
  const days = getValidDays(searchParams.get("days"));

  if (!listingId) {
    return NextResponse.json({ error: "Falta listingId" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing) {
    return NextResponse.json(
      { error: "Anuncio no encontrado" },
      { status: 404 }
    );
  }

  const ownerEmail = listing.ownerEmail?.toLowerCase().trim();

  if (ownerEmail !== userEmail) {
    return NextResponse.json(
      { error: "No puedes destacar este anuncio" },
      { status: 403 }
    );
  }

  if (listing.status !== "active") {
    return NextResponse.json(
      { error: "Solo puedes destacar anuncios activos" },
      { status: 400 }
    );
  }

  const featuredUntil = new Date();
  featuredUntil.setDate(featuredUntil.getDate() + days);

  await prisma.listing.update({
    where: { id: listingId },
    data: {
      isFeatured: true,
      isPremium: false,
      featuredUntil,
      premiumPlan: null,
      premiumUntil: null,
    },
  });

  return NextResponse.redirect(new URL(`/listing/${listingId}`, request.url));
}
