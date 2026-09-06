import { prisma } from "../db";
import { attachAccountVerification } from "../accountVerification";
import { VISIBILITY_PROMOTIONS_ENABLED } from "../features";

type GetHomeListingsArgs = {
  take?: number;
  skip?: number;
};

type GetListingsArgs = {
  take?: number;
  skip?: number;
  categorySlug?: string;
  subcategorySlug?: string;
};

function normalizePromotionStatus(listing: any) {
  const now = new Date();

  const isPremiumActive =
    VISIBILITY_PROMOTIONS_ENABLED &&
    listing.isPremium &&
    listing.premiumUntil &&
    new Date(listing.premiumUntil).getTime() > now.getTime();

  const isFeaturedActive =
    VISIBILITY_PROMOTIONS_ENABLED &&
    listing.isFeatured &&
    listing.featuredUntil &&
    new Date(listing.featuredUntil).getTime() > now.getTime();

  return {
    ...listing,
    isPremium: Boolean(isPremiumActive),
    isFeatured: Boolean(isFeaturedActive),
    isBusiness: Boolean(listing.isBusiness),
    businessVerified: Boolean(listing.businessVerified),
  };
}

function sortListings(a: any, b: any) {
  if (a.businessVerified !== b.businessVerified) {
    return a.businessVerified ? -1 : 1;
  }

  if (VISIBILITY_PROMOTIONS_ENABLED) {
    if (a.isPremium !== b.isPremium) return a.isPremium ? -1 : 1;
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
  }

  return (
    new Date(b.createdAt ?? 0).getTime() -
    new Date(a.createdAt ?? 0).getTime()
  );
}

export async function getHomeListings(
  args: GetHomeListingsArgs = {}
) {
  const take = args.take ?? 12;
  const skip = args.skip ?? 0;

  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 250,
  });

  const listingsWithVerification =
    await attachAccountVerification(listings);

  const normalized = listingsWithVerification
    .map(normalizePromotionStatus)
    .sort(sortListings);

  // =====================================================
  // PROMOCIONADOS PRIMERO
  // =====================================================

  const promoted = normalized.filter(
  (item: any) =>
    item.isPremium ||
    item.isFeatured
);

  const promotedIds = new Set(
    promoted.map((item: any) => item.id)
  );

  // =====================================================
  // RESTO, AGRUPADO POR CATEGORÍA
  // =====================================================

  const regular = normalized.filter(
    (item: any) => !promotedIds.has(item.id)
  );

  const groups = new Map<string, any[]>();

  for (const item of regular) {
    const category = String(
      item.categorySlug ?? "otros"
    );

    if (!groups.has(category)) {
      groups.set(category, []);
    }

    groups.get(category)!.push(item);
  }

  const mixedRegular: any[] = [];

  while (
    Array.from(groups.values()).some(
      (items) => items.length > 0
    )
  ) {
    for (const items of groups.values()) {
      const next = items.shift();

      if (next) {
        mixedRegular.push(next);
      }
    }
  }

  // Promocionados conservan prioridad.
  // Después vienen anuncios variados por categoría.
  const finalListings = [
    ...promoted,
    ...mixedRegular,
  ];

  return finalListings.slice(
    skip,
    skip + take
  );
}

export async function getListings(args: GetListingsArgs = {}) {
  const take = args.take ?? 24;
  const skip = args.skip ?? 0;
  const { categorySlug, subcategorySlug } = args;

  const listings = await prisma.listing.findMany({
where: {
  status: "active",
  ...(categorySlug ? { categorySlug } : {}),
  ...(subcategorySlug ? { subcategorySlug } : {}),
},
    orderBy: {
      createdAt: "desc",
    },
    take: take + skip + 100,
  });

  const listingsWithVerification = await attachAccountVerification(listings);

  return listingsWithVerification
    .map(normalizePromotionStatus)
    .sort(sortListings)
    .slice(skip, skip + take);
}

export async function getHomeReels() {
const listings = await prisma.listing.findMany({
  where: {
    status: "active",
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 100,
});

  const listingsWithVerification = await attachAccountVerification(listings);

  return listingsWithVerification
    .map(normalizePromotionStatus)
    .sort(sortListings)
    .filter((listing: any) => {
      try {
        const details =
          typeof listing.details === "string"
            ? JSON.parse(listing.details)
            : listing.details;

        return typeof details?.reelUrl === "string" && details.reelUrl.trim();
      } catch {
        return false;
      }
    })
    .slice(0, 10)
    .map((listing: any) => {
      const details =
        typeof listing.details === "string"
          ? JSON.parse(listing.details)
          : listing.details;

      return {
        id: listing.id,
        title: listing.title,
        image: listing.imageUrl || "/placeholders/listing.jpg",
        badge: listing.accountVerificationType === "EMPRESA"
          ? "Empresa verificada"
          : listing.isPremium
            ? "Premium reel"
            : "Reel",
        href: `/listing/${listing.id}`,
        videoUrl: details.reelUrl,
        contactLabel: "Ver reel",
        contactUrl: details.reelUrl,
      };
    });
}
