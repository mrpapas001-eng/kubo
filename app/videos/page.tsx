import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clapperboard } from "lucide-react";

import { prisma } from "@/lib/db";
import ReelsSection, { type ReelItem } from "@/components/ReelsSection";

export const metadata: Metadata = {
  title: "Videos de empresas en Colombia | Kubo Anuncios",
  description:
    "Descubre videos cortos de empresas verificadas en Kubo Anuncios: negocios, servicios y comercios cerca de ti en Colombia.",
};

export const revalidate = 60;

function buildWhatsappUrl(rawWhatsapp: string | null, rawPhone: string | null, businessName: string) {
  const source = rawWhatsapp || rawPhone || "";
  const cleanPhone = String(source).replace(/\D/g, "");
  if (!cleanPhone) return null;

  const countryNumber = cleanPhone.length === 10 ? `57${cleanPhone}` : cleanPhone;
  const text = `Hola, vi el video de ${businessName} en Kubo y quiero saber más.`;

  return `https://wa.me/${countryNumber}?text=${encodeURIComponent(text)}`;
}

export default async function VideosPage() {
  const videos = await prisma.businessVideo.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ approvedAt: "desc" }, { createdAt: "desc" }],
    take: 50,
    select: {
      id: true,
      videoUrl: true,
      thumbnailUrl: true,
      description: true,
      categorySlug: true,
      city: true,
      business: {
        select: {
          name: true,
          slug: true,
          logo: true,
          whatsapp: true,
          phone: true,
        },
      },
    },
  });

  const reels: ReelItem[] = videos.map((video) => {
    const businessName = video.business?.name || "Empresa en Kubo";
    const whatsappUrl = buildWhatsappUrl(
      video.business?.whatsapp ?? null,
      video.business?.phone ?? null,
      businessName
    );

    return {
      id: video.id,
      title: businessName,
      image: video.thumbnailUrl || video.business?.logo || "/placeholders/listing.jpg",
      videoUrl: video.videoUrl,
      badge: "Empresa",
      href: video.business?.slug ? `/company/${video.business.slug}` : undefined,
      ctaLabel: "Ver empresa",
      contactLabel: "WhatsApp",
      contactUrl: whatsappUrl ?? undefined,
      businessName,
      description: video.description,
      location: video.city,
    };
  });

  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 pb-28 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1180px]">
        <Link
          href="/"
          className="mb-5 inline-flex items-center gap-2 text-sm font-black text-[#0f3c8c]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Link>

        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-slate-700">
            <Clapperboard className="h-3.5 w-3.5" />
            Videos de empresas
          </div>

          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Conoce empresas de Kubo en video
          </h1>

          <p className="mt-2 max-w-2xl text-sm font-medium text-slate-500 md:text-base">
            Videos cortos de empresas verificadas, revisados por Kubo antes de publicarse.
          </p>
        </div>

        {reels.length > 0 ? (
          <ReelsSection items={reels} />
        ) : (
          <div className="rounded-[28px] border-2 border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#e8f0ff] text-[#0f3c8c]">
              <Clapperboard className="h-8 w-8" />
            </div>

            <h2 className="mt-5 text-xl font-black text-slate-900">
              Próximamente encontrarás videos de empresas cerca de ti
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-slate-500">
              Las empresas verificadas de Kubo pronto podrán mostrar su video promocional aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
