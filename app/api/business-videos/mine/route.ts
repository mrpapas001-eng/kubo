import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email?.toLowerCase().trim();

    if (!sessionEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedBusinessId = searchParams.get("businessId")?.trim();

    // Solo se permite consultar empresas que realmente pertenecen a la
    // sesión actual; nunca se confía en un businessId ajeno.
    const businesses = await prisma.business.findMany({
      where: {
        ownerEmail: { equals: sessionEmail, mode: "insensitive" },
        isActive: true,
        ...(requestedBusinessId ? { id: requestedBusinessId } : {}),
      },
      select: {
        id: true,
        name: true,
        logo: true,
        isVerified: true,
        video: {
          select: {
            id: true,
            videoUrl: true,
            thumbnailUrl: true,
            description: true,
            categorySlug: true,
            city: true,
            durationSeconds: true,
            status: true,
            adminNote: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (requestedBusinessId && businesses.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No tienes permiso sobre esta empresa o no existe." },
        { status: 403 }
      );
    }

    return NextResponse.json({ ok: true, businesses });
  } catch (error) {
    console.error("GET /api/business-videos/mine error:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo cargar la información." },
      { status: 500 }
    );
  }
}
