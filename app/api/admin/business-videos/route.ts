import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";

const MAX_ADMIN_NOTE_LENGTH = 500;
const ALLOWED_ACTIONS = new Set(["approve", "reject"]);

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!isAdminEmail(email)) {
    return null;
  }

  return email;
}

export async function GET() {
  try {
    const adminEmail = await requireAdmin();

    if (!adminEmail) {
      return NextResponse.json(
        { ok: false, error: "No autorizado." },
        { status: 403 }
      );
    }

    const videos = await prisma.businessVideo.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        videoUrl: true,
        thumbnailUrl: true,
        description: true,
        categorySlug: true,
        city: true,
        durationSeconds: true,
        status: true,
        createdAt: true,
        business: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
            businessType: true,
            city: true,
            isVerified: true,
          },
        },
      },
    });

    return NextResponse.json({ ok: true, videos });
  } catch (error) {
    console.error("GET /api/admin/business-videos error:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudieron cargar los videos pendientes." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const adminEmail = await requireAdmin();

    if (!adminEmail) {
      return NextResponse.json(
        { ok: false, error: "No autorizado." },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => null);

    const id = String(body?.id ?? "").trim();
    const action = String(body?.action ?? "").trim();
    const adminNoteRaw = body?.adminNote;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "id es obligatorio." },
        { status: 400 }
      );
    }

    if (!ALLOWED_ACTIONS.has(action)) {
      return NextResponse.json(
        { ok: false, error: "action debe ser approve o reject." },
        { status: 400 }
      );
    }

    let adminNote: string | null = null;
    if (adminNoteRaw !== undefined && adminNoteRaw !== null) {
      const candidate = String(adminNoteRaw).trim();
      if (candidate.length > MAX_ADMIN_NOTE_LENGTH) {
        return NextResponse.json(
          {
            ok: false,
            error: `adminNote debe tener máximo ${MAX_ADMIN_NOTE_LENGTH} caracteres.`,
          },
          { status: 400 }
        );
      }
      adminNote = candidate || null;
    }

    const existing = await prisma.businessVideo.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Video no encontrado." },
        { status: 404 }
      );
    }

    const now = new Date();

    const video = await prisma.businessVideo.update({
      where: { id },
      data:
        action === "approve"
          ? {
              status: "APPROVED",
              approvedAt: now,
              rejectedAt: null,
              adminNote,
            }
          : {
              status: "REJECTED",
              rejectedAt: now,
              approvedAt: null,
              adminNote,
            },
      select: {
        id: true,
        status: true,
        approvedAt: true,
        rejectedAt: true,
        adminNote: true,
      },
    });

    return NextResponse.json({ ok: true, video });
  } catch (error) {
    console.error("PATCH /api/admin/business-videos error:", error);
    return NextResponse.json(
      { ok: false, error: "No se pudo actualizar el video." },
      { status: 500 }
    );
  }
}
