import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    const ownerEmail = session?.user?.email?.toLowerCase().trim() ?? null;

    if (!ownerEmail) {
      return NextResponse.json(
        { ok: false, error: "No autenticado" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const action = String(body?.action ?? "");

    if (!["cancel", "complete"].includes(action)) {
      return NextResponse.json(
        { ok: false, error: "Acción inválida." },
        { status: 400 }
      );
    }

    const aidRequest = await prisma.aidRequest.findUnique({
      where: { id },
      select: { id: true, ownerEmail: true, status: true },
    });

    if (!aidRequest || aidRequest.ownerEmail !== ownerEmail) {
      return NextResponse.json(
        { ok: false, error: "Solicitud no encontrada." },
        { status: 404 }
      );
    }

    if (action === "cancel") {
      if (!["PENDING", "APPROVED", "MATCHED"].includes(aidRequest.status)) {
        return NextResponse.json(
          { ok: false, error: "Esta solicitud ya no está activa." },
          { status: 400 }
        );
      }

      const updated = await prisma.aidRequest.update({
        where: { id },
        data: { status: "CANCELLED", isActive: null },
      });

      return NextResponse.json({ ok: true, aidRequest: updated });
    }

    // action === "complete"
    if (!["APPROVED", "MATCHED"].includes(aidRequest.status)) {
      return NextResponse.json(
        { ok: false, error: "Solo puedes marcar como atendida una solicitud aprobada." },
        { status: 400 }
      );
    }

    const updated = await prisma.aidRequest.update({
      where: { id },
      data: { status: "COMPLETED", isActive: null, completedAt: new Date() },
    });

    return NextResponse.json({ ok: true, aidRequest: updated });
  } catch (error) {
    console.error("PATCH /api/aid-requests/[id] error:", error);
    return NextResponse.json(
      { ok: false, error: "Error actualizando la solicitud." },
      { status: 500 }
    );
  }
}
