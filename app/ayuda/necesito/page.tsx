"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Heart,
  Clock,
  XCircle,
} from "lucide-react";
import { AID_CATEGORIES, AID_CITIES } from "@/lib/aidRequestPolicy";

type MyAidRequest = {
  id: string;
  title: string;
  category: string;
  city: string;
  description: string;
  contextImageUrl: string | null;
  status: string;
  isActive: boolean | null;
  rejectionReason: string | null;
  createdAt: string;
  reviewedAt: string | null;
  completedAt: string | null;
};

const STATUS_INFO: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pendiente de revisión", className: "bg-amber-100 text-amber-700" },
  APPROVED: { label: "Aprobada y publicada", className: "bg-emerald-100 text-emerald-700" },
  MATCHED: { label: "En proceso de ayuda", className: "bg-blue-100 text-blue-700" },
  REJECTED: { label: "Rechazada", className: "bg-rose-100 text-rose-700" },
  COMPLETED: { label: "Atendida", className: "bg-slate-100 text-slate-600" },
  CANCELLED: { label: "Cancelada", className: "bg-slate-100 text-slate-600" },
};

export default function NecesitoAyudaPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("Pereira");
  const [description, setDescription] = useState("");
  const [contextImageUrl, setContextImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [verificationStatus, setVerificationStatus] = useState<{
    loaded: boolean;
    isVerified: boolean;
    whatsappNumber: string | null;
  }>({ loaded: false, isVerified: false, whatsappNumber: null });

  const [activeRequest, setActiveRequest] = useState<MyAidRequest | null>(null);
  const [history, setHistory] = useState<MyAidRequest[]>([]);
  const [mineLoaded, setMineLoaded] = useState(false);

  const fetchState = useCallback(async () => {
    try {
      const [verRes, mineRes] = await Promise.all([
        fetch("/api/verification-status"),
        fetch("/api/aid-requests/mine"),
      ]);

      const verData = await verRes.json();
      if (verData.ok) {
        setVerificationStatus({
          loaded: true,
          isVerified: verData.isVerified,
          whatsappNumber: verData.whatsappNumber || null,
        });
      } else {
        setVerificationStatus((prev) => ({ ...prev, loaded: true }));
      }

      const mineData = await mineRes.json();
      if (mineData.ok) {
        setActiveRequest(mineData.active || null);
        setHistory(mineData.requests || []);
      }
    } catch (err) {
      console.error("Error cargando estado:", err);
      setVerificationStatus((prev) => ({ ...prev, loaded: true }));
    } finally {
      setMineLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (session?.user?.email) {
      fetchState();
    }
  }, [session, fetchState]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    formData.append("files", files[0]);

    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Error subiendo la imagen");
      }

      setContextImageUrl(data.urls?.[0] || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error subiendo la imagen");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }
    if (!category) {
      setError("Selecciona una categoría.");
      return;
    }
    if (description.trim().length < 20) {
      setError("Describe tu necesidad con al menos 20 caracteres.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/aid-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category,
          city,
          description: description.trim(),
          contextImageUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Error enviando la solicitud");
      }

      setSuccess(true);
      fetchState();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error enviando la solicitud");
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(id: string, action: "cancel" | "complete") {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(`/api/aid-requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo actualizar la solicitud");
      }
      await fetchState();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar la solicitud");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB]">
        <div className="text-lg font-bold text-slate-900">Cargando...</div>
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-6">
        <div className="rounded-3xl bg-white p-8 shadow text-center">
          <p className="text-lg font-bold text-slate-900 mb-4">
            Debes iniciar sesión para solicitar ayuda
          </p>
          <button
            onClick={() => router.push("/api/auth/signin")}
            className="rounded-xl bg-[#0f3c8c] px-6 py-3 text-sm font-black text-white hover:bg-[#0c2f6d]"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (!verificationStatus.loaded || !mineLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB]">
        <div className="text-lg font-bold text-slate-900">Cargando...</div>
      </div>
    );
  }

  if (!verificationStatus.isVerified) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-6 md:px-6 md:py-10">
        <div className="mx-auto max-w-[600px]">
          <Link
            href="/ayuda"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver a Kubo Ayuda
          </Link>

          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-black text-slate-900">
                Cuenta verificada requerida
              </h2>
            </div>

            <p className="text-sm leading-6 text-slate-700 mb-6">
              Para proteger a donantes y beneficiarios, necesitamos que tu cuenta esté verificada antes de solicitar ayuda. Esto incluye verificar tu número de WhatsApp.
            </p>

            <Link
              href="/verificar-identidad"
              className="block w-full rounded-xl bg-[#0f3c8c] px-6 py-3 text-center text-sm font-black text-white hover:bg-[#0c2f6d]"
            >
              Verificar mi cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-6">
        <div className="rounded-3xl bg-white p-8 shadow text-center max-w-md">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            ¡Solicitud enviada!
          </h2>
          <p className="text-slate-600 mb-4">
            Tu solicitud quedó pendiente de revisión. Un administrador de Kubo la revisará antes de publicarla.
          </p>
          <Link
            href="/ayuda"
            className="inline-block rounded-xl bg-[#0f3c8c] px-6 py-3 text-sm font-black text-white hover:bg-[#0c2f6d]"
          >
            Volver a Kubo Ayuda
          </Link>
        </div>
      </div>
    );
  }

  const lastRejected = history.find((r) => r.status === "REJECTED");

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[800px]">
        <Link
          href="/ayuda"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a Kubo Ayuda
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-6 w-6 text-rose-600" />
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">
              ¿Qué necesitas?
            </h1>
          </div>

          {activeRequest ? (
            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 md:p-8">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-[#0f3c8c]" />
                <h2 className="text-xl font-black text-slate-900">
                  Ya tienes una solicitud activa
                </h2>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide ${STATUS_INFO[activeRequest.status]?.className ?? "bg-slate-100 text-slate-600"}`}
                  >
                    {STATUS_INFO[activeRequest.status]?.label ?? activeRequest.status}
                  </span>
                </div>
                <p className="mt-3 text-base font-black text-slate-900">
                  {activeRequest.title}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {activeRequest.description}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  {activeRequest.city} · enviada el{" "}
                  {new Date(activeRequest.createdAt).toLocaleDateString("es-CO")}
                </p>
              </div>

              {error && (
                <p className="mt-3 text-sm font-medium text-rose-600">{error}</p>
              )}

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                {["APPROVED", "MATCHED"].includes(activeRequest.status) && (
                  <button
                    onClick={() => handleAction(activeRequest.id, "complete")}
                    disabled={loading}
className="flex-1 rounded-xl bg-[#0f3c8c] px-5 py-3 text-sm font-black text-white hover:bg-[#0c2f6d] disabled:opacity-60"                  >
                    Ya recibí la ayuda
                  </button>
                )}
                <button
                  onClick={() => handleAction(activeRequest.id, "cancel")}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-rose-200 bg-rose-50 px-5 py-3 text-sm font-black text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                >
                  Cancelar solicitud
                </button>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Solo puedes tener una solicitud activa a la vez.
              </p>
            </div>
          ) : (
            <>
              {lastRejected?.rejectionReason && (
                <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-rose-600" />
                    <span className="text-sm font-black text-slate-900">
                      Tu última solicitud fue rechazada
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-700">
                    Motivo: {lastRejected.rejectionReason}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 mb-6 mt-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-rose-600" />
                  <span className="text-sm font-semibold text-slate-900">
                    Reglas de Kubo Ayuda
                  </span>
                </div>
                <ul className="text-sm text-slate-600 space-y-1 ml-6">
                  <li>• No se permite solicitar dinero, transferencias, préstamos ni recargas.</li>
                  <li>• Describe una necesidad concreta de artículos o ayuda material.</li>
                  <li>• Tu solicitud será revisada antes de publicarse.</li>
                  <li>• Se usará tu WhatsApp verificado ({verificationStatus.whatsappNumber}).</li>
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Título de tu necesidad *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={80}
                    placeholder="Ej: Necesito una silla de ruedas para mi madre"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0f3c8c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Categoría *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0f3c8c] focus:outline-none"
                  >
                    <option value="">Selecciona una categoría</option>
                    {AID_CATEGORIES.map((cat) => (
                      <option key={cat.slug} value={cat.slug}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {category === "vivienda-y-alojamiento-temporal" && (
                    <p className="mt-2 text-xs leading-4 text-rose-600">
                      Esta categoría no permite pedir dinero, arriendo ni transferencias; únicamente necesidades concretas de alojamiento temporal.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Ciudad *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0f3c8c] focus:outline-none"
                  >
                    {AID_CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Describe tu necesidad *
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    maxLength={1000}
                    placeholder="Explica qué necesitas y por qué. No incluyas datos bancarios ni solicitudes de dinero."
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 focus:border-[#0f3c8c] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Foto de contexto (opcional)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-600"
                  />
                  {contextImageUrl && (
                    <p className="mt-2 flex items-center gap-1 text-xs text-emerald-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Imagen subida correctamente
                    </p>
                  )}
                </div>

                {error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <p className="text-sm font-medium text-rose-700">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-2xl bg-[#0f3c8c] px-6 py-4 text-sm font-black text-white transition hover:bg-[#0c2f6d] disabled:opacity-60 md:text-base"
                >
                  {loading ? "Enviando..." : "Enviar solicitud para revisión"}
                </button>
              </form>
            </>
          )}

          {history.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-black text-slate-900 mb-3">
                Historial de solicitudes
              </h2>
              <div className="space-y-3">
                {history.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-bold text-slate-900">{r.title}</p>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-wide ${STATUS_INFO[r.status]?.className ?? "bg-slate-100 text-slate-600"}`}
                      >
                        {STATUS_INFO[r.status]?.label ?? r.status}
                      </span>
                    </div>
                    {r.status === "REJECTED" && r.rejectionReason && (
                      <p className="mt-1 text-xs text-rose-600">
                        Motivo: {r.rejectionReason}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
