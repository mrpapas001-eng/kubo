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
  contactUrl?: string;
};

export default function MobileListingActions({
  listingId,
  title,
  url,
  whatsappHref,
  canUseWhatsapp,
  contactUrl,
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

  function trackSellerContact() {
    if (!canUseWhatsapp) return;

    void fetch(`/api/listings/${encodeURIComponent(listingId)}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "WHATSAPP_CLICK" }),
      keepalive: true,
    }).catch(() => undefined);
  }

  const sellerContactHref = canUseWhatsapp
    ? whatsappHref
    : contactUrl || "#";

  const canContactSeller = canUseWhatsapp || Boolean(contactUrl);

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-2 pb-[calc(max(env(safe-area-inset-bottom),0.35rem)+4.75rem)] pt-1.5 shadow-[0_-10px_28px_rgba(15,23,42,0.10)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-[1fr_1fr_44px] gap-2">
        <a
          href={sellerContactHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackSellerContact}
          className={`flex h-10 items-center justify-center gap-1.5 rounded-xl text-xs font-black text-white ${
            !canContactSeller
              ? "pointer-events-none bg-slate-400 opacity-50"
              : canUseWhatsapp
                ? "bg-green-500 hover:bg-green-600"
                : "bg-[#4f32c8] hover:bg-[#3f28a8]"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {canUseWhatsapp ? "WhatsApp" : "Contactar"}
        </a>

        <StartChatButton listingId={listingId} compact />

        <button
          type="button"
          onClick={handleShare}
          aria-label={shared ? "Enlace copiado" : "Compartir anuncio"}
          className="flex h-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
