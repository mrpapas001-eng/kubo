"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Menu, X, Play } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loginMenuOpen, setLoginMenuOpen] = useState(false);
  const [unreadTotal, setUnreadTotal] = useState(0);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  function closeLoginMenu() {
    setLoginMenuOpen(false);
  }

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    closeMenu();
    closeLoginMenu();

    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function loginWithGoogle() {
    closeMenu();
    closeLoginMenu();
    signIn("google");
  }

  function loginWithFacebook() {
    closeMenu();
    closeLoginMenu();
    signIn("facebook");
  }

  useEffect(() => {
    if (!session?.user?.email) {
      setUnreadTotal(0);
      return;
    }

    let active = true;

    async function loadUnread() {
      try {
        const res = await fetch("/api/chat/unread", {
          cache: "no-store",
        });

        const data = await res.json();

        if (!active || !res.ok || !data?.ok) return;

        setUnreadTotal(Number(data.unreadTotal ?? 0));
      } catch {
        if (active) {
          setUnreadTotal(0);
        }
      }
    }

    loadUnread();

    const interval = window.setInterval(loadUnread, 5000);

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [session?.user?.email]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-4 md:py-3">
          <Link
            href="/"
            className="shrink-0"
            onClick={handleLogoClick}
          >
            <Image
              src="/kubo-logo-nuevo.png"
              alt="Kubo anuncios"
              width={1078}
              height={178}
              priority
              className="h-auto w-[200px] sm:w-[240px] md:w-[300px] lg:w-[360px]"
            />
          </Link>

          <div className="hidden items-center gap-5 lg:flex">
            <Link
              href="/"
              className="text-[15px] font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Inicio
            </Link>

            <Link
              href="/categoria"
              className="text-[15px] font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Categorías
            </Link>

            <Link
              href="/buscar"
              className="text-[15px] font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Buscar
            </Link>

            <Link
              href="/como-funciona"
              className="text-[15px] font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Cómo funciona
            </Link>

            <Link
              href="/#reels"
              className="inline-flex items-center gap-2 rounded-full bg-[#0f3c8c] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-[#0c2f6d]"
            >
              <Play className="h-4 w-4 fill-current" />
              Videos
            </Link>

            <Link
              href="/favoritos"
              className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              aria-label="Favoritos"
            >
              <Heart className="h-5 w-5" />
            </Link>

            <Link
              href="/mis-anuncios"
              className="text-[15px] font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Mis anuncios
            </Link>

            <Link
              href="/chat"
              className="relative inline-flex items-center gap-2 text-[15px] font-semibold text-slate-600 transition hover:text-slate-900"
            >
              Chats

              {unreadTotal > 0 ? (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0f3c8c] px-1.5 text-[11px] font-bold leading-none text-white shadow-sm">
                  {unreadTotal > 99 ? "99+" : unreadTotal}
                </span>
              ) : null}
            </Link>

            {status === "loading" ? (
              <div className="text-sm font-semibold text-slate-500">
                Cargando...
              </div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/mi-cuenta"
                  className="flex items-center gap-2"
                >
                  {session.user?.image ? (
  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-white bg-slate-100 shadow-sm">
    <img
      src={session.user.image}
      alt={session.user?.name || "Usuario"}
      className="h-full w-full object-cover"
    />
  </div>
) : (
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white shadow-sm">
    {(session.user?.name ||
      session.user?.email ||
      "U")
      .charAt(0)
      .toUpperCase()}
  </div>
)}
                </Link>

                <button
                  onClick={() => signOut()}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  type="button"
                >
                  Salir
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() =>
                    setLoginMenuOpen((prev) => !prev)
                  }
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                  type="button"
                >
                  Entrar
                </button>

                {loginMenuOpen ? (
                  <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[250px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                    <div className="px-3 pb-2 pt-1 text-xs font-black uppercase tracking-wide text-slate-400">
                      Iniciar sesión
                    </div>

                    <button
                      type="button"
                      onClick={loginWithGoogle}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-base font-black">
                        G
                      </span>

                      Continuar con Google
                    </button>

                    <button
                      type="button"
                      onClick={loginWithFacebook}
                      className="mt-1 flex w-full items-center gap-3 rounded-xl bg-[#1877F2] px-3 py-3 text-left text-sm font-bold text-white transition hover:bg-[#166fe5]"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-black text-[#1877F2]">
                        f
                      </span>

                      Continuar con Facebook
                    </button>
                  </div>
                ) : null}
              </div>
            )}

            <Link
              href="/publish"
              className="flex h-12 items-center justify-center rounded-2xl bg-[#0f3c8c] px-6 text-[15px] font-bold text-white shadow-[0_10px_30px_rgba(15,60,140,0.25)] transition hover:bg-[#0c2f6d]"
            >
              + Publicar anuncio
            </Link>
          </div>

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen((prev) => !prev)
            }
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-label={
              mobileMenuOpen ? "Cerrar menú" : "Abrir menú"
            }
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}

            {unreadTotal > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#0f3c8c] px-[6px] text-[10px] font-bold text-white">
                {unreadTotal > 99 ? "99+" : unreadTotal}
              </span>
            ) : null}
          </button>
        </div>

        {mobileMenuOpen ? (
          <div className="border-t border-slate-200 py-4 lg:hidden">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                onClick={closeMenu}
                className="rounded-xl px-3 py-2 text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Inicio
              </Link>

              <Link
                href="/categoria"
                onClick={closeMenu}
                className="rounded-xl px-3 py-2 text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Categorías
              </Link>

              <Link
                href="/buscar"
                onClick={closeMenu}
                className="rounded-xl px-3 py-2 text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Buscar
              </Link>

              <Link
                href="/#reels"
                onClick={closeMenu}
                className="rounded-xl bg-[#0f3c8c] px-3 py-2 text-[15px] font-bold text-white hover:bg-[#0c2f6d]"
              >
                Ver videos
              </Link>

              <Link
                href="/como-funciona"
                onClick={closeMenu}
                className="rounded-xl px-3 py-2 text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cómo funciona
              </Link>

              <Link
                href="/favoritos"
                onClick={closeMenu}
                className="rounded-xl px-3 py-2 text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Favoritos
              </Link>

              <Link
                href="/mis-anuncios"
                onClick={closeMenu}
                className="rounded-xl px-3 py-2 text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                Mis anuncios
              </Link>

              <Link
                href="/chat"
                onClick={closeMenu}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span>Chats</span>

                {unreadTotal > 0 ? (
                  <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0f3c8c] px-1.5 text-[11px] font-bold leading-none text-white shadow-sm">
                    {unreadTotal > 99
                      ? "99+"
                      : unreadTotal}
                  </span>
                ) : null}
              </Link>

              {status === "loading" ? (
                <div className="px-3 py-2 text-sm font-semibold text-slate-500">
                  Cargando...
                </div>
              ) : session ? (
                <>
                  <div className="px-3 py-2 text-sm font-semibold text-slate-700">
                    {session.user?.name ||
                      session.user?.email}
                  </div>

                  <Link
                    href="/mi-cuenta"
                    onClick={closeMenu}
                    className="rounded-xl px-3 py-2 text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Mi cuenta
                  </Link>

                  <button
                    onClick={() => {
                      closeMenu();
                      signOut();
                    }}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-left text-[15px] font-bold text-slate-700 hover:bg-slate-50"
                    type="button"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={loginWithGoogle}
                    className="flex h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  >
                    <span className="font-black">G</span>
                    Continuar con Google
                  </button>

                  <button
                    type="button"
                    onClick={loginWithFacebook}
                    className="flex h-12 items-center justify-center gap-3 rounded-xl bg-[#1877F2] px-4 text-sm font-bold text-white hover:bg-[#166fe5]"
                  >
                    <span className="text-lg font-black">
                      f
                    </span>
                    Continuar con Facebook
                  </button>
                </div>
              )}

              <Link
                href="/publish"
                onClick={closeMenu}
                className="mt-2 flex h-11 items-center justify-center rounded-xl bg-[#0f3c8c] px-5 text-[15px] font-bold text-white shadow-sm hover:bg-[#0c2f6d]"
              >
                + Publicar anuncio
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}