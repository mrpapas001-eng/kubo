"use client";

import { useRouter } from "next/navigation";

type AdminReportActionsProps = {
  listingId: string;
  reportId: string;
  reportStatus?: string;
  listingStatus?: string;
};

export default function AdminReportActions({
  listingId,
  reportId,
  reportStatus,
  listingStatus,
}: AdminReportActionsProps) {
  const router = useRouter();
  const isResolved = reportStatus === "resolved";
  const isListingDeleted = listingStatus === "deleted";

  async function hideListing() {
    const ok = confirm("¿Seguro que quieres ocultar este anuncio?");

    if (!ok) return;

    const res = await fetch("/api/admin/hide-listing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listingId }),
    });

    if (!res.ok) {
      alert("No se pudo ocultar el anuncio");
      return;
    }

    alert("Anuncio ocultado");
    router.refresh();
  }

  async function resolveReport() {
    const ok = confirm("¿Marcar este reporte como resuelto?");

    if (!ok) return;

    const res = await fetch("/api/admin/resolve-report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reportId }),
    });

    if (!res.ok) {
      alert("No se pudo resolver el reporte");
      return;
    }

    alert("Reporte marcado como resuelto");
    router.refresh();
  }

  async function deleteListing() {
    const ok = confirm(
      "¿Seguro que quieres eliminar este anuncio?"
    );

    if (!ok) return;

    const res = await fetch("/api/admin/delete-listing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listingId }),
    });

    if (!res.ok) {
      alert("No se pudo eliminar el anuncio");
      return;
    }

    alert("Anuncio eliminado");
    router.refresh();
  }

  return (
    <>
      {!isListingDeleted ? (
        <button
          type="button"
          onClick={hideListing}
          className="flex h-11 items-center justify-center rounded-2xl bg-yellow-400 px-5 text-sm font-black text-slate-900 hover:bg-yellow-500"
        >
          Ocultar
        </button>
      ) : null}

      {!isResolved ? (
        <button
          type="button"
          onClick={resolveReport}
          className="flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700"
        >
          Resolver
        </button>
      ) : null}

      {!isListingDeleted ? (
        <button
          type="button"
          onClick={deleteListing}
          className="flex h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700"
        >
          Eliminar
        </button>
      ) : null}
    </>
  );
}
