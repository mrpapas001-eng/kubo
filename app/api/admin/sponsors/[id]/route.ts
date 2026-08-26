import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";

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

  const sponsor = await prisma.sponsorAd.update({
    where: { id },
    data: {
      title: String(title).trim(),
      subtitle: subtitle ? String(subtitle).trim() : null,
      imageUrl: imageUrl ? String(imageUrl).trim() : null,
      ctaText: ctaText ? String(ctaText).trim() : null,
      ctaUrl: ctaUrl ? String(ctaUrl).trim() : null,
      placement: String(placement).trim(),
      categorySlug: categorySlug
        ? String(categorySlug).trim()
        : null,
      priority: Number(priority || 0),
      startAt: new Date(startAt),
      endAt: new Date(endAt),
      isActive: Boolean(isActive),
    },
  });

  return NextResponse.json({
    ok: true,
    sponsor,
  });
}