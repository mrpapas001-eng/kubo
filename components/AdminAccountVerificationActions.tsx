"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminAccountVerificationActionsProps = {
  requestId: string;
  status: string;
  whatsappNumber?: string | null;
  accountType?: "PARTICULAR" | "EMPRESA";
};

function getConfirmationWhatsappHref(
  value: string | null | undefined,
  accountType: "PARTICULAR" | "EMPRESA"
) {
  const digits = String(value ?? "").replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? digits.slice(1) : digits;

  const number = /^3\d{9}$/.test(normalized)
    ? `57${normalized}`
    : /^57\d{10}$/.test(normalized)
      ? normalized
      : normalized;

  if (!number) return null;

  const message =
    accountType === "EMPRESA"
      ? '¡Listo! Tu empresa ha sido verificada correctamente en Kubo Anuncios. Desde ahora tus anuncios mostrarán el sello "Empresa verificada". Gracias por ayudarnos a construir una comunidad más segura y confiable.'
      : '¡Listo! Tu cuenta ha sido verificada correctamente en Kubo Anuncios. Desde ahora tus anuncios mostrarán el sello "Usuario verificado". Gracias por ayudarnos a construir una comunidad más segura y confiable.';

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export default function AdminAccountVerificationActions({
  requestId,
  status,
  whatsappNumber,
  accountType = "PARTICULAR",
}: AdminAccountVerificationActionsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);

  async function review(action: "approve" | "reject") {
    const confirmed = confirm(
      action === "approve"
        ? "¿Aprobar esta verificación de cuenta?"
        : "¿Rechazar esta solicitud?"
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const response = await fetch("/api/admin/account-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          action,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        alert(
          data?.error ??
            "No se pudo actualizar la solicitud."
        );
        return;
      }

      if (action === "approve") {
        setApproved(true);
        return;
      }

      router.refresh();
    } catch {
      alert("No se pudo actualizar la solicitud.");
    } finally {
      setLoading(false);
    }
  }

  if (approved) {
    const confirmationWhatsappHref =
      getConfirmationWhatsappHref(
        whatsappNumber,
        accountType
      );

    return (
      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex h-11 items-center justify-center rounded-2xl bg-emerald-50 px-4 text-sm font-black text-emerald-700 ring-1 ring-emerald-200">
          ✓ Verificación aprobada
        </div>

        {confirmationWhatsappHref ? (
          <a
            href={confirmationWhatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center justify-center rounded-2xl bg-[#25D366] px-5 text-sm font-black text-white hover:bg-[#1fb85a]"
          >
            Confirmar por WhatsApp
          </a>
        ) : null}

        <button
          type="button"
          onClick={() => router.refresh()}
          className="flex h-11 items-center justify-center rounded-2xl bg-[#0f3c8c] px-5 text-sm font-black text-white hover:bg-[#0c2f6d]"
        >
          Finalizar
        </button>
      </div>
    );
  }

  if (status !== "PENDING") return null;

  return (
    <>
      <button
        type="button"
        onClick={() => review("approve")}
        disabled={loading}
        className="flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Procesando..." : "Aprobar"}
      </button>

      <button
        type="button"
        onClick={() => review("reject")}
        disabled={loading}
        className="flex h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white hover:bg-red-700 disabled:opacity-60"
      >
        {loading ? "Procesando..." : "Rechazar"}
      </button>
    </>
  );
}