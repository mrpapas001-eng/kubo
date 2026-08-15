"use client";

import { useRouter } from "next/navigation";

type AdminIdentityVerificationActionsProps = {
  requestId: string;
  status: string;
};

export default function AdminIdentityVerificationActions({
  requestId,
  status,
}: AdminIdentityVerificationActionsProps) {
  const router = useRouter();
  const isPending = status === "pending";

  async function review(action: "approve" | "reject") {
    const ok = confirm(
      action === "approve"
        ? "Aprobar identidad verificada?"
        : "Rechazar esta solicitud?"
    );

    if (!ok) return;

    const res = await fetch("/api/admin/identity-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ requestId, action }),
    });

    if (!res.ok) {
      alert("No se pudo actualizar la solicitud");
      return;
    }

    alert(action === "approve" ? "Identidad verificada" : "Solicitud rechazada");
    router.refresh();
  }

  if (!isPending) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => review("approve")}
        className="flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700"
      >
        Aprobar
      </button>

      <button
        type="button"
        onClick={() => review("reject")}
        className="flex h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700"
      >
        Rechazar
      </button>
    </>
  );
}
