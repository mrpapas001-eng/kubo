import { prisma } from "@/lib/db";

export const FEATURED_DAILY_LIMIT = 5;
export const PREMIUM_DAILY_LIMIT = 2;

// Lanzamiento: 15 días calendario en Colombia. Se puede cambiar sin tocar código.
const CAMPAIGN_START = process.env.KUBO_LAUNCH_PROMO_START ?? "2026-08-20";
const CAMPAIGN_END = process.env.KUBO_LAUNCH_PROMO_END ?? "2026-09-03";

function colombiaDateKey(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function boundsForColombiaDay(day: string) {
  const [year, month, date] = day.split("-").map(Number);
  // Colombia es UTC-5 todo el año: 00:00 local = 05:00 UTC.
  const start = new Date(Date.UTC(year, month - 1, date, 5, 0, 0));
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
  return { start, end };
}

export function getLaunchPromotionState(now = new Date()) {
  const day = colombiaDateKey(now);
  return {
    day,
    active: day >= CAMPAIGN_START && day <= CAMPAIGN_END,
    campaignStart: CAMPAIGN_START,
    campaignEnd: CAMPAIGN_END,
    ...boundsForColombiaDay(day),
  };
}

export async function getLaunchQuota() {
  const state = getLaunchPromotionState();
  const marker = `LANZAMIENTO:${state.day}`;
  const [featuredUsed, premiumUsed] = await Promise.all([
    prisma.listing.count({ where: { isFeatured: true, premiumPlan: marker } }),
    prisma.listing.count({ where: { isPremium: true, premiumPlan: marker } }),
  ]);

  return {
    ...state,
    featuredUsed,
    premiumUsed,
    featuredRemaining: Math.max(0, FEATURED_DAILY_LIMIT - featuredUsed),
    premiumRemaining: Math.max(0, PREMIUM_DAILY_LIMIT - premiumUsed),
  };
}

export async function claimLaunchPromotion(
  listingId: string,
  userEmail: string,
  kind: "featured" | "premium"
) {
  const state = getLaunchPromotionState();
  if (!state.active) throw new Error("CAMPAIGN_INACTIVE");

  const marker = `LANZAMIENTO:${state.day}`;
  const limit = kind === "premium" ? PREMIUM_DAILY_LIMIT : FEATURED_DAILY_LIMIT;

  return prisma.$transaction(async (tx) => {
    // Serializa las concesiones del día: evita que dos clics se lleven el último cupo.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`kubo-launch-${state.day}`}))`;

    const listing = await tx.listing.findUnique({ where: { id: listingId } });
    if (!listing) throw new Error("NOT_FOUND");
    if (listing.ownerEmail?.toLowerCase().trim() !== userEmail) throw new Error("FORBIDDEN");
    if (!listing.isBusiness) throw new Error("BUSINESS_ONLY");
    if (listing.status !== "active") throw new Error("NOT_ACTIVE");
    if (listing.createdAt < state.start || listing.createdAt >= state.end) throw new Error("NOT_TODAY");
    if (listing.isFeatured || listing.isPremium) throw new Error("ALREADY_PROMOTED");

    const alreadyClaimed = await tx.listing.count({
      where: {
        ownerEmail: { equals: userEmail, mode: "insensitive" },
        premiumPlan: marker,
        OR: [{ isFeatured: true }, { isPremium: true }],
      },
    });
    if (alreadyClaimed > 0) throw new Error("USER_DAILY_LIMIT");

    const used = await tx.listing.count({
      where: {
        premiumPlan: marker,
        ...(kind === "premium" ? { isPremium: true } : { isFeatured: true }),
      },
    });
    if (used >= limit) throw new Error("SOLD_OUT");

    const until = new Date(Date.now() + 48 * 60 * 60 * 1000);
    return tx.listing.update({
      where: { id: listingId },
      data:
        kind === "premium"
          ? {
              isPremium: true,
              isFeatured: false,
              premiumPlan: marker,
              premiumUntil: until,
              featuredUntil: null,
            }
          : {
              isFeatured: true,
              isPremium: false,
              premiumPlan: marker,
              featuredUntil: until,
              premiumUntil: null,
            },
    });
  });
}
