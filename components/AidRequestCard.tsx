"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Heart, MapPin, Clock } from "lucide-react";
import { AID_CATEGORIES } from "@/lib/aidRequestPolicy";

export type PublicAidRequest = {
  id: string;
  title: string;
  category: string;
  city: string;
  description: string;
  contextImageUrl: string | null;
  status: string;
  ownerName: string | null;
  createdAt: string | Date;
};

function categoryLabel(slug: string): string {
  return AID_CATEGORIES.find((c) => c.slug === slug)?.label ?? slug;
}

export default function AidRequestCard({ request }: { request: PublicAidRequest }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isMatched = request.status === "MATCHED";

  async function handleContact() {
    setError("");

    if (!session?.user?.email) {
      router.push("/api/auth/signin");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/aid-requests/${request.id}/contact`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo obtener el contacto.");
      }

      window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo obtener el contacto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {request.contextImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={request.contextImageUrl}
          alt={request.title}
          className="h-40 w-full object-cover"
        />
      ) : (
        <div className="flex h-40 w-full items-center justify-center bg-rose-50">
          <Heart className="h-10 w-10 text-rose-300" />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-rose-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-rose-700">
            {categoryLabel(request.category)}
          </span>
          {isMatched && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-[11px] font-black uppercase tracking-wide text-amber-700">
              <Clock className="h-3 w-3" />
              En proceso
            </span>
          )}
        </div>

        <h3 className="mt-3 text-lg font-black leading-tight text-slate-900">
          {request.title}
        </h3>

        <p className="mt-2 line-clamp-3 text-sm leading-5 text-slate-600">
          {request.description}
        </p>

        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-slate-500">
          <MapPin className="h-3.5 w-3.5" />
          {request.city}
          {request.ownerName ? <span>· {request.ownerName}</span> : null}
        </div>

        {isMatched && (
          <p className="mt-2 text-xs leading-4 text-amber-700">
            Ya hay una ayuda en curso para esta solicitud, pero puedes contactar por si se necesita algo más.
          </p>
        )}

        {error && (
          <p className="mt-2 text-xs font-medium text-rose-600">{error}</p>
        )}

        <button
          onClick={handleContact}
          disabled={loading}
          className="mt-4 w-full rounded-2xl bg-[#0f3c8c] px-5 py-3 text-sm font-black text-white transition hover:bg-[#0c2f6d] disabled:opacity-60"
        >
          {loading ? "Cargando..." : "Quiero ayudar"}
        </button>

        {!session?.user?.email && (
          <p className="mt-2 text-center text-[11px] text-slate-400">
            Debes iniciar sesión para ver el contacto.
          </p>
        )}
      </div>
    </div>
  );
}
