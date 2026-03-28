import { prisma } from "../db";

type GetHomeListingsArgs = {
  take?: number;
  skip?: number;
};

export async function getHomeListings(args: GetHomeListingsArgs = {}) {
  const take = args.take ?? 12;
  const skip = args.skip ?? 0;

  const listings = await prisma.listing.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take,
    skip,
  });

  return listings;
}