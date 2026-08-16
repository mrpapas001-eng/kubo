"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  listingId: string;
};

export default function ReactivateListingButton({ listingId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleReactivate() {
    const ok = window.confirm("¿Seguro que quieres reactivar este anuncio?");

    if (!ok) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "active" }),
      });

      const raw = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("La API no devolvió JSON válido.");
      }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo reactivar el anuncio.");
      }

      router.refresh();
    } catch (error: any) {
      alert(error?.message ?? "Error reactivando el anuncio.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleReactivate}
      disabled={loading}
      className="mt-2 w-full rounded-xl bg-green-600 py-2 text-xs font-black text-white shadow disabled:opacity-60 hover:bg-green-700"
    >
      {loading ? "Reactivando..." : "Reactivar anuncio"}
    </button>
  );
}
