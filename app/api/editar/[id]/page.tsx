"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  params: Promise<{ id: string }>;
};

const CITIES = [
  "Pereira",
  "Dosquebradas",
  "Santa Rosa de Cabal",
  "La Virginia",
  "Cartago",
  "Armenia",
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Manizales",
  "Madrid, Cundinamarca",
  "Otra",
];

export default function EditarAnuncioPage({ params }: Props) {
  const router = useRouter();

  const [id, setId] = useState("");
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Pereira");

  useEffect(() => {
    async function init() {
      const resolved = await params;
      setId(resolved.id);

      try {
        const res = await fetch(`/api/listings/get-one?id=${resolved.id}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (!res.ok || !data?.ok) {
          throw new Error(data?.error ?? "No se pudo cargar el anuncio");
        }

        const item = data.listing;
        setTitle(item.title ?? "");
        setDescription(item.description ?? "");
        setPrice(String(item.price ?? ""));
        setPhone(item.phone ?? "");
        setCity(item.city ?? "Pereira");
      } catch (err: any) {
        setError(err?.message ?? "Error cargando anuncio");
      } finally {
        setLoadingPage(false);
      }
    }

    init();
  }, [params]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/listings/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          title,
          description,
          price: Number(price || 0),
          phone,
          city,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        throw new Error(data?.error ?? "No se pudo actualizar");
      }

      router.push("/mis-anuncios");
    } catch (err: any) {
      setError(err?.message ?? "Error actualizando anuncio");
    } finally {
      setSaving(false);
    }
  }

  if (loadingPage) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
        <div className="mx-auto max-w-[820px] rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">
            Cargando anuncio...
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
      <div className="mx-auto max-w-[820px] rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-black text-slate-900">Editar anuncio</h1>
        <p className="mt-2 font-medium text-slate-500">
          Actualiza la información de tu anuncio.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-bold text-slate-700">Título</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-[140px] w-full rounded-xl border border-slate-200 p-4"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Precio</label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4"
              inputMode="numeric"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Teléfono</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4"
              inputMode="numeric"
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Ciudad</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-xl bg-slate-900 px-6 font-black text-white disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/mis-anuncios")}
              className="h-11 rounded-xl border border-slate-200 bg-white px-6 text-sm font-extrabold text-slate-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}