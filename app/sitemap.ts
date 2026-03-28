import { prisma } from "@/lib/db";

export default async function sitemap() {
  const listings = await prisma.listing.findMany({
    select: { id: true },
  });

  const listingUrls = listings.map((item) => ({
    url: `http://localhost:3000/listing/${item.id}`,
  }));

  return [
    {
      url: "http://localhost:3000",
    },
    {
      url: "http://localhost:3000/buscar",
    },
    {
      url: "http://localhost:3000/categoria/motor",
    },
    {
      url: "http://localhost:3000/categoria/inmobiliaria",
    },
    ...listingUrls,
  ];
}