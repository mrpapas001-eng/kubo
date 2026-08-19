import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import {
  AID_CATEGORY_SLUGS,
  AID_CITIES,
  AID_PUBLIC_STATUSES,
  AID_REJECTED_COOLDOWN_HOURS,
  findMoneyRequest,
} from "@/lib/aidRequestPolicy";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const takeParam = Number(url.searchParams.get("take") ?? 12);
    const skipParam = Number(url.searchParams.get("skip") ?? 0);
    const cityParam = String(url.searchParams.get("city") ?? "").trim();
    const categoryParam = String(url.searchParams.get("category") ?? "").trim();

    const take = Number.isNaN(takeParam) ? 12 : Math.max(1, Math.min(takeParam, 24));
    const skip = Number.isNaN(skipParam) ? 0 : Math.max(0, skipParam);

    const where = {
      status: { in: [...AID_PUBLIC_STATUSES] },
      ...(cityParam ? { city: cityParam } : {}),
      ...(categoryParam ? { category: categoryParam } : {}),
    };

    // Solo campos públicos: nunca exponer ownerEmail ni whatsappNumber aquí.
    const items = await prisma.aidRequest.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      select: {
        id: true,
        title: true,
        category: true,
        city: true,
        description: true,
        contextImageUrl: true,
        status: true,
        ownerName: true,
        createdAt: true,
      },
    });

    const total = await prisma.aidRequest.count({ where });

    return NextResponse.json({
      ok: true,
      items,
      nextSkip: skip + items.length,
      hasMore: skip + items.length < total,
    });
  } catch (error: any) {
    console.error("GET /api/aid-requests error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error cargando solicitudes." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const ownerEmail = session?.user?.email?.toLowerCase().trim() ?? null;
    const ownerName = session?.user?.name?.trim() ?? null;

    if (!ownerEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión para solicitar ayuda." },
        { status: 401 }
      );
    }

    const verification = await prisma.accountVerification.findUnique({
      where: {
        email_type: {
          email: ownerEmail,
          type: "PARTICULAR",
        },
      },
    });

    if (!verification || verification.status !== "VERIFIED") {
      return NextResponse.json(
        { ok: false, error: "Tu cuenta debe estar verificada para solicitar ayuda." },
        { status: 403 }
      );
    }

    if (!verification.whatsappNumber) {
      return NextResponse.json(
        { ok: false, error: "Debes tener un número de WhatsApp vinculado para solicitar ayuda." },
        { status: 403 }
      );
    }

    let verifiedPhone = String(verification.whatsappNumber).replace(/\D/g, "");
    if (verifiedPhone.length > 10 && verifiedPhone.startsWith("57")) {
      verifiedPhone = verifiedPhone.slice(2);
    }
    verifiedPhone = verifiedPhone.slice(0, 10);

    if (!verifiedPhone || verifiedPhone.length < 7) {
      return NextResponse.json(
        { ok: false, error: "Tu número de WhatsApp verificado no es válido." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const title = String(body?.title ?? "").trim();
    const category = String(body?.category ?? "").trim();
    const city = String(body?.city ?? "").trim();
    const description = String(body?.description ?? "").trim();
    const contextImageUrl =
      body?.contextImageUrl && String(body.contextImageUrl).trim()
        ? String(body.contextImageUrl).trim()
        : null;

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "El título es obligatorio." },
        { status: 400 }
      );
    }

    if (!description || description.length < 20) {
      return NextResponse.json(
        { ok: false, error: "Describe tu necesidad con al menos 20 caracteres." },
        { status: 400 }
      );
    }

    if (!AID_CATEGORY_SLUGS.includes(category)) {
      return NextResponse.json(
        { ok: false, error: "Selecciona una categoría válida." },
        { status: 400 }
      );
    }

    if (!city || !AID_CITIES.includes(city)) {
      return NextResponse.json(
        { ok: false, error: "Selecciona una ciudad válida." },
        { status: 400 }
      );
    }

    const moneyTerm = findMoneyRequest(`${title} ${description}`);
    if (moneyTerm) {
      return NextResponse.json(
        {
          ok: false,
          error: `En Kubo Ayuda no se permiten solicitudes de dinero, transferencias, préstamos ni recargas (detectado: "${moneyTerm}"). Describe una necesidad concreta de artículos o ayuda material.`,
        },
        { status: 400 }
      );
    }

    const activeRequest = await prisma.aidRequest.findFirst({
      where: { ownerEmail, isActive: true },
      select: { id: true, status: true },
    });

    if (activeRequest) {
      return NextResponse.json(
        {
          ok: false,
          error: "Ya tienes una solicitud activa. Debes esperar a que se resuelva o cancelarla antes de crear otra.",
        },
        { status: 409 }
      );
    }

    const lastRejected = await prisma.aidRequest.findFirst({
      where: { ownerEmail, status: "REJECTED" },
      orderBy: { reviewedAt: "desc" },
      select: { reviewedAt: true, rejectionReason: true },
    });

    if (lastRejected?.reviewedAt) {
      const cooldownMs = AID_REJECTED_COOLDOWN_HOURS * 60 * 60 * 1000;
      const elapsed = Date.now() - lastRejected.reviewedAt.getTime();
      if (elapsed < cooldownMs) {
        const hoursLeft = Math.ceil((cooldownMs - elapsed) / (60 * 60 * 1000));
        return NextResponse.json(
          {
            ok: false,
            error: `Tu última solicitud fue rechazada${lastRejected.rejectionReason ? ` (motivo: ${lastRejected.rejectionReason})` : ""}. Podrás crear una nueva en ${hoursLeft} hora(s).`,
          },
          { status: 429 }
        );
      }
    }

    try {
      const aidRequest = await prisma.aidRequest.create({
        data: {
          ownerEmail,
          ownerName,
          whatsappNumber: verifiedPhone,
          title,
          category,
          city,
          description,
          contextImageUrl,
          status: "PENDING",
          isActive: true,
        },
      });

      return NextResponse.json({ ok: true, aidRequest });
    } catch (error: any) {
      // Violación del unique [ownerEmail, isActive]: otra solicitud activa creada en paralelo.
      if (error?.code === "P2002") {
        return NextResponse.json(
          {
            ok: false,
            error: "Ya tienes una solicitud activa. Debes esperar a que se resuelva o cancelarla antes de crear otra.",
          },
          { status: 409 }
        );
      }
      throw error;
    }
  } catch (error: any) {
    console.error("POST /api/aid-requests error:", error);
    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error creando la solicitud." },
      { status: 500 }
    );
  }
}
