"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  listingId: string;
  status: string;
  hiddenReason: string | null;
};

export default function BusinessListingActions({
  listingId,
  status,
  hiddenReason,
}: Props) {
  const router = useRouter();
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function changeStatus(nextStatus: "active" | "hidden") {
    setWorking(true);
    setError(null);

    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setError(data?.error || "No se pudo cambiar el estado del anuncio.");
        return;
      }

      router.refresh();
    } catch {
      setError("No se pudo cambiar el estado del anuncio.");
    } finally {
      setWorking(false);
    }
  }

  async function deleteListing() {
    const confirmed = window.confirm(
      "¿Seguro que quieres eliminar este anuncio? Dejará de aparecer publicado."
    );

    if (!confirmed) return;

    setWorking(true);
    setError(null);

    try {
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        setError(data?.error || "No se pudo eliminar el anuncio.");
        return;
      }

      router.refresh();
    } catch {
      setError("No se pudo eliminar el anuncio.");
    } finally {
      setWorking(false);
    }
  }

  if (status === "deleted") {
    return (
      <span className="inline-flex h-8 items-center rounded-lg bg-red-50 px-3 text-xs font-black text-red-600">
        Eliminado
      </span>
    );
  }

  const hiddenByModeration =
    status === "hidden" && hiddenReason === "moderation";

  return (
    <>
      {status === "active" ? (
        <button
          type="button"
          disabled={working}
          onClick={() => changeStatus("hidden")}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-amber-200 bg-amber-50 px-3 text-xs font-black text-amber-700 disabled:opacity-50"
        >
          {working ? "Procesando..." : "Ocultar"}
        </button>
      ) : hiddenByModeration ? (
        <span className="inline-flex h-8 items-center rounded-lg bg-amber-50 px-3 text-xs font-black text-amber-700">
          Ocultado por moderación
        </span>
      ) : (
        <button
          type="button"
          disabled={working}
          onClick={() => changeStatus("active")}
          className="inline-flex h-8 items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-black text-emerald-700 disabled:opacity-50"
        >
          {working ? "Procesando..." : "Volver a publicar"}
        </button>
      )}

      <button
        type="button"
        disabled={working}
        onClick={deleteListing}
        className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-black text-red-600 disabled:opacity-50"
      >
        Eliminar
      </button>

      {error ? (
        <span className="w-full text-xs font-bold text-red-600">{error}</span>
      ) : null}
    </>
  );
}
