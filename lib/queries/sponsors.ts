import { prisma } from "../db";

export type SponsorAd = {
  id: string;
  title: string;
  subtitle?: string | null;
  imageUrl?: string | null;
  ctaText?: string | null;
  ctaUrl?: string | null;
  type: string;
  placement: string;
  categorySlug?: string | null;
  priority: number;
  startAt: Date;
  endAt: Date;
  isActive: boolean;
  createdAt: Date;
};

export type HomeSponsors = {
  main: SponsorAd[];
  side: SponsorAd[];
  feed: SponsorAd[];
};

export async function getHomeSponsors(): Promise<HomeSponsors> {
  const now = new Date();

  const sponsors = await prisma.sponsorAd.findMany({
    where: {
      isActive: true,
      startAt: { lte: now },
      endAt: { gte: now },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });

  return {
    main: sponsors.filter((s) => s.placement === "home-main"),
    side: sponsors.filter((s) => s.placement === "home-side"),
    feed: sponsors.filter((s) => s.placement === "home-feed"),
  };
}

export async function getCategorySponsors(
  categorySlug: string
): Promise<SponsorAd[]> {
  const now = new Date();

  return prisma.sponsorAd.findMany({
    where: {
      isActive: true,
      placement: "category",
      categorySlug,
      startAt: { lte: now },
      endAt: { gte: now },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
}

export async function getCategoryFeedSponsors(
  categorySlug: string
): Promise<SponsorAd[]> {
  const now = new Date();

  return prisma.sponsorAd.findMany({
    where: {
      isActive: true,
      placement: "category-feed",
      categorySlug,
      startAt: { lte: now },
      endAt: { gte: now },
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
}