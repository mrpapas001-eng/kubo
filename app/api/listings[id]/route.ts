import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
  });

  return NextResponse.json({ listing });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();

  const updated = await prisma.listing.update({
    where: { id },
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      phone: body.phone,
    },
  });

  return NextResponse.json({ ok: true, listing: updated });
}