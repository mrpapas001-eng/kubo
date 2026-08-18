"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { FileCheck2, IdCard } from "lucide-react";

export default function VerificarIdentidadPage() {
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!whatsappNumber.trim()) {
      setMessage("Ingresa tu numero de WhatsApp.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/identity-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          whatsappNumber: whatsappNumber.trim(),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar la solicitud.");
      }

      setSent(true);
      setMessage("Solicitud enviada. Revisaremos tu identidad.");
    } catch (error: any) {
      setMessage(error?.message || "No se pudo enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-28 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[760px]">
        <Link
          href="/mi-cuenta"
          className="mb-4 inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700"
        >
          Volver
        </Link>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0ff] text-[#0f3c8c]">
              <IdCard className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Verificar identidad
              </h1>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                Esta verificacion ayuda a generar confianza. No garantiza una
                compra ni reemplaza revisar el producto antes de pagar.
              </p>
            </div>
          </div>

          {sent ? (
            <div className="mt-6 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center gap-3 text-emerald-700">
                <FileCheck2 className="h-6 w-6" />
                <div className="text-lg font-black">Solicitud recibida</div>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Revisaremos tu solicitud por WhatsApp.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  WhatsApp
                </label>
                <input
                  value={whatsappNumber}
                  onChange={(event) => setWhatsappNumber(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-[#0f3c8c]"
                  placeholder="Ej: 3001234567"
                  required
                />
              </div>

              {message ? (
                <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700">
                  {message}
                </div>
              ) : null}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#0f3c8c] px-5 text-sm font-black text-white hover:bg-[#0c2f6d] disabled:opacity-60"
              >
                {loading ? "Enviando..." : "Enviar solicitud"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
