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

function isNativeReelUrl(value: unknown) {
  return (
    typeof value === "string" &&
    /^https:\/\/.+\.(mp4|webm|mov)(\?.*)?$/i.test(value.trim())
  );
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

export async function getHomeListings(args: GetHomeListingsArgs = {}) {
  const take = args.take ?? 12;
  const skip = args.skip ?? 0;

  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
    },
    orderBy: [
      { createdAt: "desc" as const },
      { id: "desc" as const },
    ],
    take: take + skip,
  });

  const listingsWithVerification =
    await attachAccountVerification(listings);

  return listingsWithVerification
    .map(normalizePromotionStatus)
    .slice(skip, skip + take);
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

async function getListingReels(maxListings?: number, nativeOnly = false) {
  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
    },
    orderBy: {
      createdAt: "desc",
    },
    ...(maxListings ? { take: maxListings } : {}),
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

        const reelUrl =
          typeof details?.reelUrl === "string"
            ? details.reelUrl.trim()
            : "";

        return Boolean(reelUrl) && (!nativeOnly || isNativeReelUrl(reelUrl));
      } catch {
        return false;
      }
    })
    .map((listing: any) => {
      const details =
        typeof listing.details === "string"
          ? JSON.parse(listing.details)
          : listing.details;

      const reelUrl = String(details.reelUrl).trim();
      const native = isNativeReelUrl(reelUrl);

      return {
        id: listing.id,
        title: listing.title,
        image: listing.imageUrl || "/placeholders/listing.jpg",
        badge:
          listing.accountVerificationType === "EMPRESA"
            ? "Empresa verificada"
            : listing.isPremium
              ? "Premium reel"
              : "Reel",
        href: `/listing/${listing.id}`,
        videoUrl: native ? reelUrl : undefined,
        externalUrl: native ? undefined : reelUrl,
      };
    });
}

export async function getHomeReels() {
  const reels = await getListingReels(100, false);
  return reels.slice(0, 10);
}

export async function getAllReels() {
  return getListingReels(undefined, false);
}
