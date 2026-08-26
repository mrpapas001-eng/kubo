import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!isAdminEmail(email)) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const {
      title,
      subtitle,
      imageUrl,
      ctaText,
      ctaUrl,
      placement,
      categorySlug,
      priority,
      startAt,
      endAt,
      isActive,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "El título es obligatorio." },
        { status: 400 }
      );
    }

    if (!placement?.trim()) {
      return NextResponse.json(
        { error: "La ubicación es obligatoria." },
        { status: 400 }
      );
    }

    const startDate = new Date(startAt);
    const endDate = new Date(endAt);

    if (Number.isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: "La fecha de inicio no es válida." },
        { status: 400 }
      );
    }

    if (Number.isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "La fecha de finalización no es válida." },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        { error: "La fecha de finalización debe ser posterior al inicio." },
        { status: 400 }
      );
    }

    const normalizedPlacement = String(placement).trim();

    const sponsor = await prisma.sponsorAd.create({
      data: {
        title: String(title).trim(),
        subtitle: subtitle ? String(subtitle).trim() : null,
        imageUrl: imageUrl ? String(imageUrl).trim() : null,
        ctaText: ctaText ? String(ctaText).trim() : null,
        ctaUrl: ctaUrl ? String(ctaUrl).trim() : null,
        type: normalizedPlacement === "home-main" ? "BANNER" : "CARD",
        placement: normalizedPlacement,
        categorySlug:
          normalizedPlacement === "category" ||
          normalizedPlacement === "category-feed"
            ? categorySlug
              ? String(categorySlug).trim()
              : null
            : null,
        priority: Number(priority || 0),
        startAt: startDate,
        endAt: endDate,
        isActive: Boolean(isActive),
      },
    });

    return NextResponse.json({
      ok: true,
      sponsor,
    });
  } catch (error) {
    console.error("Error creating sponsor:", error);

    return NextResponse.json(
      { error: "No se pudo crear el sponsor." },
      { status: 500 }
    );
  }
}