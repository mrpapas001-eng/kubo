"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Menu, X, Play } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function closeMenu() {
    setMobileMenuOpen(false);
  }

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    closeMenu();

    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="shrink-0" onClick={handleLogoClick}>
            <Image
              src="/kubo-logo-nuevo.png"
              alt="Kubo anuncios"
              width={1078}
              height={178}
              priority
              className="h-auto w-[170px] sm:w-[190px] md:w-[210px] lg:w-[220px]"
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

            {status === "loading" ? (
              <div className="text-sm font-semibold text-slate-500">
                Cargando...
              </div>
            ) : session ? (
              <div className="flex items-center gap-3">
                <Link href="/mi-cuenta" className="flex items-center gap-2">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user?.name || "Usuario"}
                      className="h-10 w-10 rounded-full border border-white object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-sm font-bold text-white shadow-sm">
                      {(session.user?.name || session.user?.email || "U")
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
              <button
                onClick={() => signIn("google")}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                type="button"
              >
                Entrar
              </button>
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
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 lg:hidden"
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
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

              {status === "loading" ? (
                <div className="px-3 py-2 text-sm font-semibold text-slate-500">
                  Cargando...
                </div>
              ) : session ? (
                <>
                  <div className="px-3 py-2 text-sm font-semibold text-slate-700">
                    {session.user?.name || session.user?.email}
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
                <button
                  onClick={() => {
                    closeMenu();
                    signIn("google");
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
                  type="button"
                >
                  Entrar
                </button>
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