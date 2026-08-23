"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  listingId: string;
};

export default function HideListingButton({ listingId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleHide() {
    const ok = window.confirm(
      "¿Seguro que quieres desactivar este anuncio? Dejará de aparecer públicamente, pero podrás reactivarlo después."
    );

    if (!ok) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "hidden",
        }),
      });

      const raw = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("La API no devolvió JSON válido.");
      }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo desactivar el anuncio.");
      }

      router.refresh();
    } catch (error: any) {
      alert(error?.message ?? "Error desactivando el anuncio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleHide}
      disabled={loading}
      className="rounded-lg bg-slate-600 px-3 py-1 text-sm font-bold text-white shadow hover:bg-slate-700 disabled:opacity-60"
    >
      {loading ? "Desactivando..." : "Desactivar"}
    </button>
  );
}