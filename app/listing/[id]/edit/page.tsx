"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

const MAX_IMAGES = 25;

type NewImage = {
  file: File;
  preview: string;
};

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id ?? "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<NewImage[]>([]);

  const totalImages = existingImages.length + newImages.length;

  const allImages = useMemo(
    () => [
      ...existingImages.map((url) => ({
        type: "existing" as const,
        url,
      })),
      ...newImages.map((item, index) => ({
        type: "new" as const,
        url: item.preview,
        index,
      })),
    ],
    [existingImages, newImages]
  );

  useEffect(() => {
    if (!id) {
      router.push("/mis-anuncios");
      return;
    }

    async function load() {
      setLoading(true);
      setLoadError(null);

      try {
        const res = await fetch(`/api/listings/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data?.ok || !data?.listing) {
          setLoadError(data?.error ?? "No pudimos cargar este anuncio.");
          return;
        }

        const l = data.listing;

        if (l.status === "deleted") {
          setLoadError("Este anuncio fue eliminado y ya no se puede editar.");
          return;
        }

        setTitle(String(l.title ?? ""));
        setDescription(String(l.description ?? ""));
        setPrice(
          l.price !== null && l.price !== undefined ? String(l.price) : ""
        );
        setPhone(String(l.phone ?? ""));

        const detailImages =
          Array.isArray(l?.details?.images)
            ? l.details.images
                .map((url: unknown) => String(url ?? "").trim())
                .filter(Boolean)
            : [];

        const mainImage = String(l.imageUrl ?? "").trim();

        const loadedImages =
          detailImages.length > 0
            ? detailImages
            : mainImage
              ? [mainImage]
              : [];

        const uniqueImages: string[] = Array.from(
  new Set<string>(loadedImages)
).slice(0, MAX_IMAGES);

setExistingImages(uniqueImages);
      } catch {
        setLoadError("Error al cargar el anuncio. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, router]);

  useEffect(() => {
    return () => {
      newImages.forEach((item) => URL.revokeObjectURL(item.preview));
    };
  }, [newImages]);

  function handleAddImages(e: React.ChangeEvent<HTMLInputElement>) {
    setFormError(null);

    const files = Array.from(e.target.files ?? []);

    if (files.length === 0) return;

    const available = MAX_IMAGES - totalImages;

    if (available <= 0) {
      setFormError(`Solo puedes tener hasta ${MAX_IMAGES} imágenes.`);
      e.target.value = "";
      return;
    }

    const selected = files.slice(0, available);

    const invalidFile = selected.find(
      (file) =>
        !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        )
    );

    if (invalidFile) {
      setFormError("Las imágenes deben ser JPG, PNG o WEBP.");
      e.target.value = "";
      return;
    }

    const oversizedFile = selected.find(
      (file) => file.size > 8 * 1024 * 1024
    );

    if (oversizedFile) {
      setFormError("Cada imagen puede pesar como máximo 8 MB.");
      e.target.value = "";
      return;
    }

    const prepared = selected.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setNewImages((current) => [...current, ...prepared]);

    if (files.length > available) {
      setFormError(
        `Solo se añadieron ${available} imágenes porque el máximo es ${MAX_IMAGES}.`
      );
    }

    e.target.value = "";
  }

  function removeExistingImage(url: string) {
    setFormError(null);
    setExistingImages((current) =>
      current.filter((image) => image !== url)
    );
  }

  function removeNewImage(index: number) {
    setFormError(null);

    setNewImages((current) => {
      const target = current[index];

      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }

      return current.filter((_, i) => i !== index);
    });
  }

  function makeExistingImagePrimary(url: string) {
    setFormError(null);

    setExistingImages((current) => [
      url,
      ...current.filter((image) => image !== url),
    ]);
  }

  function makeNewImagePrimary(index: number) {
    setFormError(null);

    const selected = newImages[index];
    if (!selected) return;

    setNewImages((current) =>
      current.filter((_, i) => i !== index)
    );

    setExistingImages((current) => current);

    setNewImages((current) => [selected, ...current]);
  }

  async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) {
    return file;
  }

  const bitmap = await createImageBitmap(file);

  const MAX_WIDTH = 1600;
  const MAX_HEIGHT = 1600;

  let width = bitmap.width;
  let height = bitmap.height;

  const scale = Math.min(
    1,
    MAX_WIDTH / width,
    MAX_HEIGHT / height
  );

  width = Math.round(width * scale);
  height = Math.round(height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    bitmap.close();
    return file;
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(
      resolve,
      "image/jpeg",
      0.78
    );
  });

  if (!blob) {
    return file;
  }

  if (blob.size >= file.size) {
    return file;
  }

  const originalName =
    file.name.replace(/\.[^/.]+$/, "") || "foto";

  return new File(
    [blob],
    `${originalName}.jpg`,
    {
      type: "image/jpeg",
      lastModified: Date.now(),
    }
  );
}

async function uploadNewImages() {
  if (newImages.length === 0) return [];

  const uploadedUrls: string[] = [];

  const filesToUpload = await Promise.all(
    newImages
      .slice(0, MAX_IMAGES)
      .map((item) => compressImage(item.file))
  );

  for (const file of filesToUpload) {
    const formData = new FormData();
    formData.append("files", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok || !data?.ok) {
      throw new Error(
        data?.error ?? "No se pudieron subir las imágenes."
      );
    }

    const urls = Array.isArray(data?.urls)
      ? data.urls
          .map((url: unknown) => String(url ?? "").trim())
          .filter(Boolean)
      : [];

    uploadedUrls.push(...urls);
  }

  return uploadedUrls;
}

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    setSaving(true);
    setFormError(null);

    try {
      if (totalImages === 0) {
        setFormError("El anuncio debe tener al menos una imagen.");
        return;
      }

      const uploadedUrls = await uploadNewImages();

      const finalImages = [
        ...existingImages,
        ...uploadedUrls,
      ].slice(0, MAX_IMAGES);

      if (finalImages.length === 0) {
        setFormError("El anuncio debe tener al menos una imagen.");
        return;
      }

      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: price.trim(),
          phone: phone.replace(/\D/g, "").slice(0, 10),
          imageUrls: finalImages,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        setFormError(data?.error ?? "Error al guardar.");
        return;
      }

      router.push(`/listing/${id}`);
      router.refresh();
    } catch (error: any) {
      setFormError(
        error?.message ?? "Error al guardar. Intenta de nuevo."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-10 md:py-10">
        <div className="mx-auto max-w-[800px] rounded-3xl bg-white p-8 shadow">
          Cargando...
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-10 md:py-10">
        <div className="mx-auto max-w-[800px] rounded-3xl bg-white p-8 shadow">
          <h1 className="text-2xl font-black text-slate-900">
            Editar anuncio
          </h1>

          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            {loadError}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/mis-anuncios"
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700"
            >
              Volver a mis anuncios
            </Link>

            <Link
              href="/api/auth/signin"
              className="rounded-xl bg-[#0f3c8c] px-6 py-3 font-bold text-white"
            >
              Iniciar sesión
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-slate-900 px-6 py-3 font-bold text-white"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-28 pt-6 sm:px-6 md:py-10">
      <div className="mx-auto max-w-[800px] rounded-3xl bg-white p-5 shadow sm:p-8">
        <h1 className="text-2xl font-black text-slate-900">
          Editar anuncio
        </h1>

        <p className="mt-2 text-sm font-medium text-slate-500">
          Actualiza los datos y las fotografías de tu publicación.
        </p>

        <form onSubmit={handleSave} className="mt-6 space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-700">
              Título
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
              placeholder="Título"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Descripción
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-[140px] w-full rounded-xl border border-slate-200 p-3"
              placeholder="Descripción"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Precio
            </label>

            <input
              value={price}
              onChange={(e) =>
                setPrice(e.target.value.replace(/\D/g, ""))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
              placeholder="Precio"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">
              Teléfono
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value.replace(/\D/g, "").slice(0, 10)
                )
              }
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
              placeholder="Teléfono"
              inputMode="numeric"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-sm font-black text-slate-900">
                  Imágenes
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Puedes añadir, eliminar o cambiar la foto principal.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-500">
                {totalImages}/{MAX_IMAGES}
              </span>
            </div>

            {allImages.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {existingImages.map((url, index) => (
                  <div
                    key={`existing-${url}-${index}`}
                    className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white"
                  >
                    <div className="aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {index === 0 && (
                      <div className="absolute left-2 top-2 rounded-full bg-[#0f3c8c] px-2 py-1 text-[10px] font-black text-white shadow">
                        PRINCIPAL
                      </div>
                    )}

                    <div className="space-y-1.5 p-2">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() =>
                            makeExistingImagePrimary(url)
                          }
                          className="w-full rounded-lg bg-slate-100 px-2 py-2 text-[11px] font-bold text-slate-700"
                        >
                          Hacer principal
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => removeExistingImage(url)}
                        className="w-full rounded-lg bg-red-50 px-2 py-2 text-[11px] font-bold text-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}

                {newImages.map((item, index) => (
                  <div
                    key={`new-${item.preview}`}
                    className="relative overflow-hidden rounded-2xl border border-blue-200 bg-white"
                  >
                    <div className="aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={item.preview}
                        alt={`Nueva imagen ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="absolute right-2 top-2 rounded-full bg-blue-600 px-2 py-1 text-[10px] font-black text-white shadow">
                      NUEVA
                    </div>

                    <div className="space-y-1.5 p-2">
                      <button
                        type="button"
                        onClick={() => makeNewImagePrimary(index)}
                        className="w-full rounded-lg bg-slate-100 px-2 py-2 text-[11px] font-bold text-slate-700"
                      >
                        Hacer principal
                      </button>

                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="w-full rounded-lg bg-red-50 px-2 py-2 text-[11px] font-bold text-red-600"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm font-medium text-slate-500">
                El anuncio no tiene imágenes seleccionadas.
              </div>
            )}

            {totalImages < MAX_IMAGES && (
              <div className="mt-4">
                <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-[#0f3c8c] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0c2f6d]">
                  Añadir fotos
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    onChange={handleAddImages}
                    className="hidden"
                  />
                </label>

                <p className="mt-2 text-xs text-slate-500">
                  JPG, PNG o WEBP. Máximo 8 MB por imagen y 25 fotos
                  por anuncio.
                </p>
              </div>
            )}
          </div>

          {formError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="h-12 rounded-xl bg-[#0f3c8c] px-6 font-bold text-white disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() => router.push("/mis-anuncios")}
              className="h-12 rounded-xl border border-slate-200 bg-white px-6 font-bold text-slate-700 disabled:opacity-60"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}