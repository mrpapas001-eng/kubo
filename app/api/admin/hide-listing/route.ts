import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

const email = session?.user?.email?.toLowerCase().trim();

const isAdmin = email === "mr.papas001@gmail.com";

if (!isAdmin) {
  return NextResponse.json(
    { error: "No autorizado" },
    { status: 401 }
  );
}
  try {
    const body = await req.json();

    const listingId = String(body.listingId || "");

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing inválido" },
        { status: 400 }
      );
    }

    await prisma.listing.update({
      where: {
        id: listingId,
      },
      data: {
        status: "hidden",
        hiddenReason: "moderation",
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