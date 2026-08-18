"use client";

import { useRouter } from "next/navigation";

type AdminAccountVerificationActionsProps = {
  requestId: string;
  status: string;
};

export default function AdminAccountVerificationActions({
  requestId,
  status,
}: AdminAccountVerificationActionsProps) {
  const router = useRouter();

  async function review(action: "approve" | "reject") {
    const confirmed = confirm(
      action === "approve"
        ? "Aprobar esta verificación de cuenta?"
        : "Rechazar esta solicitud?"
    );

    if (!confirmed) return;

    const response = await fetch("/api/admin/account-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, action }),
    });

    if (!response.ok) {
      alert("No se pudo actualizar la solicitud");
      return;
    }

    router.refresh();
  }

  if (status !== "PENDING") return null;

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