import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();
  const isAdmin = email === "mr.papas001@gmail.com";

  if (!isAdmin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const requestId = String(body.requestId || "");
    const action = String(body.action || "");

    if (!requestId || !["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Solicitud invalida" },
        { status: 400 }
      );
    }

    const request = await prisma.businessVerificationRequest.findUnique({
      where: {
        id: requestId,
      },
    });

    if (!request) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    const nextStatus = action === "approve" ? "approved" : "rejected";

    await prisma.businessVerificationRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: nextStatus,
        reviewedAt: new Date(),
      },
    });

    if (action === "approve") {
      await prisma.listing.updateMany({
        where: {
          ownerEmail: request.ownerEmail,
          businessSlug: request.businessSlug,
          isBusiness: true,
        },
        data: {
          businessVerified: true,
          businessName: request.businessName,
          businessDescription: request.businessDescription,
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo revisar la solicitud" },
      { status: 500 }
    );
  }
}
