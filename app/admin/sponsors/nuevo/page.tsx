import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";
import AdminSponsorForm from "@/components/AdminSponsorForm";

function toDateTimeLocal(value: Date) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 16);
}

export default async function NewSponsorPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  const businessRows = await prisma.listing.findMany({
    where: {
      isBusiness: true,
      status: "active",
      businessSlug: {
        not: null,
      },
    },
    select: {
      businessSlug: true,
      businessName: true,
    },
    orderBy: {
      businessName: "asc",
    },
  });

  const businessMap = new Map<string, string>();

  for (const row of businessRows) {
    if (!row.businessSlug) continue;

    businessMap.set(
      row.businessSlug,
      row.businessName || row.businessSlug
    );
  }

  const businesses = Array.from(businessMap.entries()).map(
    ([slug, name]) => ({
      slug,
      name,
    })
  );

  const listingRows = await prisma.listing.findMany({
    where: {
      status: "active",
    },
    select: {
      id: true,
      title: true,
      businessName: true,
      city: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 200,
  });

  const listings = listingRows.map((item) => ({
    id: item.id,
    title: [
      item.title,
      item.businessName ? `— ${item.businessName}` : "",
      item.city ? `(${item.city})` : "",
    ]
      .filter(Boolean)
      .join(" "),
  }));

  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + 30);

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-28 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[900px]">
        <Link
          href="/admin/sponsors"
          className="text-sm font-black text-[#0f3c8c]"
        >
          ← Volver a sponsors
        </Link>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <p className="text-xs font-black uppercase tracking-wide text-[#0f3c8c]">
            Kubo admin
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            Nuevo sponsor
          </h1>

          <p className="mt-2 text-sm font-medium text-slate-500">
            Crea una nueva publicidad patrocinada para Kubo.
          </p>

          <AdminSponsorForm
            mode="create"
            sponsor={{
              id: "",
              title: "",
              subtitle: "",
              imageUrl: "",
              ctaText: "Ver más",
              ctaUrl: "",
              placement: "home-main",
              categorySlug: "",
              priority: 0,
              startAt: toDateTimeLocal(now),
              endAt: toDateTimeLocal(end),
              isActive: true,
            }}
            businesses={businesses}
            listings={listings}
          />
        </div>
      </div>
    </div>
  );
}