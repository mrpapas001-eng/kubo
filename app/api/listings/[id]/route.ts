import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/admin";
import { attachAccountVerification } from "@/lib/accountVerification";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail =
      session?.user?.email?.toLowerCase().trim() ?? null;

    const isAdmin = isAdminEmail(sessionEmail);

    const { id } = await context.params;
    const cleanId = String(id ?? "").trim();

    if (!cleanId) {
      return NextResponse.json(
        { ok: false, error: "ID requerido." },
        { status: 400 }
      );
    }

    const listing = await prisma.listing.findUnique({
      where: { id: cleanId },
    });

    if (!listing) {
      return NextResponse.json(
        { ok: false, error: "Anuncio no encontrado." },
        { status: 404 }
      );
    }

    const ownerEmail =
      listing.ownerEmail?.toLowerCase().trim() ?? null;

    const canViewPrivate =
      Boolean(
        sessionEmail &&
          ownerEmail &&
          sessionEmail === ownerEmail
      ) || isAdmin;

    if (listing.status !== "active" && !canViewPrivate) {
      return NextResponse.json(
        { ok: false, error: "Anuncio no encontrado." },
        { status: 404 }
      );
    }

    const [listingWithVerification] =
      await attachAccountVerification([listing]);

    return NextResponse.json({
      ok: true,
      listing: listingWithVerification,
    });
  } catch (error: any) {
    console.error("GET /api/listings/[id] error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Error cargando anuncio.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail =
      session?.user?.email?.toLowerCase().trim() ?? null;

    if (!sessionEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const cleanId = String(id ?? "").trim();

    if (!cleanId) {
      return NextResponse.json(
        { ok: false, error: "ID requerido." },
        { status: 400 }
      );
    }

    const existing = await prisma.listing.findUnique({
      where: { id: cleanId },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Anuncio no encontrado." },
        { status: 404 }
      );
    }

    const ownerEmail = String(existing.ownerEmail ?? "")
      .toLowerCase()
      .trim();

    const isAdmin = isAdminEmail(sessionEmail);

    const canEdit =
      Boolean(ownerEmail && ownerEmail === sessionEmail) ||
      isAdmin;

    if (!canEdit) {
      return NextResponse.json(
        {
          ok: false,
          error: "No tienes permisos para editar este anuncio.",
        },
        { status: 403 }
      );
    }

    if (existing.status === "deleted") {
      return NextResponse.json(
        {
          ok: false,
          error: "No puedes editar un anuncio eliminado.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const title = String(body?.title ?? "").trim();
    const description = String(body?.description ?? "").trim();

    const phone = String(body?.phone ?? "")
      .replace(/\D/g, "")
      .slice(0, 10);

    const rawPrice = String(body?.price ?? "").replace(/\D/g, "");
    const price = rawPrice ? Number(rawPrice) : null;

    const imageUrls = Array.isArray(body?.imageUrls)
      ? body.imageUrls
          .map((url: unknown) => String(url ?? "").trim())
          .filter(Boolean)
          .slice(0, 10)
      : null;

    if (imageUrls && imageUrls.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "El anuncio debe tener al menos una imagen.",
        },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "El título es obligatorio." },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          ok: false,
          error: "La descripción es obligatoria.",
        },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 7) {
      return NextResponse.json(
        { ok: false, error: "El teléfono no es válido." },
        { status: 400 }
      );
    }

    const existingDetails =
      existing.details &&
      typeof existing.details === "object" &&
      !Array.isArray(existing.details)
        ? (existing.details as Record<string, unknown>)
        : {};

    const updated = await prisma.listing.update({
      where: { id: cleanId },
      data: {
        title,
        description,
        phone,
        price,

        ...(imageUrls
          ? {
              imageUrl: imageUrls[0],
              details: {
                ...existingDetails,
                images: imageUrls,
              },
            }
          : {}),
      },
    });

    return NextResponse.json({
      ok: true,
      listing: updated,
    });
  } catch (error: any) {
    console.error("PUT /api/listings/[id] error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Error actualizando anuncio.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail =
      session?.user?.email?.toLowerCase().trim() ?? null;

    if (!sessionEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const cleanId = String(id ?? "").trim();

    if (!cleanId) {
      return NextResponse.json(
        { ok: false, error: "ID requerido." },
        { status: 400 }
      );
    }

    const existing = await prisma.listing.findUnique({
      where: { id: cleanId },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Anuncio no encontrado." },
        { status: 404 }
      );
    }

    const ownerEmail = String(existing.ownerEmail ?? "")
      .toLowerCase()
      .trim();

    const isAdmin = isAdminEmail(sessionEmail);

    const canChangeStatus =
      Boolean(ownerEmail && ownerEmail === sessionEmail) ||
      isAdmin;

    if (!canChangeStatus) {
      return NextResponse.json(
        { ok: false, error: "No autorizado." },
        { status: 403 }
      );
    }

    if (
      !isAdmin &&
      existing.status === "hidden" &&
      existing.hiddenReason === "moderation"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Este anuncio fue ocultado por moderación y no puede ser reactivado por el propietario.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();
    const status = String(body?.status ?? "").trim();

    if (!["active", "hidden"].includes(status)) {
      return NextResponse.json(
        { ok: false, error: "Estado inválido." },
        { status: 400 }
      );
    }

    const isReactivatingDeleted =
      status === "active" && existing.status === "deleted";

    const updated = await prisma.listing.update({
      where: { id: cleanId },
      data: isReactivatingDeleted
        ? {
            status,
            isPremium: false,
            premiumPlan: null,
            premiumUntil: null,
            isFeatured: false,
            featuredUntil: null,
            hiddenReason: null,
          }
        : {
            status,
          },
    });

    return NextResponse.json({
      ok: true,
      listing: updated,
    });
  } catch (error: any) {
    console.error("PATCH /api/listings/[id] error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Error actualizando estado.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail =
      session?.user?.email?.toLowerCase().trim() ?? null;

    if (!sessionEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión." },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    const cleanId = String(id ?? "").trim();

    if (!cleanId) {
      return NextResponse.json(
        { ok: false, error: "ID requerido." },
        { status: 400 }
      );
    }

    const existing = await prisma.listing.findUnique({
      where: { id: cleanId },
    });

    if (!existing) {
      return NextResponse.json(
        { ok: false, error: "Anuncio no encontrado." },
        { status: 404 }
      );
    }

    const ownerEmail = String(existing.ownerEmail ?? "")
      .toLowerCase()
      .trim();

    const isAdmin = isAdminEmail(sessionEmail);

    const canDelete =
      Boolean(ownerEmail && ownerEmail === sessionEmail) ||
      isAdmin;

    if (!canDelete) {
      return NextResponse.json(
        {
          ok: false,
          error: "No tienes permisos para borrar este anuncio.",
        },
        { status: 403 }
      );
    }

    await prisma.listing.update({
      where: { id: cleanId },
      data: {
        status: "deleted",
      },
    });

    return NextResponse.json({
      ok: true,
    });
  } catch (error: any) {
    console.error("DELETE /api/listings/[id] error:", error);

    return NextResponse.json(
      {
        ok: false,
        error: error?.message ?? "Error borrando anuncio.",
      },
      { status: 500 }
    );
  }
}