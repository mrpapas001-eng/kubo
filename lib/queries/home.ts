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

function getTikTokPostId(value: string) {
  const match = value.match(/tiktok\.com\/[^\s?#]*\/video\/(\d+)/i);
  return match?.[1] ?? null;
}

async function resolveTikTokPlayerUrl(value: string) {
  let postId = getTikTokPostId(value);

  if (!postId && /^https:\/\/(?:vt|vm)\.tiktok\.com\//i.test(value)) {
    try {
      const response = await fetch(value, {
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/153 Safari/537.36",
        },
        next: { revalidate: 86400 },
      });

      postId = getTikTokPostId(response.url);
    } catch {}
  }

  if (!postId) {
    try {
      const response = await fetch(
        `https://www.tiktok.com/oembed?url=${encodeURIComponent(value)}`,
        { next: { revalidate: 86400 } }
      );

      if (response.ok) {
        const data = await response.json();
        const html = String(data?.html ?? "");
        postId = html.match(/data-video-id=["'](\d+)["']/i)?.[1] ?? null;
      }
    } catch {}
  }

  if (!postId) return null;

  return (
    `https://www.tiktok.com/player/v1/${postId}` +
    "?autoplay=1&loop=1&controls=1&play_button=0&rel=0&muted=1"
  );
}

async function getExternalPlayerUrl(value: string) {
  const url = value.trim();

  if (/^https:\/\/(?:www\.)?facebook\.com\/(?:reel|watch|[^/]+\/videos)\//i.test(url)) {
    return (
      "https://www.facebook.com/plugins/video.php?href=" +
      encodeURIComponent(url) +
      "&show_text=false&autoplay=true&mute=true&width=500"
    );
  }

  if (/^https:\/\/(?:www\.|vt\.|vm\.)?tiktok\.com\//i.test(url)) {
    return resolveTikTokPlayerUrl(url);
  }

  const youtubeMatch = url.match(
    /(?:youtube\.com\/shorts\/|youtu\.be\/)([A-Za-z0-9_-]{6,})/i
  );

  if (youtubeMatch?.[1]) {
    const id = youtubeMatch[1];

    return (
      `https://www.youtube.com/embed/${id}` +
      `?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}&controls=1`
    );
  }

  const instagramMatch = url.match(
    /instagram\.com\/(?:reel|reels)\/([A-Za-z0-9_-]+)/i
  );

  if (instagramMatch?.[1]) {
    return `https://www.instagram.com/reel/${instagramMatch[1]}/embed/`;
  }

  return null;
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

  const reelListings = listingsWithVerification
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
    });

  return Promise.all(
    reelListings.map(async (listing: any) => {
      const details =
        typeof listing.details === "string"
          ? JSON.parse(listing.details)
          : listing.details;

      const reelUrl = String(details.reelUrl).trim();
      const native = isNativeReelUrl(reelUrl);
      const externalPlayerUrl = native
        ? undefined
        : (await getExternalPlayerUrl(reelUrl)) ?? undefined;

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
        externalPlayerUrl,
      };
    })
  );
}

export async function getHomeReels() {
  const reels = await getListingReels(100, false);
  return reels.slice(0, 10);
}

export async function getAllReels() {
  return getListingReels(undefined, false);
}
