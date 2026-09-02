import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { attachAccountVerification } from "@/lib/accountVerification";
import { isAdminEmail } from "@/lib/admin";

const SMART_ORDER = [
  { isPremium: "desc" as const },
  { isFeatured: "desc" as const },
  { imageUrl: "desc" as const },
  { createdAt: "desc" as const },
];

// Mismo catálogo de categorías/subcategorías usado por
// app/publish/page.tsx (CATEGORY_OPTIONS).
const PUBLISH_CATEGORIES: Record<string, string[]> = {
  motor: ["carros", "motos", "repuestos"],

  inmobiliaria: [
    "casa",
    "apartamento",
    "apartaestudio",
    "local-comercial",
    "finca",
    "finca-vacacional",
    "glamping-cabanas",
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

  mascotas: [
    "perros",
    "gatos",
    "caballos",
    "adopciones",
    "peces",
    "varios",
  ],

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

  juguetes: [
    "peluches",
    "munecas-y-figuras",
    "juegos-de-mesa",
    "didacticos",
    "aire-libre",
    "otros",
  ],

  "papeleria-oficina": [
    "utiles-escolares",
    "cuadernos-y-papel",
    "escritura-y-dibujo",
    "oficina-y-archivo",
    "arte-y-manualidades",
    "otros",
  ],

  "herramientas-ferreteria": [
    "herramientas-electricas",
    "herramientas-manuales",
    "construccion",
    "jardineria",
    "seguridad-industrial",
    "otros",
  ],

  "salud-belleza": [
    "maquillaje",
    "cuidado-de-la-piel",
    "cabello",
    "aparatos-de-belleza",
    "salud-y-bienestar",
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

    const take = Number.isNaN(takeParam)
      ? 12
      : Math.max(1, Math.min(takeParam, 24));

    const skip = Number.isNaN(skipParam)
      ? 0
      : Math.max(0, skipParam);

    const where: any = {
      status: "active",
      OR: [
        { premiumUntil: null },
        { premiumUntil: { gt: new Date() } },
      ],
      ...(cityParam ? { city: cityParam } : {}),
    };

    const items = await prisma.listing.findMany({
      where,
      orderBy: SMART_ORDER,
      take,
      skip,
    });

    const total = await prisma.listing.count({
      where,
    });

    const itemsWithVerification =
      await attachAccountVerification(items);

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
      {
        ok: false,
        error: error?.message ?? "Error cargando anuncios.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req: Request) {
  try {
    // =====================================================
    // SESIÓN
    // =====================================================

    const session = await getServerSession(authOptions);

    const sessionEmail =
      session?.user?.email?.toLowerCase().trim() ?? null;

    const sessionName =
      session?.user?.name?.trim() ?? null;

    const sessionImage =
      session?.user?.image?.trim() ?? null;

    if (!sessionEmail) {
      return NextResponse.json(
        {
          ok: false,
          error: "Debes iniciar sesión para publicar.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await req.json();

    // =====================================================
    // DATOS BÁSICOS
    // =====================================================

    const title = String(body?.title ?? "").trim();

    const description = String(
      body?.description ?? ""
    ).trim();

    const phone = String(body?.phone ?? "")
      .replace(/\D/g, "")
      .slice(0, 10);

    const contactUrl = String(
      body?.contactUrl ?? ""
    ).trim();

    const city = String(body?.city ?? "").trim();

    const location = String(
      body?.location ?? ""
    ).trim();

    const categorySlug = String(
      body?.categorySlug ?? ""
    ).trim();

    const subcategorySlug = String(
      body?.subcategorySlug ?? ""
    ).trim();

    const template =
      categorySlug === "servicios"
        ? "SERVICE_JOB"
        : String(body?.template ?? "GENERAL").trim();

    const requestedSellerType = String(
      body?.sellerType ?? "PARTICULAR"
    ).trim();

    const currency = String(
      body?.currency ?? "COP"
    ).trim();

    // =====================================================
    // PRECIO
    // =====================================================

    const rawPrice = body?.price;

    const parsedPrice =
      rawPrice === null ||
      rawPrice === undefined ||
      rawPrice === ""
        ? null
        : Number(rawPrice);

    // La verificación nunca se acepta directamente desde el navegador.
    const isVerified = false;

    // =====================================================
    // IMAGEN Y DETALLES
    // =====================================================

    const imageUrl =
      body?.imageUrl &&
      String(body.imageUrl).trim()
        ? String(body.imageUrl).trim()
        : null;

    const details =
      body?.details &&
      typeof body.details === "object"
        ? body.details
        : null;

    // =====================================================
    // KUBO EMPRESAS
    // =====================================================

    const requestedBusinessId =
      String(body?.businessId ?? "").trim() || null;

    const selectedBusiness = requestedBusinessId
      ? await prisma.business.findUnique({
          where: {
            id: requestedBusinessId,
          },
        })
      : null;

    // Si llega un ID de empresa, esa empresa debe existir.
    if (requestedBusinessId && !selectedBusiness) {
      return NextResponse.json(
        {
          ok: false,
          error: "La empresa seleccionada no existe.",
        },
        {
          status: 404,
        }
      );
    }

    // No permitimos publicar para empresas inactivas.
    if (selectedBusiness && !selectedBusiness.isActive) {
      return NextResponse.json(
        {
          ok: false,
          error: "Esta empresa se encuentra inactiva.",
        },
        {
          status: 403,
        }
      );
    }

    // Solo el administrador de Kubo o el propietario
    // de la empresa puede publicar en su nombre.
    if (selectedBusiness) {
      const canPublishForBusiness =
        isAdminEmail(sessionEmail) ||
        selectedBusiness.ownerEmail
          .toLowerCase()
          .trim() === sessionEmail;

      if (!canPublishForBusiness) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "No tienes permiso para publicar en nombre de esta empresa.",
          },
          {
            status: 403,
          }
        );
      }
    }

    // Cuando publicamos para una empresa registrada,
    // el anuncio pertenece al correo propietario de esa empresa.
    const ownerEmail =
      selectedBusiness?.ownerEmail
        ?.toLowerCase()
        .trim() ?? sessionEmail;

    const ownerName =
      selectedBusiness?.ownerName?.trim() ||
      sessionName;

    const ownerImage = selectedBusiness
      ? selectedBusiness.logo || null
      : sessionImage;

    // Una publicación asociada a Kubo Empresas
    // siempre es una publicación empresarial.
    const sellerType = selectedBusiness
      ? "EMPRESA"
      : requestedSellerType;

    const isBusiness = sellerType === "EMPRESA";

    // =====================================================
    // KUBO AYUDA
    // =====================================================

    const isDonation =
      details?.kuboAyuda?.type === "DONATION";

    let finalPhone = phone;

    let finalContactUrl =
      contactUrl || null;

    let finalPrice = parsedPrice;

    if (isDonation) {
      if (sellerType !== "PARTICULAR") {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Las donaciones solo pueden ser publicadas por particulares.",
          },
          {
            status: 403,
          }
        );
      }

      const verification =
        await prisma.accountVerification.findUnique({
          where: {
            email_type: {
              email: ownerEmail,
              type: "PARTICULAR",
            },
          },
        });

      if (
        !verification ||
        verification.status !== "VERIFIED"
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Tu cuenta debe estar verificada para publicar donaciones.",
          },
          {
            status: 403,
          }
        );
      }

      if (!verification.whatsappNumber) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Debes tener un número de WhatsApp vinculado para donar.",
          },
          {
            status: 403,
          }
        );
      }

      let verifiedPhone = String(
        verification.whatsappNumber
      ).replace(/\D/g, "");

      if (
        verifiedPhone.length > 10 &&
        verifiedPhone.startsWith("57")
      ) {
        verifiedPhone = verifiedPhone.slice(2);
      }

      verifiedPhone =
        verifiedPhone.slice(0, 10);

      if (
        !verifiedPhone ||
        verifiedPhone.length < 7
      ) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Tu número de WhatsApp verificado no es válido.",
          },
          {
            status: 403,
          }
        );
      }

      finalPhone = verifiedPhone;
      finalContactUrl = null;
      finalPrice = 0;
    }

    // =====================================================
    // DATOS EMPRESARIALES DEL FORMULARIO NORMAL
    // =====================================================

    const bodyBusinessName = String(
      body?.businessName ?? ""
    ).trim();

    const bodyBusinessDescription = String(
      body?.businessDescription ?? ""
    ).trim();

    const bodyBusinessWebsite = String(
      body?.businessWebsite ?? ""
    ).trim();

    const bodyBusinessInstagram = String(
      body?.businessInstagram ?? ""
    ).trim();

    const bodyBusinessFacebook = String(
      body?.businessFacebook ?? ""
    ).trim();

    const bodyBusinessWhatsapp = String(
      body?.businessWhatsapp ?? ""
    )
      .replace(/\D/g, "")
      .slice(0, 10);

    // Si viene de Kubo Empresas usamos SIEMPRE
    // los datos oficiales guardados en Business.
    const businessName =
      selectedBusiness?.name ||
      bodyBusinessName;

    const businessDescription =
      selectedBusiness?.description ||
      bodyBusinessDescription;

    const businessWebsite =
      selectedBusiness?.website ||
      bodyBusinessWebsite;

    const businessInstagram =
      selectedBusiness?.instagram ||
      bodyBusinessInstagram;

    const businessFacebook =
      selectedBusiness?.facebook ||
      bodyBusinessFacebook;

    const businessWhatsapp =
      selectedBusiness?.whatsapp
        ? String(selectedBusiness.whatsapp)
            .replace(/\D/g, "")
            .slice(0, 10)
        : bodyBusinessWhatsapp;

    const businessSlug = selectedBusiness
      ? selectedBusiness.slug
      : businessName
        ? businessName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "")
        : null;

    // =====================================================
    // VALIDACIONES GENERALES
    // =====================================================

    if (!title) {
      return NextResponse.json(
        {
          ok: false,
          error: "El título es obligatorio.",
        },
        {
          status: 400,
        }
      );
    }

    if (!description) {
      return NextResponse.json(
        {
          ok: false,
          error: "La descripción es obligatoria.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isDonation) {
      if (!finalPhone && !finalContactUrl) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Debes indicar un teléfono o un enlace de contacto.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        finalPhone &&
        finalPhone.length < 7
      ) {
        return NextResponse.json(
          {
            ok: false,
            error: "El teléfono no es válido.",
          },
          {
            status: 400,
          }
        );
      }

      if (finalContactUrl) {
        try {
          const parsedContactUrl =
            new URL(finalContactUrl);

          if (
            !["http:", "https:"].includes(
              parsedContactUrl.protocol
            )
          ) {
            return NextResponse.json(
              {
                ok: false,
                error:
                  "El enlace de contacto no es válido.",
              },
              {
                status: 400,
              }
            );
          }
        } catch {
          return NextResponse.json(
            {
              ok: false,
              error:
                "El enlace de contacto no es válido.",
            },
            {
              status: 400,
            }
          );
        }
      }
    }

    if (!city) {
      return NextResponse.json(
        {
          ok: false,
          error: "La ciudad es obligatoria.",
        },
        {
          status: 400,
        }
      );
    }

    if (!categorySlug) {
      return NextResponse.json(
        {
          ok: false,
          error: "La categoría es obligatoria.",
        },
        {
          status: 400,
        }
      );
    }

    if (!subcategorySlug) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "La subcategoría es obligatoria.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isDonation &&
      parsedPrice !== null &&
      Number.isNaN(parsedPrice)
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "El precio no es válido.",
        },
        {
          status: 400,
        }
      );
    }

    const validSubcategories =
      PUBLISH_CATEGORIES[categorySlug];

    if (!validSubcategories) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Selecciona una categoría válida.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !validSubcategories.includes(
        subcategorySlug
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Selecciona una subcategoría válida.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !["PARTICULAR", "EMPRESA"].includes(
        sellerType
      )
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "El tipo de vendedor no es válido.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      sellerType === "EMPRESA" &&
      !businessName
    ) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "El nombre de la empresa es obligatorio.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // FOTOS
    // =====================================================

    const detailImages =
      Array.isArray(details?.images)
        ? details.images
        : [];

    const hasAtLeastOnePhoto =
      detailImages.length > 0 ||
      Boolean(imageUrl);

    if (!hasAtLeastOnePhoto) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Debes añadir al menos una foto.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // PRECIO OBLIGATORIO
    // =====================================================

    const requiresPrice =
      !["empleo", "servicios"].includes(
        categorySlug
      );

    if (
      !isDonation &&
      requiresPrice &&
      parsedPrice === null
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "El precio es obligatorio.",
        },
        {
          status: 400,
        }
      );
    }

    // =====================================================
    // VALIDACIÓN VEHÍCULOS
    // =====================================================

    const isVehicle =
      categorySlug === "motor" &&
      ["carros", "motos"].includes(
        subcategorySlug
      );

    if (isVehicle) {
      const motor =
        details?.motor &&
        typeof details.motor === "object"
          ? details.motor
          : null;

      if (!motor?.brand) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "La marca del vehículo es obligatoria.",
          },
          {
            status: 400,
          }
        );
      }

      if (!motor?.model) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "El modelo del vehículo es obligatorio.",
          },
          {
            status: 400,
          }
        );
      }

      if (!motor?.year) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "El año del vehículo es obligatorio.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // =====================================================
    // VALIDACIÓN CELULARES
    // =====================================================

    if (
      categorySlug === "celulares" &&
      subcategorySlug === "celulares"
    ) {
      const cellphone =
        details?.cellphone &&
        typeof details.cellphone === "object"
          ? details.cellphone
          : null;

      if (!cellphone?.brand) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "La marca del celular es obligatoria.",
          },
          {
            status: 400,
          }
        );
      }

      if (!cellphone?.model) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "El modelo del celular es obligatorio.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // =====================================================
    // VALIDACIÓN INMOBILIARIA
    // =====================================================

    if (categorySlug === "inmobiliaria") {
      const realEstate =
        details?.realEstate &&
        typeof details.realEstate === "object"
          ? details.realEstate
          : null;

      if (!realEstate?.deal) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Selecciona si el inmueble es venta o arriendo.",
          },
          {
            status: 400,
          }
        );
      }

      if (!realEstate?.sqm) {
        return NextResponse.json(
          {
            ok: false,
            error:
              "Los metros cuadrados del inmueble son obligatorios.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        REAL_ESTATE_SUBS_REQUIRING_ROOMS.includes(
          subcategorySlug
        )
      ) {
        if (!realEstate?.rooms) {
          return NextResponse.json(
            {
              ok: false,
              error:
                "El número de alcobas es obligatorio.",
            },
            {
              status: 400,
            }
          );
        }

        if (!realEstate?.baths) {
          return NextResponse.json(
            {
              ok: false,
              error:
                "El número de baños es obligatorio.",
            },
            {
              status: 400,
            }
          );
        }
      }
    }

    // =====================================================
    // VERIFICACIONES
    // =====================================================

    const approvedBusiness =
      isBusiness &&
      ownerEmail &&
      businessSlug &&
      !selectedBusiness
        ? await prisma.businessVerificationRequest.findFirst({
            where: {
              ownerEmail,
              businessSlug,
              status: "approved",
            },
          })
        : null;

    const approvedIdentity =
      !selectedBusiness && ownerEmail
        ? await prisma.identityVerificationRequest.findFirst({
            where: {
              ownerEmail,
              status: "approved",
            },
          })
        : null;

    // =====================================================
    // CREAR ANUNCIO
    // =====================================================

    const listing =
      await prisma.listing.create({
        data: {
          title,
          description,

          phone: finalPhone,
          contactUrl: finalContactUrl,
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

          isVerified: Boolean(
            isVerified ||
            approvedIdentity ||
            selectedBusiness?.isVerified
          ),

          imageUrl,
          details,

          // Propietario real del anuncio.
          // Para Kubo Empresas será el correo de la empresa,
          // aunque el administrador haya creado el anuncio.
          ownerEmail,
          ownerName,
          ownerImage,

          // =================================================
          // KUBO EMPRESAS
          // =================================================

          businessId:
            selectedBusiness?.id ?? null,

          isBusiness,

          businessName:
            businessName || null,

          businessLogo:
            selectedBusiness?.logo || null,

          businessType:
            selectedBusiness?.businessType ||
            null,

          businessDescription:
            businessDescription || null,

          businessWebsite:
            businessWebsite || null,

          businessInstagram:
            businessInstagram || null,

          businessFacebook:
            businessFacebook || null,

          businessWhatsapp:
            businessWhatsapp || null,

          businessSlug,

          businessVerified:
            selectedBusiness
              ? selectedBusiness.isVerified
              : Boolean(approvedBusiness),
        },
      });

    // Invalida la Home cacheada para que el anuncio
    // nuevo aparezca sin esperar al revalidate periódico.
    revalidatePath("/");

    revalidatePath("/buscar");

    if (selectedBusiness) {
      revalidatePath("/admin/businesses");
      revalidatePath(
        `/admin/businesses/${selectedBusiness.id}`
      );
    }

    // =====================================================
    // ESTADO DE VERIFICACIÓN
    // =====================================================

    const accountVerification =
      await prisma.accountVerification.findUnique({
        where: {
          email_type: {
            email: ownerEmail,
            type: isBusiness
              ? "EMPRESA"
              : "PARTICULAR",
          },
        },
        select: {
          status: true,
        },
      });

    return NextResponse.json({
      ok: true,
      listing,
      verificationStatus:
        accountVerification?.status ?? null,
    });
  } catch (error: any) {
    console.error(
      "POST /api/listings error:",
      error
    );

    return NextResponse.json(
      {
        ok: false,
        error:
          error?.message ??
          "Error creando anuncio.",
      },
      {
        status: 500,
      }
    );
  }
}