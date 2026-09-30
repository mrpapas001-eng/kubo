import type { Metadata } from "next";
import Link from "next/link";

import ReelsSection from "@/components/ReelsSection";
import { getAllReels } from "@/lib/queries/home";

export const metadata: Metadata = {
  title: "Reels de anuncios | Kubo Anuncios",
  description:
    "Explora reels de anuncios en Kubo y desliza para descubrir publicaciones de forma rápida.",
};

export const revalidate = 60;

export default async function ReelsPage() {
  const reels = await getAllReels();

  if (reels.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 text-center text-white">
        <div>
          <h1 className="text-2xl font-black">Todavía no hay reels disponibles</h1>
          <p className="mt-2 text-sm text-white/70">
            Vuelve pronto para descubrir nuevos anuncios en video.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-900"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ReelsSection
      items={reels}
      autoOpen
      hideGallery
      closeHref="/"
    />
  );
}
