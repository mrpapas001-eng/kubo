"use client";

import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2 } from "lucide-react";

type AdminAidRequestActionsProps = {
  requestId: string;
  status: string;
};

type ReviewAction =
  | "approve"
  | "reject"
  | "match"
  | "complete"
  | "image";

export default function AdminAidRequestActions({
  requestId,
  status,
}: AdminAidRequestActionsProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  async function review(
    action: ReviewAction,
    extra?: {
      rejectionReason?: string;
      adminNotes?: string;
      contextImageUrl?: string;
    }
  ) {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/aid-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
          action,
          ...extra,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        alert(data?.error || "No se pudo actualizar la solicitud");
        return false;
      }

      router.refresh();
      return true;
    } catch (error) {
      console.error("Error actualizando solicitud:", error);

      alert("No se pudo actualizar la solicitud");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = event.target.files;

    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];

    try {
      setImageLoading(true);

      const formData = new FormData();
      formData.append("files", file);

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadData.ok) {
        throw new Error(
          uploadData.error || "No se pudo subir la imagen"
        );
      }

      const imageUrl = uploadData.urls?.[0];

      if (!imageUrl) {
        throw new Error(
          "La imagen se subió pero no se recibió una URL válida."
        );
      }

      const saved = await review("image", {
        contextImageUrl: imageUrl,
      });

      if (saved) {
        alert("Imagen guardada correctamente.");
      }
    } catch (error) {
      console.error("Error subiendo imagen:", error);

      alert(
        error instanceof Error
          ? error.message
          : "No se pudo subir la imagen"
      );
    } finally {
      setImageLoading(false);

      /*
       * Permite volver a seleccionar el mismo archivo.
       */
      event.target.value = "";
    }
  }

  function handleApprove() {
    if (
      !confirm(
        "¿Aprobar y publicar esta solicitud en Kubo Ayuda?"
      )
    ) {
      return;
    }

    review("approve");
  }

  function handleReject() {
    const rejectionReason = prompt(
      "Motivo del rechazo (será visible para el solicitante):"
    );

    if (rejectionReason === null) {
      return;
    }

    if (!rejectionReason.trim()) {
      alert("Debes indicar un motivo de rechazo.");
      return;
    }

    review("reject", {
      rejectionReason: rejectionReason.trim(),
    });
  }

  function handleMatch() {
    if (
      !confirm(
        '¿Marcar como "En proceso" (hay una ayuda en curso)?'
      )
    ) {
      return;
    }

    review("match");
  }

  function handleComplete() {
    if (
      !confirm(
        "¿Marcar esta solicitud como atendida/completada?"
      )
    ) {
      return;
    }

    review("complete");
  }

  const imageButton = (
    <label
      className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-blue-50 px-5 text-sm font-black text-[#0f3c8c] transition hover:bg-blue-100 ${
        imageLoading || loading
          ? "pointer-events-none opacity-60"
          : ""
      }`}
    >
      {imageLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Subiendo...
        </>
      ) : (
        <>
          <ImagePlus className="h-4 w-4" />
          Agregar / cambiar imagen
        </>
      )}

      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        disabled={imageLoading || loading}
        className="hidden"
      />
    </label>
  );

  if (status === "PENDING") {
    return (
      <>
        {imageButton}

        <button
          type="button"
          onClick={handleApprove}
          disabled={loading || imageLoading}
          className="flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          Aprobar
        </button>

        <button
          type="button"
          onClick={handleReject}
          disabled={loading || imageLoading}
          className="flex h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          Rechazar
        </button>
      </>
    );
  }

  if (status === "APPROVED") {
    return (
      <>
        {imageButton}

        <button
          type="button"
          onClick={handleMatch}
          disabled={loading || imageLoading}
          className="flex h-11 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-black text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          En proceso
        </button>

        <button
          type="button"
          onClick={handleComplete}
          disabled={loading || imageLoading}
          className="flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          Completar
        </button>

        <button
          type="button"
          onClick={handleReject}
          disabled={loading || imageLoading}
          className="flex h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          Rechazar
        </button>
      </>
    );
  }

  if (status === "MATCHED") {
    return (
      <>
        {imageButton}

        <button
          type="button"
          onClick={handleComplete}
          disabled={loading || imageLoading}
          className="flex h-11 items-center justify-center rounded-2xl bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:opacity-60"
        >
          Completar
        </button>

        <button
          type="button"
          onClick={handleReject}
          disabled={loading || imageLoading}
          className="flex h-11 items-center justify-center rounded-2xl bg-red-600 px-5 text-sm font-black text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          Rechazar
        </button>
      </>
    );
  }

  return null;
}