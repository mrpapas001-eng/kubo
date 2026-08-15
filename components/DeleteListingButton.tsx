"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  listingId: string;
  status?: string;
};

export default function DeleteListingButton({ listingId, status }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isHidden = status === "hidden";

  async function handleAction() {
    const ok = window.confirm(
      isHidden
        ? "¿Seguro que quieres reactivar este anuncio?"
        : "¿Seguro que quieres eliminar este anuncio?"
    );

    if (!ok) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/listings/${listingId}`, {
        method: isHidden ? "PATCH" : "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: isHidden
          ? JSON.stringify({
              status: "active",
            })
          : undefined,
      });

      const raw = await res.text();
      let data: any = null;

      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error("La API no devolvió JSON válido.");
      }

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo completar la acción.");
      }

      router.refresh();
    } catch (error: any) {
      alert(error?.message ?? "Error ejecutando la acción.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleAction}
      disabled={loading}
      className={`rounded-lg px-3 py-1 text-sm font-bold text-white shadow disabled:opacity-60 ${
        isHidden
          ? "bg-green-600 hover:bg-green-700"
          : "bg-red-600 hover:bg-red-700"
      }`}
    >
      {loading ? "Procesando..." : isHidden ? "Reactivar" : "Eliminar"}
    </button>
  );
}