import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { attachAccountVerification } from "@/lib/accountVerification";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json([]);
  }

  const idArray = ids.split(",");

  const listings = await prisma.listing.findMany({
    where: {
      id: {
        in: idArray,
      },
      status: "active",
    },
  });

  return NextResponse.json(await attachAccountVerification(listings));
}
