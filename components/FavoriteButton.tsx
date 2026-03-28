"use client";

import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";

type Props = {
  listingId: string;
};

export default function FavoriteButton({ listingId }: Props) {
  const { data: session, status } = useSession();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      if (!listingId || status === "loading") return;

      if (!session?.user) {
        setIsFav(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/favorites/status?listingId=${encodeURIComponent(listingId)}`,
          { cache: "no-store" }
        );
        const data = await res.json();
        setIsFav(Boolean(data?.isFavorite));
      } catch {
        setIsFav(false);
      }
    }

    loadStatus();
  }, [listingId, session, status]);

  async function toggleFavorite(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!session?.user) {
      signIn("google");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId }),
      });

      const data = await res.json();

      if (data?.ok) {
        setIsFav(Boolean(data.isFavorite));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-2 shadow hover:bg-white disabled:opacity-60"
      aria-label={isFav ? "Quitar de favoritos" : "Guardar en favoritos"}
      type="button"
    >
      <Heart
        className={`h-5 w-5 ${
          isFav ? "fill-red-500 text-red-500" : "text-slate-600"
        }`}
      />
    </button>
  );
}