import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";
import { CATEGORIES } from "@/data/categories";

const VALID_PLACEMENTS = [
  "home-main",
  "home-side",
  "home-feed",
  "category",
  "category-feed",
] as const;

const CATEGORY_PLACEMENTS = ["category", "category-feed"];
const BANNER_PLACEMENTS = ["home-main", "category"];

function isValidCategorySlug(slug: string) {
  return CATEGORIES.some((category) => category.slug === slug);
}

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: RouteProps) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!isAdminEmail(email)) {
    return NextResponse.json(
      { error: "No autorizado" },
      { status: 401 }
    );
  }

  const { id } = await params;
  const body = await request.json();

  const {
    title,
    subtitle,
    imageUrl,
    mobileImageUrl,
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

  const normalizedPlacement = String(placement).trim();

  if (!VALID_PLACEMENTS.includes(normalizedPlacement as any)) {
    return NextResponse.json(
      { error: "La ubicación seleccionada no es válida." },
      { status: 400 }
    );
  }

  const normalizedCategorySlug = categorySlug
    ? String(categorySlug).trim()
    : "";

  if (CATEGORY_PLACEMENTS.includes(normalizedPlacement)) {
    if (!normalizedCategorySlug || !isValidCategorySlug(normalizedCategorySlug)) {
      return NextResponse.json(
        { error: "Debes seleccionar una categoría válida." },
        { status: 400 }
      );
    }
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

  const sponsor = await prisma.sponsorAd.update({
    where: { id },
    data: {
      title: String(title).trim(),
      subtitle: subtitle ? String(subtitle).trim() : null,
      imageUrl: imageUrl ? String(imageUrl).trim() : null,
      mobileImageUrl: mobileImageUrl ? String(mobileImageUrl).trim() : null,
      ctaText: ctaText ? String(ctaText).trim() : null,
      ctaUrl: ctaUrl ? String(ctaUrl).trim() : null,
      type: BANNER_PLACEMENTS.includes(normalizedPlacement)
        ? "BANNER"
        : "CARD",
      placement: normalizedPlacement,
      categorySlug: CATEGORY_PLACEMENTS.includes(normalizedPlacement)
        ? normalizedCategorySlug
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
}