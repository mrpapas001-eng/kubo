"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id ?? "");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push("/mis-anuncios");
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/listings/${id}`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data?.ok || !data?.listing) {
          setError(data?.error ?? "No pudimos cargar este anuncio.");
          return;
        }

        const l = data.listing;

        if (l.status === "deleted") {
          setIsDeleted(true);
          setError("Este anuncio fue eliminado y ya no se puede editar.");
          return;
        }

        setTitle(String(l.title ?? ""));
        setDescription(String(l.description ?? ""));
        setPrice(
          l.price !== null && l.price !== undefined ? String(l.price) : ""
        );
        setPhone(String(l.phone ?? ""));
      } catch {
        setError("Error al cargar el anuncio. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, router]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
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
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        setError(data?.error ?? "Error al guardar.");
        return;
      }

      router.push(`/listing/${id}`);
    } catch {
      setError("Error al guardar. Intenta de nuevo.");
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

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-10 md:py-10">
        <div className="mx-auto max-w-[800px] rounded-3xl bg-white p-8 shadow">
          <h1 className="text-2xl font-black text-slate-900">
            Editar anuncio
          </h1>

          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
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
    <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-10 md:py-10">
      <div className="mx-auto max-w-[800px] rounded-3xl bg-white p-8 shadow">
        <h1 className="text-2xl font-black text-slate-900">Editar anuncio</h1>
        <p className="mt-2 text-sm font-medium text-slate-500">
          Actualiza los datos principales de tu publicacion.
        </p>

        <form onSubmit={handleSave} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-700">Título</label>
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
            <label className="text-sm font-bold text-slate-700">Precio</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
              placeholder="Precio"
              inputMode="numeric"
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Teléfono</label>
            <input
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
              placeholder="Teléfono"
              inputMode="numeric"
            />
          </div>

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
              onClick={() => router.push("/mis-anuncios")}
              className="h-12 rounded-xl border border-slate-200 bg-white px-6 font-bold text-slate-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
