import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import BusinessVideoForm from "@/components/BusinessVideoForm";

export default async function BusinessVideosPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!email) {
    redirect("/api/auth/signin?callbackUrl=/empresa/videos");
  }

  const businesses = await prisma.business.findMany({
    where: {
      ownerEmail: { equals: email, mode: "insensitive" },
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      logo: true,
      isVerified: true,
      video: {
        select: {
          id: true,
          videoUrl: true,
          thumbnailUrl: true,
          description: true,
          categorySlug: true,
          city: true,
          durationSeconds: true,
          status: true,
          adminNote: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[720px] space-y-6">
        <Link
          href="/empresa"
          className="inline-flex items-center gap-2 text-sm font-black text-[#0f3c8c]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel de empresa
        </Link>

        <header>
          <p className="text-xs font-black uppercase tracking-wide text-[#0f3c8c]">
            Kubo Empresas
          </p>
          <h1 className="mt-1 text-3xl font-black text-slate-900">
            Promociona tu empresa con un video
          </h1>
          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            Sube un video vertical de 15 a 60 segundos. Nuestro equipo lo revisará
            antes de publicarlo en <strong>/videos</strong>. Solo se permite un
            video activo por empresa.
          </p>
        </header>

        {businesses.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              No tienes ninguna empresa activa asociada a tu cuenta.
            </p>
          </div>
        ) : (
          <BusinessVideoForm businesses={businesses} />
        )}
      </div>
    </div>
  );
}
