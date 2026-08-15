import { prisma } from "../db";

export async function getHomeSponsors() {
  const sponsors = await prisma.sponsorAd.findMany({
    orderBy: { createdAt: "desc" },
  });

  return sponsors;
}
