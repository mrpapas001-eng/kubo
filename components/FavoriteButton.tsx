"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

type Props = {
  listingId: string;
  variant?: "floating" | "inline";
};

export default function FavoriteButton({ listingId, variant = "floating" }: Props) {
  const { data: session, status } = useSession();

  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      if (!listingId) {
        if (!cancelled) {
          setIsFav(false);
          setChecking(false);
        }
        return;
      }

      if (status === "loading") return;

      if (!session?.user?.email) {
        if (!cancelled) {
          setIsFav(false);
          setChecking(false);
        }
        return;
      }

      try {
        setChecking(true);

        const res = await fetch(
          `/api/favorites/status?listingId=${encodeURIComponent(listingId)}`,
          { cache: "no-store" }
        );

        const raw = await res.text();
        let data: any = null;

        try {
          data = JSON.parse(raw);
        } catch {
          data = null;
        }

        if (!cancelled) setIsFav(Boolean(data?.isFavorite));
      } catch {
        if (!cancelled) setIsFav(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    loadStatus();

    return () => {
      cancelled = true;
    };
  }, [listingId, session?.user?.email, status]);

  async function toggleFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();

    if (loading || checking || !listingId) return;

    if (!session?.user?.email) {
      signIn("google");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      const raw = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("La API de favoritos no devolvió JSON válido.");
      }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo actualizar favorito.");
      }

      setIsFav(Boolean(data.isFavorite));
    } catch (error) {
      console.error("FavoriteButton toggle error:", error);
    } finally {
      setLoading(false);
    }
  }

  const isInline = variant === "inline";

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading || checking}
      className={
        isInline
          ? "inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          : "absolute right-2 top-2 z-20 rounded-full bg-white/90 p-1.5 shadow hover:bg-white disabled:cursor-not-allowed disabled:opacity-60 md:right-3 md:top-3 md:p-2"
      }
      aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
      aria-pressed={isFav}
      type="button"
      title={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
    >
      <Heart
        className={`h-4 w-4 transition md:h-5 md:w-5 ${
          isFav ? "fill-red-500 text-red-500" : "text-slate-600"
        }`}
      />
      {isInline ? (
        <span>{checking ? "Revisando..." : isFav ? "Guardado" : "Guardar"}</span>
      ) : null}
    </button>
  );
}
