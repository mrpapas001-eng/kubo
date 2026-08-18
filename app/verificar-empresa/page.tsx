"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Building2, FileCheck2, UploadCloud } from "lucide-react";

export default function VerificarEmpresaPage() {
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [rutFile, setRutFile] = useState<File | null>(null);
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

    if (!rutFile) {
      setMessage("Sube el RUT de la empresa.");
      return;
    }

    setLoading(true);

    try {
      const form = new FormData();
      form.append("documents", rutFile);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.documentUrl) {
        throw new Error(uploadData.error || "No se pudo subir el RUT.");
      }

      const res = await fetch("/api/business-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          businessName,
          businessDescription,
          whatsappNumber: whatsappNumber.trim(),
          rutUrl: uploadData.documentUrl,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo enviar la solicitud.");
      }

      setSent(true);
      setMessage("Solicitud enviada. Revisaremos el RUT y te avisaremos.");
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
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Verificar empresa
              </h1>
              <p className="mt-2 text-sm font-medium leading-relaxed text-slate-500">
                Envia el RUT para comprobar que tu negocio es real. Cuando se
                apruebe, tus anuncios podran mostrar el sello de empresa
                verificada.
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
                Revisaremos el documento desde el panel de administracion.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="text-sm font-bold text-slate-700">
                  Nombre de la empresa
                </label>
                <input
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-[#0f3c8c]"
                  placeholder="Ej: Autos Pereira"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">
                  Descripcion breve
                </label>
                <textarea
                  value={businessDescription}
                  onChange={(event) =>
                    setBusinessDescription(event.target.value)
                  }
                  className="mt-2 min-h-[120px] w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-[#0f3c8c]"
                  placeholder="Cuenta que vende o que servicios ofrece la empresa."
                />
              </div>

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

              <label className="block rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center">
                <UploadCloud className="mx-auto h-8 w-8 text-[#0f3c8c]" />
                <div className="mt-3 text-sm font-black text-slate-900">
                  Subir RUT
                </div>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Sube tu RUT donde aparezca el NIT y los datos de la empresa.
                </p>
                <input
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={(event) => {
                    setRutFile(event.target.files?.[0] || null);
                  }}
                  required
                />
                {rutFile ? (
                  <div className="mt-3 rounded-2xl bg-white px-4 py-2 text-xs font-bold text-slate-700">
                    {rutFile.name}
                  </div>
                ) : null}
              </label>

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
