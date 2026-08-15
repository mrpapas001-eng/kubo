"use client";

import { useState } from "react";
import { MessageCircle, Share2 } from "lucide-react";
import StartChatButton from "@/components/StartChatButton";

type Props = {
  listingId: string;
  title: string;
  url: string;
  whatsappHref: string;
  canUseWhatsapp: boolean;
};

export default function MobileListingActions({
  listingId,
  title,
  url,
  whatsappHref,
  canUseWhatsapp,
}: Props) {
  const [shared, setShared] = useState(false);

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        setShared(true);
        window.setTimeout(() => setShared(false), 1800);
      }
    } catch {}
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-3 pb-[calc(max(env(safe-area-inset-bottom),0.5rem)+4.75rem)] pt-2 shadow-[0_-10px_28px_rgba(15,23,42,0.10)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-[1fr_1fr_44px] gap-2">
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className={`flex h-11 items-center justify-center gap-2 rounded-2xl bg-green-500 text-sm font-black text-white ${
            canUseWhatsapp ? "hover:bg-green-600" : "pointer-events-none opacity-50"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </a>

        <StartChatButton listingId={listingId} />

        <button
          type="button"
          onClick={handleShare}
          aria-label={shared ? "Enlace copiado" : "Compartir anuncio"}
          className="flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
