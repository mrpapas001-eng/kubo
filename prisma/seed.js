const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed...");

  await prisma.sponsorAd.deleteMany();
  await prisma.listing.deleteMany();

  const now = new Date();
  const in30 = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await prisma.listing.create({
    data: {
      title: "BMW Serie 3 M-Sport 2024",
      description: "Único dueño, excelente estado.",
      price: 185000000,
      currency: "COP",
      city: "Medellín, Antioquia",
      categorySlug: "motor",
      subcategorySlug: "carros",
      template: "motor_car",
      sellerType: "dealer",
      isVerified: true,
      imageUrl:
        "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80",
      details: JSON.stringify({ year: 2024, km: 12000 })
    }
  });

  await prisma.sponsorAd.create({
    data: {
      title: "Chevrolet Colombia",
      subtitle: "Concesionario oficial",
      imageUrl:
        "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=1400&q=80",
      ctaText: "Ver catálogo",
      ctaUrl: "https://www.chevrolet.com.co",
      type: "BANNER_HERO",
      placement: "HOME_HERO",
      priority: 100,
      startAt: now,
      endAt: in30,
      isActive: true
    }
  });

  console.log("✅ Seed completado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });