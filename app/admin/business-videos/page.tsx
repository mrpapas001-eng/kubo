import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Clapperboard } from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { isAdminEmail } from "@/lib/admin";
import { prisma } from "@/lib/db";
import AdminBusinessVideoActions from "@/components/AdminBusinessVideoActions";

export default async function AdminBusinessVideosPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  const videos = await prisma.businessVideo.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      videoUrl: true,
      description: true,
      categorySlug: true,
      city: true,
      durationSeconds: true,
      createdAt: true,
      business: {
        select: {
          id: true,
          name: true,
          slug: true,
          isVerified: true,
        },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-slate-900 md:text-4xl">
              Videos de empresas
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Revisa y aprueba los videos pendientes antes de publicarlos en /videos.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700"
          >
            Panel
          </Link>
        </div>

        {videos.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <Clapperboard className="mx-auto h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm font-medium text-slate-500">
              No hay videos pendientes de revisión.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {videos.map((video) => (
              <div
                key={video.id}
                className="grid gap-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-[200px_1fr] md:p-6"
              >
                <video
                  src={video.videoUrl}
                  className="aspect-[9/16] w-full rounded-2xl bg-black object-cover"
                  controls
                  preload="metadata"
                />

                <div className="flex flex-col justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#e8f0ff] px-3 py-1 text-xs font-black uppercase text-[#0f3c8c]">
                        {video.business?.name ?? "Empresa"}
                      </span>

                      {!video.business?.isVerified ? (
                        <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase text-red-700">
                          Empresa sin verificar
                        </span>
                      ) : null}
                    </div>

                    <p className="mt-3 max-w-[600px] text-sm font-medium leading-relaxed text-slate-600">
                      {video.description}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                      <span>Categoría: {video.categorySlug}</span>
                      <span>Ciudad: {video.city}</span>
                      <span>Duración declarada: {video.durationSeconds}s</span>
                    </div>
                  </div>

                  <AdminBusinessVideoActions videoId={video.id} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
