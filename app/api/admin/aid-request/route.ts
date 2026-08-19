import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const requestId = String(body?.requestId ?? "");
    const action = String(body?.action ?? "");
    const rejectionReason = String(body?.rejectionReason ?? "").trim();
    const adminNotes =
      typeof body?.adminNotes === "string" ? body.adminNotes.trim() : null;
    const matchedListingId =
      typeof body?.matchedListingId === "string" && body.matchedListingId.trim()
        ? body.matchedListingId.trim()
        : null;

    if (!requestId || !["approve", "reject", "match", "complete"].includes(action)) {
      return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
    }

    const aidRequest = await prisma.aidRequest.findUnique({
      where: { id: requestId },
      select: { id: true, status: true },
    });

    if (!aidRequest) {
      return NextResponse.json(
        { error: "Solicitud no encontrada" },
        { status: 404 }
      );
    }

    if (action === "approve") {
      if (aidRequest.status !== "PENDING") {
        return NextResponse.json(
          { error: "Solo se pueden aprobar solicitudes pendientes." },
          { status: 400 }
        );
      }

      await prisma.aidRequest.update({
        where: { id: requestId },
        data: {
          status: "APPROVED",
          isActive: true,
          reviewedAt: new Date(),
          ...(adminNotes !== null ? { adminNotes } : {}),
        },
      });
    } else if (action === "reject") {
      if (!["PENDING", "APPROVED", "MATCHED"].includes(aidRequest.status)) {
        return NextResponse.json(
          { error: "Esta solicitud ya no está activa." },
          { status: 400 }
        );
      }

      if (!rejectionReason) {
        return NextResponse.json(
          { error: "Debes indicar el motivo del rechazo (visible para el solicitante)." },
          { status: 400 }
        );
      }

      await prisma.aidRequest.update({
        where: { id: requestId },
        data: {
          status: "REJECTED",
          isActive: null,
          rejectionReason,
          reviewedAt: new Date(),
          ...(adminNotes !== null ? { adminNotes } : {}),
        },
      });
    } else if (action === "match") {
      if (aidRequest.status !== "APPROVED") {
        return NextResponse.json(
          { error: "Solo se pueden marcar en proceso solicitudes aprobadas." },
          { status: 400 }
        );
      }

      await prisma.aidRequest.update({
        where: { id: requestId },
        data: {
          status: "MATCHED",
          isActive: true,
          ...(matchedListingId ? { matchedListingId } : {}),
          ...(adminNotes !== null ? { adminNotes } : {}),
        },
      });
    } else {
      // action === "complete"
      if (!["APPROVED", "MATCHED"].includes(aidRequest.status)) {
        return NextResponse.json(
          { error: "Solo se pueden completar solicitudes aprobadas o en proceso." },
          { status: 400 }
        );
      }

      await prisma.aidRequest.update({
        where: { id: requestId },
        data: {
          status: "COMPLETED",
          isActive: null,
          completedAt: new Date(),
          ...(adminNotes !== null ? { adminNotes } : {}),
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/admin/aid-request error:", error);
    return NextResponse.json(
      { error: "No se pudo procesar la solicitud" },
      { status: 500 }
    );
  }
}
