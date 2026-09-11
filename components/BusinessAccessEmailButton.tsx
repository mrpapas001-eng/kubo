"use client";

import { useState } from "react";
import { MailCheck, Send, AlertCircle } from "lucide-react";

export default function BusinessAccessEmailButton({
  businessId,
  ownerEmail,
}: {
  businessId: string;
  ownerEmail: string | null;
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "sent" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const maskedEmail = ownerEmail
    ? (() => {
        const [local, domain] = ownerEmail.split("@");
        if (!domain) return ownerEmail;
        if (local.length <= 2) return `${local[0] ?? ""}***@${domain}`;
        return `${local.slice(0, 2)}***@${domain}`;
      })()
    : "correo del propietario";

  const handleClick = async () => {
    if (!ownerEmail) {
      setError("La empresa no tiene un correo del propietario registrado.");
      setStatus("error");
      return;
    }

    if (status === "sending") {
      return;
    }

    const confirmed = window.confirm(
      `¿Enviar el acceso por correo a ${maskedEmail}?`
    );

    if (!confirmed) {
      return;
    }

    setStatus("sending");
    setError(null);

    try {
      const response = await fetch(`/api/admin/businesses/${businessId}/send-access`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo enviar el correo.");
      }

      setStatus("sent");
      setError(null);
    } catch (err) {
      setStatus("error");
      setError(
        err instanceof Error ? err.message : "No se pudo enviar el correo."
      );
    }
  };

  const buttonClasses =
    status === "sent"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : status === "error"
        ? "border-red-200 bg-red-50 text-red-700"
        : status === "sending"
          ? "border-yellow-200 bg-yellow-50 text-yellow-700"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50";

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={status === "sending"}
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-black shadow-sm transition ${buttonClasses} ${
          status === "sending" ? "cursor-not-allowed opacity-80" : ""
        }`}
      >
        {status === "sending" ? (
          <>
            <Send className="h-4 w-4 animate-pulse" />
            Enviando...
          </>
        ) : status === "sent" ? (
          <>
            <MailCheck className="h-4 w-4" />
            Correo enviado
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar acceso por correo
          </>
        )}
      </button>

      {status === "error" && error ? (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : null}

      {status !== "error" && ownerEmail ? (
        <div className="text-xs font-medium text-slate-500">
          Destinatario: {maskedEmail}
        </div>
      ) : null}
    </div>
  );
}
