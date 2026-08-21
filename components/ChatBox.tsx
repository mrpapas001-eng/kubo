"use client";

import { useEffect, useRef, useState } from "react";

type Message = {
  id: string;
  body: string;
  senderEmail: string;
  createdAt: string | Date;
  readAt?: string | Date | null;
};

type Props = {
  conversationId: string;
  initialMessages: Message[];
  currentUserEmail: string;
};

function formatTime(value: string | Date) {
  try {
    return new Intl.DateTimeFormat("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));
  } catch {
    return "";
  }
}

export default function ChatBox({
  conversationId,
  initialMessages,
  currentUserEmail,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  useEffect(() => {
    let alive = true;

    async function loadMessages() {
      try {
        const res = await fetch(
          `/api/chat/messages?conversationId=${conversationId}`,
          { cache: "no-store" }
        );

        const data = await res.json();

        if (!alive || !res.ok || !data?.ok || !Array.isArray(data.messages)) {
          return;
        }

        setMessages(data.messages);
      } catch {
        // Silencioso para no molestar al usuario si falla una petición puntual
      }
    }

    loadMessages();

    const interval = window.setInterval(loadMessages, 3000);

    return () => {
      alive = false;
      window.clearInterval(interval);
    };
  }, [conversationId]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();

    const clean = text.trim();
    if (!clean) return;

    setLoading(true);

    try {
      const res = await fetch("/api/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, message: clean }),
      });

      const data = await res.json();

      if (!res.ok || !data?.ok) {
        alert(data?.error ?? "No se pudo enviar el mensaje.");
        return;
      }

      setMessages((prev) => [...prev, data.message]);
      setText("");
    } catch {
      alert("Error enviando mensaje.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overflow-x-hidden bg-[radial-gradient(circle_at_top_left,_rgba(79,70,229,0.10),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(15,60,140,0.08),_transparent_40%),linear-gradient(to_bottom,#f8fafc,#eef2ff)] p-5 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="mx-auto w-fit rounded-full bg-white/90 px-4 py-2 text-xs font-black text-slate-500 shadow-sm">
          Hoy
        </div>

        {messages.map((msg) => {
          const isMe =
            currentUserEmail &&
            msg.senderEmail?.toLowerCase().trim() === currentUserEmail;
          const isRead = isMe && Boolean(msg.readAt);

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[72%] rounded-[24px] px-5 py-3.5 text-[15px] leading-relaxed shadow-[0_10px_26px_rgba(15,23,42,0.08)] backdrop-blur-sm ${
                  isMe
                    ? "rounded-br-md bg-[#d1f7c4] text-slate-900"
                    : "rounded-bl-md bg-white text-slate-800"
                }`}
              >
                <div>{msg.body}</div>

                <div
                  className={`mt-1 flex items-center justify-end gap-1 text-[10px] font-medium ${
                    isMe ? "text-green-700" : "text-slate-400"
                  }`}
                >
                  <span className="opacity-70">{formatTime(msg.createdAt)}</span>
                  {isMe ? (
                    <span
                      className={isRead ? "font-black text-blue-500" : "font-black text-slate-500"}
                      title={isRead ? "Leído" : "Enviado"}
                      aria-label={isRead ? "Mensaje leído" : "Mensaje enviado"}
                    >
                      ✓✓
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="mt-auto flex flex-none items-center gap-2 border-t border-slate-100 bg-white/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      >
        <button
          type="button"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0f3c8c] text-2xl font-black text-white shadow-md"
        >
          +
        </button>

        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="min-w-0 flex-1 rounded-full bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0f3c8c]/20"
        />

        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4f32c8] text-xl font-black text-white shadow-md transition hover:scale-105 hover:bg-[#3f28a0] disabled:opacity-50"
        >
          {loading ? "..." : "➤"}
        </button>
      </form>
    </div>
  );
}