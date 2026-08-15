"use client";

import { useState } from "react";

type ReportListingModalProps = {
  listingId: string;
};

const REASONS = [
  "Es una estafa",
  "Información falsa",
  "Precio falso o engañoso",
  "Anuncio duplicado",
  "Contenido ofensivo",
  "Producto o servicio prohibido",
  "Otro motivo",
];

export default function ReportListingModal({
  listingId,
}: ReportListingModalProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-12 items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 text-sm font-black text-red-600 hover:bg-red-100"
      >
        Reportar anuncio
      </button>

      {open ? (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
            <h2 className="text-2xl font-black text-slate-900">
              Reportar anuncio
            </h2>

            <p className="mt-2 text-sm font-medium text-slate-500">
              Ayúdanos a mantener Kubo seguro. Selecciona el motivo del reporte.
            </p>

            <div className="mt-5 space-y-2">
              {REASONS.map((item) => (
                <label
                  key={item}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold ${
                    reason === item
                      ? "border-[#0f3c8c] bg-blue-50 text-[#0f3c8c]"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`report-reason-${listingId}`}
                    value={item}
                    checked={reason === item}
                    onChange={() => setReason(item)}
                    className="h-4 w-4"
                  />
                  {item}
                </label>
              ))}
            </div>

            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Puedes agregar más detalles..."
              className="mt-4 min-h-[100px] w-full rounded-2xl border border-slate-200 p-4 text-sm font-medium outline-none focus:border-[#0f3c8c]"
            />

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                disabled={!reason}
onClick={async () => {
  try {
    const response = await fetch("/api/report-listing", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        listingId,
        reason,
        details,
      }),
    });

    if (!response.ok) {
      throw new Error("Error enviando reporte");
    }

    alert("Reporte enviado correctamente");
    setOpen(false);

    setReason("");
    setDetails("");
  } catch (error) {
    console.error(error);

    alert("Ocurrió un error enviando el reporte");
  }
}}
                className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-red-600 text-sm font-black text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Enviar reporte
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}