"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Plus, Search, UserRound } from "lucide-react";

const items = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/buscar", label: "Buscar", icon: Search },
  { href: "/publish", label: "Publicar", icon: Plus, featured: true },
  { href: "/chat", label: "Chats", icon: MessageCircle },
  { href: "/mi-cuenta", label: "Perfil", icon: UserRound },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/chat")) {
    return null;
  }

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-3 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-10px_28px_rgba(15,23,42,0.10)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 items-end gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          if (item.featured) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label={item.label}
                className="flex min-w-0 flex-col items-center gap-1 text-[11px] font-extrabold text-blue-700"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30">
                  <Icon size={24} strokeWidth={3} />
                </span>
                <span className="truncate leading-none">{item.label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={`flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1.5 py-1.5 text-[11px] font-bold transition ${
                isActive ? "text-blue-700" : "text-slate-500"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.8 : 2.2} />
              <span className="truncate leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
