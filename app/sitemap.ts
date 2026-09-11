import { prisma } from "@/lib/db";

export default async function sitemap() {
  const baseUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://www.kuboanuncios.com"
      : "http://localhost:3000")
  ).replace(/\/+$/, "");

  const listings = await prisma.listing.findMany({
    select: { id: true },
  });

  const listingUrls = listings.map((item) => ({
    url: `${baseUrl}/listing/${item.id}`,
  }));

  return [
    {
      url: baseUrl,
    },
    {
      url: `${baseUrl}/buscar`,
    },
    {
      url: `${baseUrl}/categoria/motor`,
    },
    {
      url: `${baseUrl}/categoria/inmobiliaria`,
    },
    ...listingUrls,
  ];
}