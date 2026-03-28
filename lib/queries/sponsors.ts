import { prisma } from "../db";

export async function getHomeSponsors() {
  const sponsors = await prisma.sponsorAd.findMany({
    orderBy: { createdAt: "desc" },
  });

  console.log("HOME SPONSORS COUNT:", sponsors.length);
  console.log("FIRST SPONSOR:", sponsors[0]);

  return sponsors;
}