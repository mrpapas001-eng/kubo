"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { MessageCircle, Phone } from "lucide-react";

export default function AidRequestHelpActions({
  requestId,
}: {
  requestId: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loadingChat, setLoadingChat] = useState(false);
  const [loadingWhatsapp, setLoadingWhatsapp] = useState(false);
  const [error, setError] = useState("");

  function requireLogin(): boolean {
    if (!session?.user?.email) {
      router.push("/api/auth/signin");
      return false;
    }
    return true;
  }

  async function handleChat() {
    setError("");
    if (!requireLogin()) return;

    try {
      setLoadingChat(true);
      const res = await fetch(`/api/aid-requests/${requestId}/chat`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "No se pudo iniciar el chat.");
      }

      router.push(`/chat/${data.conversationId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo iniciar el chat.");
      setLoadingChat(false);
    }
  }

  async function handleWhatsapp() {
    setError("");
    if (!requireLogin()) return;

    try {
      setLoadingWhatsapp(true);
      const res = await fetch(`/api/aid-requests/${requestId}/contact`, {
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
      setLoadingWhatsapp(false);
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-2 text-xs font-medium text-rose-600">{error}</p>
      )}

      <button
        onClick={handleChat}
        disabled={loadingChat}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#0c2f6d] disabled:opacity-60"
      >
        <MessageCircle className="h-4 w-4" />
        {loadingChat ? "Abriendo chat..." : "Contactar por Chat de Kubo"}
      </button>

      <button
        onClick={handleWhatsapp}
        disabled={loadingWhatsapp}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-600 bg-white px-5 py-3.5 text-sm font-black text-emerald-700 transition hover:bg-emerald-50 disabled:opacity-60"
      >
        <Phone className="h-4 w-4" />
        {loadingWhatsapp ? "Cargando..." : "Contactar por WhatsApp verificado"}
      </button>

      {!session?.user?.email && (
        <p className="mt-3 text-center text-[11px] text-slate-400">
          Debes iniciar sesión para ver cualquier medio de contacto.
        </p>
      )}
    </div>
  );
}
