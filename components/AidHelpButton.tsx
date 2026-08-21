"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Loader2 } from "lucide-react";

type AidHelpButtonProps = {
  requestId: string;
};

export default function AidHelpButton({
  requestId,
}: AidHelpButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleHelp() {
    try {
      setLoading(true);

      const response = await fetch("/api/aid-chat/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requestId,
        }),
      });

      const data = await response.json();

      if (response.status === 401) {
        alert("Debes iniciar sesión para ofrecer ayuda.");
        router.push("/api/auth/signin");
        return;
      }

      if (!response.ok || !data.ok) {
        alert(data.error || "No se pudo iniciar la conversación.");
        return;
      }

      router.push(`/chat/${data.conversationId}`);
    } catch (error) {
      console.error("Error iniciando ayuda:", error);
      alert("No se pudo iniciar la conversación.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleHelp}
      disabled={loading}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#1765e8] to-[#0f3c8c] px-5 py-3.5 text-sm font-black text-white shadow-[0_10px_24px_rgba(21,87,214,0.22)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Conectando...
        </>
      ) : (
        <>
          Quiero ayudar
          <Heart className="h-4 w-4 fill-white" />
        </>
      )}
    </button>
  );
}