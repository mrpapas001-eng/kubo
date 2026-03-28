import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpiar primero
  await prisma.listing.deleteMany();
  await prisma.sponsorAd.deleteMany(); // ✅ también limpiamos sponsors

  const cities = [
    "Madrid, Cundinamarca",
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
  ];

  const categories = [
    { slug: "inmuebles", sub: "apartamentos" },
    { slug: "vehiculos", sub: "carros" },
    { slug: "empleo", sub: "ofertas" },
    { slug: "servicios", sub: "hogar" },
  ];

  const listings = Array.from({ length: 30 }).map((_, i) => {
    const cat = categories[i % categories.length];

    return {
      title: `Anuncio Demo ${i + 1}`,
      description: `Este es el anuncio número ${i + 1} generado automáticamente para pruebas.`,
      price: 1000000 + i * 500000,
      currency: "COP",
      city: cities[i % cities.length],
      categorySlug: cat.slug,
      subcategorySlug: cat.sub,
      template: "GENERAL",
      sellerType: i % 2 === 0 ? "PARTICULAR" : "EMPRESA",
      isVerified: i % 3 === 0,
      imageUrl: null,
      details: {},
    };
  });

  await prisma.listing.createMany({ data: listings });

  // ✅ Sponsors demo (BANNER + CARD)
  await prisma.sponsorAd.createMany({
    data: [
      {
        title: "Chevrolet Onix 2026",
        subtitle: "Desde $65.000.000 COP. ¡Estrena hoy!",
        imageUrl:
          "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200",
        ctaText: "Ver Oferta",
        ctaUrl: "#",
        type: "BANNER",
        placement: "HOME_TOP",
        priority: 0,
        startAt: new Date(),
        endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        isActive: true,
      },
      {
        title: "Claro empresas",
        subtitle: "Conectividad y soluciones para tu negocio.",
        imageUrl:
          "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=1200",
        ctaText: "Conocer más",
        ctaUrl: "#",
        type: "CARD",
        placement: "HOME_SIDEBAR",
        priority: 0,
        startAt: new Date(),
        endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        isActive: true,
      },
    ],
  });

  console.log("✅ 30 listings creados correctamente");
  console.log("✅ 2 sponsors creados correctamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });