"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type BusinessOption = {
  slug: string;
  name: string;
};

type ListingOption = {
  id: string;
  title: string;
};

type SponsorData = {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  placement: string;
  categorySlug: string;
  priority: number;
  startAt: string;
  endAt: string;
  isActive: boolean;
};

type Props = {
  sponsor: SponsorData;
  businesses: BusinessOption[];
  listings: ListingOption[];
  mode?: "create" | "edit";
};

type DestinationType =
  | "business"
  | "listing"
  | "reels"
  | "external"
  | "custom";

function detectDestination(url: string): DestinationType {
  if (url.startsWith("/company/")) return "business";
  if (url.startsWith("/listing/")) return "listing";
  if (url === "/#reels" || url === "#reels") return "reels";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return "external";
  }
  return "custom";
}

export default function AdminSponsorForm({
  sponsor,
  businesses,
  listings,
  mode = "edit",
}: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(sponsor.title);
  const [subtitle, setSubtitle] = useState(sponsor.subtitle);
  const [imageUrl, setImageUrl] = useState(sponsor.imageUrl);
  const [ctaText, setCtaText] = useState(sponsor.ctaText);
  const [placement, setPlacement] = useState(sponsor.placement);
  const [categorySlug, setCategorySlug] = useState(sponsor.categorySlug);
  const [priority, setPriority] = useState(String(sponsor.priority));
  const [startAt, setStartAt] = useState(sponsor.startAt);
  const [endAt, setEndAt] = useState(sponsor.endAt);
  const [isActive, setIsActive] = useState(sponsor.isActive);

  const initialDestinationType = detectDestination(sponsor.ctaUrl);

  const [destinationType, setDestinationType] =
    useState<DestinationType>(initialDestinationType);

  const initialBusinessSlug = sponsor.ctaUrl.startsWith("/company/")
    ? sponsor.ctaUrl.replace("/company/", "")
    : "";

  const initialListingId = sponsor.ctaUrl.startsWith("/listing/")
    ? sponsor.ctaUrl.replace("/listing/", "")
    : "";

  const [businessSlug, setBusinessSlug] = useState(initialBusinessSlug);
  const [listingId, setListingId] = useState(initialListingId);

  const [externalUrl, setExternalUrl] = useState(
    sponsor.ctaUrl.startsWith("http") ? sponsor.ctaUrl : ""
  );

  const [customUrl, setCustomUrl] = useState(
    initialDestinationType === "custom" ? sponsor.ctaUrl : ""
  );

  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState("");

  const finalCtaUrl = useMemo(() => {
    if (destinationType === "business") {
      return businessSlug ? `/company/${businessSlug}` : "";
    }

    if (destinationType === "listing") {
      return listingId ? `/listing/${listingId}` : "";
    }

    if (destinationType === "reels") {
      return "/#reels";
    }

    if (destinationType === "external") {
      return externalUrl.trim();
    }

    return customUrl.trim();
  }, [
    destinationType,
    businessSlug,
    listingId,
    externalUrl,
    customUrl,
  ]);

  async function uploadSponsorImage(file: File) {
    setUploadingImage(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("files", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data?.ok) {
        throw new Error(data?.error || "No se pudo subir la imagen.");
      }

      const uploadedUrl = Array.isArray(data.urls) ? data.urls[0] : null;

      if (!uploadedUrl) {
        throw new Error("No se recibió la URL de la imagen.");
      }

      setImageUrl(uploadedUrl);
      setMessage("Imagen subida correctamente.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al subir la imagen."
      );
    } finally {
      setUploadingImage(false);
    }
  }

  async function saveSponsor() {
    setSaving(true);
    setMessage("");

    try {
      const isCreate = mode === "create";

      const response = await fetch(
        isCreate ? "/api/admin/sponsors" : `/api/admin/sponsors/${sponsor.id}`,
        {
          method: isCreate ? "POST" : "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        body: JSON.stringify({
          title,
          subtitle,
          imageUrl,
          ctaText,
          ctaUrl: finalCtaUrl,
          placement,
          categorySlug:
            placement === "category" || placement === "category-feed"
              ? categorySlug
              : "",
          priority: Number(priority || 0),
          startAt,
          endAt,
          isActive,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "No se pudo guardar el sponsor.");
      }

      if (mode === "create" && data?.sponsor?.id) {
        router.push(`/admin/sponsors/${data.sponsor.id}`);
        router.refresh();
        return;
      }

      setMessage("Sponsor guardado correctamente.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Ocurrió un error al guardar."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-black uppercase text-slate-500">
            Título
          </span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 font-bold outline-none focus:border-[#0f3c8c]"
          />
        </label>

        <label className="block">
          <span className="text-xs font-black uppercase text-slate-500">
            Texto del botón
          </span>
          <input
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="Ver más"
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 font-bold outline-none focus:border-[#0f3c8c]"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-black uppercase text-slate-500">
          Subtítulo
        </span>
        <textarea
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          rows={3}
          className="mt-2 w-full rounded-2xl border border-slate-200 p-4 font-medium outline-none focus:border-[#0f3c8c]"
        />
      </label>

      <div className="block">
        <span className="text-xs font-black uppercase text-slate-500">
          Imagen del sponsor
        </span>

        <div className="mt-2 grid gap-3 md:grid-cols-[1fr_auto]">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://..."
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 font-medium outline-none focus:border-[#0f3c8c]"
          />

          <label className={`flex h-12 cursor-pointer items-center justify-center rounded-2xl bg-[#0f3c8c] px-5 font-black text-white hover:bg-[#0c2f6d] ${uploadingImage ? "pointer-events-none opacity-50" : ""}`}>
            {uploadingImage ? "Subiendo..." : "Subir imagen"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={uploadingImage}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  void uploadSponsorImage(file);
                }
                e.currentTarget.value = "";
              }}
            />
          </label>
        </div>

        <p className="mt-2 text-xs font-medium text-slate-500">
          Puedes pegar una URL o elegir una imagen desde tu computador o celular.
        </p>

        {imageUrl ? (
          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            <img
              src={imageUrl}
              alt="Vista previa"
              className="max-h-[260px] w-full object-contain"
            />
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
        <h2 className="text-lg font-black text-[#0f3c8c]">
          ¿A dónde lleva este sponsor?
        </h2>

        <select
          value={destinationType}
          onChange={(e) =>
            setDestinationType(e.target.value as DestinationType)
          }
          className="mt-4 h-12 w-full rounded-2xl border border-blue-200 bg-white px-4 font-black text-slate-800"
        >
          <option value="business">Página de empresa</option>
          <option value="listing">Anuncio de Kubo</option>
          <option value="reels">Sección de Reels</option>
          <option value="external">Página web externa</option>
          <option value="custom">Ruta personalizada</option>
        </select>

        {destinationType === "business" ? (
          <select
            value={businessSlug}
            onChange={(e) => setBusinessSlug(e.target.value)}
            className="mt-4 h-12 w-full rounded-2xl border border-blue-200 bg-white px-4 font-bold"
          >
            <option value="">Selecciona una empresa</option>
            {businesses.map((business) => (
              <option key={business.slug} value={business.slug}>
                {business.name}
              </option>
            ))}
          </select>
        ) : null}

        {destinationType === "listing" ? (
          <select
            value={listingId}
            onChange={(e) => setListingId(e.target.value)}
            className="mt-4 h-12 w-full rounded-2xl border border-blue-200 bg-white px-4 font-bold"
          >
            <option value="">Selecciona un anuncio</option>
            {listings.map((listing) => (
              <option key={listing.id} value={listing.id}>
                {listing.title}
              </option>
            ))}
          </select>
        ) : null}

        {destinationType === "reels" ? (
          <div className="mt-4 rounded-2xl bg-white p-4 text-sm font-bold text-slate-600">
            El usuario irá directamente a la secciÃ³n de Reels de Kubo.
          </div>
        ) : null}

        {destinationType === "external" ? (
          <input
            value={externalUrl}
            onChange={(e) => setExternalUrl(e.target.value)}
            placeholder="https://www.empresa.com"
            className="mt-4 h-12 w-full rounded-2xl border border-blue-200 bg-white px-4 font-medium"
          />
        ) : null}

        {destinationType === "custom" ? (
          <input
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="/ruta"
            className="mt-4 h-12 w-full rounded-2xl border border-blue-200 bg-white px-4 font-medium"
          />
        ) : null}

        <div className="mt-4 text-xs font-black uppercase text-slate-500">
          Destino final
        </div>
        <div className="mt-1 break-all font-bold text-[#0f3c8c]">
          {finalCtaUrl || "Sin destino"}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="text-xs font-black uppercase text-slate-500">
            Ubicación
          </span>

          <select
            value={placement}
            onChange={(e) => setPlacement(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 font-bold"
          >
            <option value="home-main">Principal de Home</option>
            <option value="home-side">Lateral de Home</option>
            <option value="home-feed">Feed de Home</option>
            <option value="category">Categoría</option>
            <option value="category-feed">Feed de categoría</option>
          </select>
        </label>

        <label>
          <span className="text-xs font-black uppercase text-slate-500">
            Prioridad
          </span>
          <input
            type="number"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 font-bold"
          />
        </label>
      </div>

      {placement === "category" || placement === "category-feed" ? (
        <label className="block">
          <span className="text-xs font-black uppercase text-slate-500">
            Categoría
          </span>
          <input
            value={categorySlug}
            onChange={(e) => setCategorySlug(e.target.value)}
            placeholder="motor"
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4 font-bold"
          />
        </label>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <label>
          <span className="text-xs font-black uppercase text-slate-500">
            Comienza
          </span>
          <input
            type="datetime-local"
            value={startAt}
            onChange={(e) => setStartAt(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4"
          />
        </label>

        <label>
          <span className="text-xs font-black uppercase text-slate-500">
            Termina
          </span>
          <input
            type="datetime-local"
            value={endAt}
            onChange={(e) => setEndAt(e.target.value)}
            className="mt-2 h-12 w-full rounded-2xl border border-slate-200 px-4"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <input
          type="checkbox"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          className="h-5 w-5"
        />
        <span className="font-black text-slate-800">
          Sponsor activo
        </span>
      </label>

      {message ? (
        <div className="rounded-2xl bg-slate-100 p-4 text-sm font-bold text-slate-700">
          {message}
        </div>
      ) : null}

      <button
        type="button"
        disabled={saving}
        onClick={saveSponsor}
        className="h-13 w-full rounded-2xl bg-[#0f3c8c] px-6 py-4 font-black text-white shadow-sm hover:bg-[#0c2f6d] disabled:opacity-50"
      >
        {saving
          ? mode === "create"
            ? "Creando..."
            : "Guardando..."
          : mode === "create"
            ? "Crear sponsor"
            : "Guardar sponsor"}
      </button>
    </div>
  );
}