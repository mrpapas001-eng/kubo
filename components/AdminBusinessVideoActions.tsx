"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  videoId: string;
};

export default function AdminBusinessVideoActions({ videoId }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  async function review(action: "approve" | "reject") {
    if (submitting) return;

    let adminNote: string | null = null;

    if (action === "reject") {
      adminNote = window.prompt("Motivo del rechazo (opcional):", "") ?? "";
    }

    const confirmed = window.confirm(
      action === "approve"
        ? "¿Aprobar este video para publicarlo en /videos?"
        : "¿Rechazar este video?"
    );

    if (!confirmed) return;

    setSubmitting(true);

    try {
      const res = await fetch("/api/admin/business-videos", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: videoId,
          action,
          adminNote: adminNote || undefined,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.ok) {
        window.alert("No se pudo actualizar el video. Intenta de nuevo.");
        setSubmitting(false);
        return;
      }

      router.refresh();
    } catch {
      window.alert("Ocurrió un error de red. Intenta de nuevo.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => review("approve")}
        disabled={submitting}
        className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Aprobar
      </button>

      <button
        type="button"
        onClick={() => review("reject")}
        disabled={submitting}
        className="flex h-11 flex-1 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        Rechazar
      </button>
    </div>
  );
}
