"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type AdminAidRequestActionsProps = {
  requestId: string;
  status: string;
};

export default function AdminAidRequestActions({
  requestId,
  status,
}: AdminAidRequestActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function review(
    action: "approve" | "reject" | "match" | "complete",
    extra?: { rejectionReason?: string; adminNotes?: string }
  ) {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/aid-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action, ...extra }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        alert(data?.error || "No se pudo actualizar la solicitud");
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  function handleApprove() {
    if (!confirm("¿Aprobar y publicar esta solicitud en Kubo Ayuda?")) return;
    review("approve");
  }

  function handleReject() {
    const rejectionReason = prompt(
      "Motivo del rechazo (será visible para el solicitante):"
    );
    if (rejectionReason === null) return;
    if (!rejectionReason.trim()) {
      alert("Debes indicar un motivo de rechazo.");
      return;
    }
    review("reject", { rejectionReason: rejectionReason.trim() });
  }

  function handleMatch() {
    if (!confirm('¿Marcar como "En proceso" (hay una ayuda en curso)?')) return;
    review("match");
  }

  function handleComplete() {
    if (!confirm("¿Marcar esta solicitud como atendida/completada?")) return;
    review("complete");
  }

  if (status === "PENDING") {
    return (
      <>
        <button
          type="button"
          onClick={handleApprove}
          disabled={loading}
          className="flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          Aprobar
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={loading}
          className="flex h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
        >
          Rechazar
        </button>
      </>
    );
  }

  if (status === "APPROVED") {
    return (
      <>
        <button
          type="button"
          onClick={handleMatch}
          disabled={loading}
          className="flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white hover:bg-blue-700 disabled:opacity-60"
        >
          En proceso
        </button>
        <button
          type="button"
          onClick={handleComplete}
          disabled={loading}
          className="flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          Completar
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={loading}
          className="flex h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
        >
          Rechazar
        </button>
      </>
    );
  }

  if (status === "MATCHED") {
    return (
      <>
        <button
          type="button"
          onClick={handleComplete}
          disabled={loading}
          className="flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          Completar
        </button>
        <button
          type="button"
          onClick={handleReject}
          disabled={loading}
          className="flex h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
        >
          Rechazar
        </button>
      </>
    );
  }

  return null;
}
