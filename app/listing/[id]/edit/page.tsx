"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

/**
 * EditListingPage
 * - Carga el anuncio via GET /api/listings/:id
 * - Si no hay sesión pide login (callback a la misma URL)
 * - No redirige automáticamente en caso de error: muestra mensaje y botones
 * - Protege la edición mostrando "No autorizado" si el anuncio tiene owner distinto
 */
export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id ?? "");

  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    // Si no hay id válido, volvemos a mis-anuncios (es un caso raro)
    if (!id) {
      router.push("/mis-anuncios");
      return;
    }

    // Esperamos a que se determine la sesión
    if (status === "loading") {
      return;
    }

    // Si no está autenticado, pedimos login y volvemos a esta URL
    if (status === "unauthenticated") {
      const callback = typeof window !== "undefined" ? window.location.href : "/";
      signIn("google", { callbackUrl: callback });
      return;
    }

    // Cargamos el anuncio solo si tenemos sesion (o estamos comprobada)
    async function load() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/listings/${id}`);
        const data = await res.json();

        console.log("[Edit] GET /api/listings/:id", res.status, data);

        if (!data?.listing) {
          // No hay anuncio (404 o no autorizado por backend)
          setError("Anuncio no encontrado o no tienes permisos para editarlo.");
          setLoading(false);
          return;
        }

        const l = data.listing;

        setTitle(l.title ?? "");
        setDescription(l.description ?? "");
        setPrice(String(l.price ?? ""));
        setPhone(l.phone ?? "");

        // Verificación de propietario: si existe owner y no coincide con la sesión, bloquear
        const ownerTop =
          l.ownerEmail && typeof l.ownerEmail === "string"
            ? l.ownerEmail.toLowerCase().trim()
            : null;

        let ownerDetail: string | null = null;
        try {
          // details puede venir como objeto o string
          const details =
            typeof l.details === "string" ? JSON.parse(l.details || "{}") : l.details || {};
          if (details?.ownerEmail) ownerDetail = String(details.ownerEmail).toLowerCase().trim();
        } catch (e) {
          // ignore parse error
        }

        const owner = ownerTop || ownerDetail;

        if (owner && session?.user?.email) {
          const myEmail = String(session.user.email).toLowerCase().trim();
          if (owner !== myEmail) {
            setError("No autorizado para editar este anuncio.");
            setLoading(false);
            return;
          }
        }

      } catch (err) {
        console.error("[Edit] error cargando anuncio:", err);
        setError("Error al cargar el anuncio. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id, router, session, status]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          price: Number(price || 0),
          phone,
        }),
      });

      const data = await res.json();
      console.log("[Edit] PUT /api/listings/:id", res.status, data);

      if (data?.ok) {
        // Redirigimos a la vista del anuncio
        router.push(`/listing/${id}`);
        return;
      }

      setError(data?.error ?? "Error al guardar");
    } catch (err) {
      console.error("[Edit] error guardando:", err);
      setError("Error al guardar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  // UI: carga
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
        <div className="mx-auto max-w-[800px] rounded-3xl bg-white p-8 shadow">
          Cargando...
        </div>
      </div>
    );
  }

  // Si hay error lo mostramos y no redirigimos automáticamente
  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
        <div className="mx-auto max-w-[800px] rounded-3xl bg-white p-8 shadow">
          <h1 className="text-2xl font-black text-slate-900">Editar anuncio</h1>

          <div className="mt-6 rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => router.push("/mis-anuncios")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700"
            >
              Volver a mis anuncios
            </button>

            <button
              onClick={() => window.location.reload()}
              className="rounded-xl bg-[#0f3c8c] px-6 py-3 font-bold text-white"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de edición
  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 py-10">
      <div className="mx-auto max-w-[800px] rounded-3xl bg-white p-8 shadow">
        <h1 className="text-2xl font-black text-slate-900">Editar anuncio</h1>

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
            <label className="text-sm font-bold text-slate-700">Descripción</label>
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
            />
          </div>

          <div>
            <label className="text-sm font-bold text-slate-700">Teléfono</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-200 p-3"
              placeholder="Teléfono"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-[#0f3c8c] px-6 py-3 font-bold text-white"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/mis-anuncios")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}