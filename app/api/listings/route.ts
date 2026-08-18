import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { attachAccountVerification } from "@/lib/accountVerification";

const SMART_ORDER = [
  { isPremium: "desc" as const },
  { isFeatured: "desc" as const },
  { imageUrl: "desc" as const },
  { createdAt: "desc" as const },
];

// Mismo catálogo de categorías/subcategorías usado por app/publish/page.tsx (CATEGORY_OPTIONS).
const PUBLISH_CATEGORIES: Record<string, string[]> = {
  motor: ["carros", "motos", "repuestos"],
  inmobiliaria: [
    "casa",
    "apartamento",
    "apartaestudio",
    "local-comercial",
    "finca",
    "lote",
    "casa-campestre",
    "bodega",
    "otros-inmuebles",
  ],
  celulares: ["celulares", "repuestos", "telefono-fijo"],
  empleo: ["ofrezco-empleo", "busco-empleo"],
  servicios: [
    "hogar",
    "personas",
    "empresas",
    "electricos",
    "energia-solar",
    "motor",
    "bicicleta",
    "otros",
  ],
  negocios: [
    "venta-de-negocios",
    "traspasos",
    "franquicias",
    "arriendo-de-negocio",
    "financiacion",
  ],
  informatica: [
    "portatiles",
    "todo-en-uno",
    "escritorio",
    "tablets",
    "mac",
    "accesorios",
    "software",
    "gaming",
  ],
  "imagen-sonido": ["fotografia", "imagen", "sonido", "musica"],
  juegos: ["consolas", "videojuegos", "accesorios"],
  formacion: [
    "clases-particulares",
    "libros",
    "idiomas",
    "cursos",
    "autoescuelas",
  ],
  deportes: [
    "bicicletas",
    "futbol",
    "gimnasio",
    "running",
    "camping",
    "natacion",
    "otros",
  ],
  mascotas: ["perros", "gatos", "caballos", "adopciones", "peces", "varios"],
  bebes: [
    "habitacion-bebes",
    "camaras-de-vigilancia",
    "coches-de-bebe",
    "juguetes",
    "higiene-y-cuidado",
    "varios",
  ],
  moda: [
    "moda-hombre",
    "moda-mujer",
    "perfumes",
    "calzado",
    "disfraces",
    "joyeria-bisuteria",
    "sex-shop",
    "otros-articulos-de-moda",
  ],
  "regalos-celebraciones": [
    "velas-y-velones",
    "regalos",
    "flores-y-detalles",
    "decoracion-para-fiestas",
    "pinateria",
    "desayunos-y-sorpresas",
    "globos",
    "invitaciones-y-papeleria",
    "articulos-religiosos",
    "otros",
  ],
  hogar: [
    "muebles-de-hogar",
    "decoracion",
    "colchones",
    "iluminacion",
    "menaje",
    "organizacion",
    "jardin-y-terraza",
    "otros",
  ],
};

const REAL_ESTATE_SUBS_REQUIRING_ROOMS = [
  "casa",
  "apartamento",
  "apartaestudio",
  "finca",
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
    const itemsWithVerification = await attachAccountVerification(items);

    return NextResponse.json({
      ok: true,
      items: itemsWithVerification,
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
    const template = categorySlug === "servicios"
      ? "SERVICE_JOB"
      : String(body?.template ?? "GENERAL").trim();
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

    // Seguridad Kubo Ayuda: las donaciones exigen cuenta PARTICULAR verificada,
    // usan el WhatsApp verificado (nunca body.phone) y fuerzan price = 0.
    const isDonation = details?.kuboAyuda?.type === "DONATION";

    let finalPhone = phone;
    let finalPrice = parsedPrice;

    if (isDonation) {
      if (sellerType !== "PARTICULAR") {
        return NextResponse.json(
          { ok: false, error: "Las donaciones solo pueden ser publicadas por particulares." },
          { status: 403 }
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
          { ok: false, error: "Tu cuenta debe estar verificada para publicar donaciones." },
          { status: 403 }
        );
      }

      if (!verification.whatsappNumber) {
        return NextResponse.json(
          { ok: false, error: "Debes tener un número de WhatsApp vinculado para donar." },
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

      finalPhone = verifiedPhone;
      finalPrice = 0;
    }

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

    if (!finalPhone || finalPhone.length < 7) {
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

    if (!isDonation && parsedPrice !== null && Number.isNaN(parsedPrice)) {
      return NextResponse.json(
        { ok: false, error: "El precio no es válido." },
        { status: 400 }
      );
    }

    const validSubcategories = PUBLISH_CATEGORIES[categorySlug];

    if (!validSubcategories) {
      return NextResponse.json(
        { ok: false, error: "Selecciona una categoría válida." },
        { status: 400 }
      );
    }

    if (!validSubcategories.includes(subcategorySlug)) {
      return NextResponse.json(
        { ok: false, error: "Selecciona una subcategoría válida." },
        { status: 400 }
      );
    }

    if (!["PARTICULAR", "EMPRESA"].includes(sellerType)) {
      return NextResponse.json(
        { ok: false, error: "El tipo de vendedor no es válido." },
        { status: 400 }
      );
    }

    if (sellerType === "EMPRESA" && !businessName) {
      return NextResponse.json(
        { ok: false, error: "El nombre de la empresa es obligatorio." },
        { status: 400 }
      );
    }

    const detailImages = Array.isArray(details?.images) ? details.images : [];
    const hasAtLeastOnePhoto = detailImages.length > 0 || Boolean(imageUrl);

    if (!hasAtLeastOnePhoto) {
      return NextResponse.json(
        { ok: false, error: "Debes añadir al menos una foto." },
        { status: 400 }
      );
    }

    const requiresPrice = !["empleo", "servicios"].includes(categorySlug);

    if (!isDonation && requiresPrice && parsedPrice === null) {
      return NextResponse.json(
        { ok: false, error: "El precio es obligatorio." },
        { status: 400 }
      );
    }

    const isVehicle =
      categorySlug === "motor" &&
      ["carros", "motos"].includes(subcategorySlug);

    if (isVehicle) {
      const motor = details?.motor && typeof details.motor === "object" ? details.motor : null;

      if (!motor?.brand) {
        return NextResponse.json(
          { ok: false, error: "La marca del vehículo es obligatoria." },
          { status: 400 }
        );
      }

      if (!motor?.model) {
        return NextResponse.json(
          { ok: false, error: "El modelo del vehículo es obligatorio." },
          { status: 400 }
        );
      }

      if (!motor?.year) {
        return NextResponse.json(
          { ok: false, error: "El año del vehículo es obligatorio." },
          { status: 400 }
        );
      }
    }

    if (categorySlug === "celulares" && subcategorySlug === "celulares") {
      const cellphone =
        details?.cellphone && typeof details.cellphone === "object"
          ? details.cellphone
          : null;

      if (!cellphone?.brand) {
        return NextResponse.json(
          { ok: false, error: "La marca del celular es obligatoria." },
          { status: 400 }
        );
      }

      if (!cellphone?.model) {
        return NextResponse.json(
          { ok: false, error: "El modelo del celular es obligatorio." },
          { status: 400 }
        );
      }
    }

    if (categorySlug === "inmobiliaria") {
      const realEstate =
        details?.realEstate && typeof details.realEstate === "object"
          ? details.realEstate
          : null;

      if (!realEstate?.deal) {
        return NextResponse.json(
          { ok: false, error: "Selecciona si el inmueble es venta o arriendo." },
          { status: 400 }
        );
      }

      if (!realEstate?.sqm) {
        return NextResponse.json(
          { ok: false, error: "Los metros cuadrados del inmueble son obligatorios." },
          { status: 400 }
        );
      }

      if (REAL_ESTATE_SUBS_REQUIRING_ROOMS.includes(subcategorySlug)) {
        if (!realEstate?.rooms) {
          return NextResponse.json(
            { ok: false, error: "El número de alcobas es obligatorio." },
            { status: 400 }
          );
        }

        if (!realEstate?.baths) {
          return NextResponse.json(
            { ok: false, error: "El número de baños es obligatorio." },
            { status: 400 }
          );
        }
      }
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
        phone: finalPhone,
        price: finalPrice,
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

    // Invalida la Home cacheada para que el anuncio nuevo aparezca sin esperar al revalidate periódico.
    revalidatePath("/");

    const accountVerification = await prisma.accountVerification.findUnique({
      where: {
        email_type: {
          email: ownerEmail,
          type: isBusiness ? "EMPRESA" : "PARTICULAR",
        },
      },
      select: { status: true },
    });

    return NextResponse.json({
      ok: true,
      listing,
      verificationStatus: accountVerification?.status ?? null,
    });
  } catch (error: any) {
    console.error("POST /api/listings error:", error);

    return NextResponse.json(
      { ok: false, error: error?.message ?? "Error creando anuncio." },
      { status: 500 }
    );
  }
}
