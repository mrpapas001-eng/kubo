import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const reporterEmail = session?.user?.email?.toLowerCase().trim() ?? null;

    const body = await req.json();

    const listingId = String(body.listingId || "");
    const reason = String(body.reason || "");
    const details = String(body.details || "");

    if (!listingId || !reason) {
      return NextResponse.json(
        { error: "Datos inválidos" },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!listing || listing.status !== "active") {
      return NextResponse.json(
        { error: "Anuncio no disponible" },
        { status: 404 }
      );
    }

    await prisma.listingReport.create({
      data: {
        listingId,
        reason,
        details,
        reporterEmail,
      },
    });

    await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        reportedCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Error interno" },
      { status: 500 }
    );
  }
}
