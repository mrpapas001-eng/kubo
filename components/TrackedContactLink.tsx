"use client";

import type { ReactNode } from "react";

type Props = {
  listingId: string;
  eventType: "WHATSAPP_CLICK" | "PHONE_CLICK";
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export default function TrackedContactLink({
  listingId,
  eventType,
  href,
  children,
  className,
  target,
  rel,
}: Props) {
  function trackClick() {
    void fetch(`/api/listings/${encodeURIComponent(listingId)}/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: eventType }),
      keepalive: true,
    }).catch(() => undefined);
  }

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={trackClick}
      className={className}
    >
      {children}
    </a>
  );
}
