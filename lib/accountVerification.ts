import { prisma } from "@/lib/db";

type ListingWithOwner = {
  ownerEmail: string | null;
  sellerType: string;
};

export type AccountVerificationType = "PARTICULAR" | "EMPRESA";

export async function attachAccountVerification<T extends ListingWithOwner>(
  listings: T[]
): Promise<Array<T & { accountVerificationType: AccountVerificationType | null }>> {
  const emails = [
    ...new Set(
      listings
        .map((listing) => listing.ownerEmail?.toLowerCase().trim())
        .filter((email): email is string => Boolean(email))
    ),
  ];

  if (emails.length === 0) {
    return listings.map((listing) => ({
      ...listing,
      accountVerificationType: null,
    }));
  }

  const verifiedAccounts = await prisma.accountVerification.findMany({
    where: {
      email: { in: emails },
      status: "VERIFIED",
    },
    select: { email: true, type: true },
  });

  const verifiedTypes = new Set(
    verifiedAccounts.map((account) => `${account.email}:${account.type}`)
  );

  return listings.map((listing) => {
    const email = listing.ownerEmail?.toLowerCase().trim();
    const type: AccountVerificationType =
      listing.sellerType === "EMPRESA" ? "EMPRESA" : "PARTICULAR";

    return {
      ...listing,
      accountVerificationType:
        email && verifiedTypes.has(`${email}:${type}`) ? type : null,
    };
  });
}