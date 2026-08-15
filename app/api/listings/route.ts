import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

const SMART_ORDER = [
  { isPremium: "desc" as const },
  { isFeatured: "desc" as const },
  { imageUrl: "desc" as const },
  { createdAt: "desc" as const },
];

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const takeParam = Number(url.searchParams.get("take") ?? 12);
    const skipParam = Number(url.searchParams.get("skip") ?? 0);
    const cityParam = String(url.searchParams.get("city") ?? "").trim();

    const take = Number.isNaN(takeParam) ? 12 : Math.max(1, Math.min(takeParam, 24));
    const skip = Number.isNaN(skipParam) ? 0 : Math.max(0, skipParam);

    const where: any = {
      status: "active",
      OR: [{ premiumUntil: null }, { premiumUntil: { gt: new Date() } }],
      ...(cityParam ? { city: cityParam } : {}),
    };

    const items = await prisma.listing.findMany({
      where,
      orderBy: SMART_ORDER,
      take,
      skip,
    });

    const total = await prisma.listing.count({ where });

    return NextResponse.json({
      ok: true,
      items,
      nextSkip: skip + items.length,
      hasMore: skip + items.length < total,
      fallbackUsed: false,
    });
  } catch (error: any) {
    console.error("GET /api/listings error:", error);

    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error cargando anuncios." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const sessionEmail = session?.user?.email?.toLowerCase().trim() ?? null;
    const sessionName = session?.user?.name?.trim() ?? null;
    const sessionImage = session?.user?.image?.trim() ?? null;

    if (!sessionEmail) {
      return NextResponse.json(
        { ok: false, error: "Debes iniciar sesión para publicar." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const title = String(body?.title ?? "").trim();
    const description = String(body?.description ?? "").trim();
    const phone = String(body?.phone ?? "").replace(/\D/g, "").slice(0, 10);
    const city = String(body?.city ?? "").trim();
    const location = String(body?.location ?? "").trim();
    const categorySlug = String(body?.categorySlug ?? "").trim();
    const subcategorySlug = String(body?.subcategorySlug ?? "").trim();
    const template = String(body?.template ?? "GENERAL").trim();
    const sellerType = String(body?.sellerType ?? "PARTICULAR").trim();
    const currency = String(body?.currency ?? "COP").trim();

    const rawPrice = body?.price;
    const parsedPrice =
      rawPrice === null || rawPrice === undefined || rawPrice === ""
        ? null
        : Number(rawPrice);

    const isVerified = false;

    const imageUrl =
      body?.imageUrl && String(body.imageUrl).trim()
        ? String(body.imageUrl).trim()
        : null;

    const details =
      body?.details && typeof body.details === "object" ? body.details : null;

    const ownerEmail = sessionEmail;

    const businessName = String(body?.businessName ?? "").trim();
    const businessDescription = String(body?.businessDescription ?? "").trim();
    const businessWebsite = String(body?.businessWebsite ?? "").trim();
    const businessInstagram = String(body?.businessInstagram ?? "").trim();
    const businessFacebook = String(body?.businessFacebook ?? "").trim();
    const businessWhatsapp = String(body?.businessWhatsapp ?? "")
      .replace(/\D/g, "")
      .slice(0, 10);

    const isBusiness = sellerType === "EMPRESA";

    const businessSlug = businessName
      ? businessName
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "")
      : null;

    if (!title) {
      return NextResponse.json(
        { ok: false, error: "El título es obligatorio." },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { ok: false, error: "La descripción es obligatoria." },
        { status: 400 }
      );
    }

    if (!phone || phone.length < 7) {
      return NextResponse.json(
        { ok: false, error: "El teléfono no es válido." },
        { status: 400 }
      );
    }

    if (!city) {
      return NextResponse.json(
        { ok: false, error: "La ciudad es obligatoria." },
        { status: 400 }
      );
    }

    if (!categorySlug) {
      return NextResponse.json(
        { ok: false, error: "La categoría es obligatoria." },
        { status: 400 }
      );
    }

    if (!subcategorySlug) {
      return NextResponse.json(
        { ok: false, error: "La subcategoría es obligatoria." },
        { status: 400 }
      );
    }

    if (parsedPrice !== null && Number.isNaN(parsedPrice)) {
      return NextResponse.json(
        { ok: false, error: "El precio no es válido." },
        { status: 400 }
      );
    }

    const approvedBusiness =
      isBusiness && ownerEmail && businessSlug
        ? await prisma.businessVerificationRequest.findFirst({
            where: {
              ownerEmail,
              businessSlug,
              status: "approved",
            },
          })
        : null;

    const approvedIdentity = ownerEmail
      ? await prisma.identityVerificationRequest.findFirst({
          where: {
            ownerEmail,
            status: "approved",
          },
        })
      : null;

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        phone,
        price: parsedPrice,
        currency,
        city,
        location,
        lat: 4.8133,
        lng: -75.6961,
        categorySlug,
        subcategorySlug,
        template,
        sellerType,
        isVerified: Boolean(isVerified || approvedIdentity),
        imageUrl,
        details,
        ownerEmail,
        ownerName: sessionName,
        ownerImage: sessionImage,

        isBusiness,
        businessName: businessName || null,
        businessDescription: businessDescription || null,
        businessWebsite: businessWebsite || null,
        businessInstagram: businessInstagram || null,
        businessFacebook: businessFacebook || null,
        businessWhatsapp: businessWhatsapp || null,
        businessSlug,
        businessVerified: Boolean(approvedBusiness),
      },
    });

    return NextResponse.json({
      ok: true,
      listing,
    });
  } catch (error: any) {
    console.error("POST /api/listings error:", error);

    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error creando anuncio." },
      { status: 500 }
    );
  }
}
