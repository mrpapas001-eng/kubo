import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("DATABASE_URL =", process.env.DATABASE_URL);

  const listings = await prisma.listing.count();
  const sponsors = await prisma.sponsorAd.count();

  console.log("LISTINGS COUNT =", listings);
  console.log("SPONSORS COUNT =", sponsors);

  const firstListing = await prisma.listing.findFirst();
  const firstSponsor = await prisma.sponsorAd.findFirst();

  console.log("FIRST LISTING =", firstListing);
  console.log("FIRST SPONSOR =", firstSponsor);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });