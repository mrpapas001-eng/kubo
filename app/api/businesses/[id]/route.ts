import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const cleanId = String(id ?? "").trim();

    if (!cleanId) {
      return NextResponse.json(
        { ok: false, error: "ID de empresa requerido." },
        { status: 400 }
      );
    }

    const business = await prisma.business.findFirst({
      where: {
        id: cleanId,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        logo: true,
        businessType: true,
        isVerified: true,
      },
    });

    if (!business) {
      return NextResponse.json(
        { ok: false, error: "Empresa no encontrada o inactiva." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      business,
    });
  } catch (error: any) {
    console.error("GET /api/businesses/[id] error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Error cargando la empresa.",
      },
      { status: 500 }
    );
  }
}
