import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const ownerEmail = session?.user?.email?.toLowerCase().trim() ?? null;

    if (!ownerEmail) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    // Solicitud activa (si existe) + historial reciente. Nunca exponer adminNotes.
    const requests = await prisma.aidRequest.findMany({
      where: { ownerEmail },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        description: true,
        contextImageUrl: true,
        status: true,
        isActive: true,
        rejectionReason: true,
        createdAt: true,
        reviewedAt: true,
        completedAt: true,
      },
    });

    const active = requests.find((r) => r.isActive === true) ?? null;

    return NextResponse.json({ ok: true, active, requests });
  } catch (error) {
    console.error("GET /api/aid-requests/mine error:", error);
    return NextResponse.json(
      { ok: false, error: "Error cargando tus solicitudes." },
      { status: 500 }
    );
  }
}
