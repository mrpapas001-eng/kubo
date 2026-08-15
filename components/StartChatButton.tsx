"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

type Props = {
  listingId: string;
};

export default function StartChatButton({ listingId }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function startChat() {
    setLoading(true);

    try {
      const res = await fetch("/api/chat/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          message: "Hola, ¿sigue disponible?",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        alert(data?.error ?? "No se pudo iniciar el chat.");
        return;
      }

      router.push(`/chat/${data.conversationId}`);
    } catch {
      alert("Error iniciando el chat.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      disabled={loading}
      onClick={startChat}
      className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 hover:bg-slate-50 disabled:opacity-60"
    >
      <MessageCircle className="h-4 w-4" />
      {loading ? "Abriendo..." : "Chat interno"}
    </button>
  );
}