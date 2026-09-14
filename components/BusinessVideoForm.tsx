"use client";

import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { CheckCircle2, Clock3, Store, UploadCloud, XCircle } from "lucide-react";

import { CATEGORIES } from "@/data/categories";
import { KUBO_CITIES } from "@/app/data/cities";

const MAX_DESCRIPTION_LENGTH = 300;
const MIN_DURATION_SECONDS = 15;
const MAX_DURATION_SECONDS = 60;
const MAX_VIDEO_SIZE_MB = 25;
const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE_MB * 1024 * 1024;
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

type ExistingVideo = {
  id: string;
  videoUrl: string;
  thumbnailUrl: string | null;
  description: string;
  categorySlug: string;
  city: string;
  durationSeconds: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote: string | null;
};

export type BusinessOption = {
  id: string;
  name: string;
  logo: string | null;
  isVerified: boolean;
  video: ExistingVideo | null;
};

type Props = {
  businesses: BusinessOption[];
};

function statusLabel(status: ExistingVideo["status"]) {
  if (status === "APPROVED") return "Aprobado";
  if (status === "REJECTED") return "Rechazado";
  return "Pendiente de revisión";
}

function readVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("No se pudo leer el video."));
    };

    video.src = url;
  });
}

export default function BusinessVideoForm({ businesses }: Props) {
  const [selectedBusinessId, setSelectedBusinessId] = useState(
    businesses[0]?.id ?? ""
  );
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [detectedDuration, setDetectedDuration] = useState<number | null>(null);
  const [description, setDescription] = useState("");
  const [categorySlug, setCategorySlug] = useState("");
  const [city, setCity] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const selectedBusiness = useMemo(
    () => businesses.find((b) => b.id === selectedBusinessId) ?? null,
    [businesses, selectedBusinessId]
  );

  const existingVideo = selectedBusiness?.video ?? null;
  const canUpload = Boolean(selectedBusiness?.isVerified);
  const resolvedCity = city === "Otra" ? manualCity.trim() : city;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFileError(null);
    setSuccessMessage(null);

    const selected = e.target.files?.[0] ?? null;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }

    setFile(null);
    setDetectedDuration(null);

    if (!selected) return;

    if (!ALLOWED_VIDEO_TYPES.includes(selected.type)) {
      setFileError("Formato no permitido. Usa MP4, WEBM o MOV.");
      e.target.value = "";
      return;
    }

    if (selected.size > MAX_VIDEO_SIZE_BYTES) {
      setFileError(`El video supera el máximo de ${MAX_VIDEO_SIZE_MB}MB.`);
      e.target.value = "";
      return;
    }

    try {
      const duration = await readVideoDuration(selected);

      if (
        !Number.isFinite(duration) ||
        duration < MIN_DURATION_SECONDS ||
        duration > MAX_DURATION_SECONDS
      ) {
        setFileError(
          `La duración debe estar entre ${MIN_DURATION_SECONDS} y ${MAX_DURATION_SECONDS} segundos (detectado: ${Math.round(duration)}s).`
        );
        e.target.value = "";
        return;
      }

      setDetectedDuration(duration);
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    } catch {
      setFileError("No se pudo leer la duración del video. Intenta con otro archivo.");
      e.target.value = "";
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setSuccessMessage(null);

    if (submitting) return;

    if (!selectedBusiness) {
      setFormError("Selecciona una empresa.");
      return;
    }

    if (!canUpload) {
      setFormError("Tu empresa debe estar verificada para publicar un video.");
      return;
    }

    if (!file || detectedDuration === null) {
      setFormError("Selecciona un video válido antes de continuar.");
      return;
    }

    const trimmedDescription = description.trim();
    if (!trimmedDescription || trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
      setFormError(`La descripción es obligatoria (máximo ${MAX_DESCRIPTION_LENGTH} caracteres).`);
      return;
    }

    if (!categorySlug) {
      setFormError("Selecciona una categoría.");
      return;
    }

    if (!resolvedCity) {
      setFormError("Indica la ciudad.");
      return;
    }

    setSubmitting(true);

    try {
      const uploadForm = new FormData();
      uploadForm.append("video", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      const uploadData = await uploadRes.json().catch(() => null);

      if (!uploadRes.ok || !uploadData?.ok || !uploadData?.videoUrl) {
        setFormError(uploadData?.error ?? "No se pudo subir el video.");
        setSubmitting(false);
        return;
      }

      const submitRes = await fetch("/api/business-videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessId: selectedBusiness.id,
          videoUrl: uploadData.videoUrl,
          description: trimmedDescription,
          categorySlug,
          city: resolvedCity,
          durationSeconds: Math.round(detectedDuration),
        }),
      });

      const submitData = await submitRes.json().catch(() => null);

      if (!submitRes.ok || !submitData?.ok) {
        setFormError(submitData?.error ?? "No se pudo guardar el video.");
        setSubmitting(false);
        return;
      }

      setSuccessMessage("Video enviado. Lo revisaremos antes de publicarlo.");
      setFile(null);
      setDetectedDuration(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setFormError("Ocurrió un error de red. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {businesses.length > 1 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <label className="text-sm font-bold text-slate-700">
            Elige la empresa que quieres promocionar
          </label>

          <select
            value={selectedBusinessId}
            onChange={(e) => {
              setSelectedBusinessId(e.target.value);
              setSuccessMessage(null);
              setFormError(null);
            }}
            className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          >
            {businesses.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name} {b.isVerified ? "· Verificada" : "· Sin verificar"}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {selectedBusiness ? (
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          {selectedBusiness.logo ? (
            <Image
              src={selectedBusiness.logo}
              alt={selectedBusiness.name}
              width={48}
              height={48}
              className="h-12 w-12 shrink-0 rounded-2xl border border-slate-200 object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#e8f0ff] text-[#0f3c8c]">
              <Store className="h-6 w-6" />
            </div>
          )}

          <div>
            <div className="font-black text-slate-900">{selectedBusiness.name}</div>
            <div
              className={`mt-1 inline-flex items-center gap-1 text-xs font-black ${
                selectedBusiness.isVerified ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {selectedBusiness.isVerified ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" /> Empresa verificada
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5" /> Empresa sin verificar
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {!canUpload ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-800">
          Solo las empresas verificadas pueden publicar un video promocional.
          Solicita la verificación de tu empresa para continuar.
        </div>
      ) : null}

      {existingVideo ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-black text-slate-900">Tu video actual</h3>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${
                existingVideo.status === "APPROVED"
                  ? "bg-emerald-100 text-emerald-700"
                  : existingVideo.status === "REJECTED"
                    ? "bg-red-100 text-red-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              <Clock3 className="h-3.5 w-3.5" />
              {statusLabel(existingVideo.status)}
            </span>
          </div>

          <p className="mt-2 text-sm font-medium text-slate-500">{existingVideo.description}</p>

          {existingVideo.status === "REJECTED" && existingVideo.adminNote ? (
            <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
              Motivo del rechazo: {existingVideo.adminNote}
            </div>
          ) : null}

          <p className="mt-3 text-xs font-medium text-slate-400">
            Solo se permite un video activo por empresa. Si subes uno nuevo, reemplazará
            este y volverá a quedar pendiente de revisión.
          </p>
        </div>
      ) : null}

      <form
        onSubmit={onSubmit}
        className={`space-y-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7 ${
          canUpload ? "" : "pointer-events-none opacity-50"
        }`}
      >
        <div>
          <label className="text-sm font-bold text-slate-700">
            Video vertical (15 a 60 segundos, máx. {MAX_VIDEO_SIZE_MB}MB)
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={handleFileChange}
            className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-[#0f3c8c] file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
          />

          {fileError ? (
            <p className="mt-2 text-sm font-bold text-red-600">{fileError}</p>
          ) : null}

          {previewUrl ? (
            <div className="mt-4 flex items-start gap-4">
              <video
                src={previewUrl}
                className="aspect-[9/16] w-32 rounded-2xl border border-slate-200 object-cover"
                controls
                preload="metadata"
              />
              <div className="text-sm font-medium text-slate-500">
                <div className="inline-flex items-center gap-2 font-black text-emerald-600">
                  <UploadCloud className="h-4 w-4" />
                  Listo para enviar
                </div>
                <p className="mt-1">Duración detectada: {Math.round(detectedDuration ?? 0)}s</p>
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <label className="text-sm font-bold text-slate-700">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, MAX_DESCRIPTION_LENGTH))}
            className="mt-2 min-h-[110px] w-full rounded-xl border border-slate-200 p-4"
            placeholder="Cuenta brevemente qué ofrece tu empresa..."
          />
          <p className="mt-1 text-right text-xs font-medium text-slate-400">
            {description.length}/{MAX_DESCRIPTION_LENGTH}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-bold text-slate-700">Categoría</label>
            <select
              value={categorySlug}
              onChange={(e) => setCategorySlug(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
            >
              <option value="">Selecciona una categoría</option>
              {CATEGORIES.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Ciudad</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
            >
              <option value="">Selecciona una ciudad</option>
              {KUBO_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {city === "Otra" ? (
              <input
                value={manualCity}
                onChange={(e) => setManualCity(e.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4"
                placeholder="Escribe tu ciudad"
              />
            ) : null}
          </div>
        </div>

        {formError ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
            {formError}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting || !canUpload}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-6 text-sm font-black text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Enviando..." : existingVideo ? "Reemplazar video" : "Enviar video"}
        </button>
      </form>
    </div>
  );
}
