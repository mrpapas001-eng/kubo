"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, Heart } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  function handleSearch() {
    const value = query.trim();

    if (!value) {
      router.push("/");
      return;
    }

    router.push(`/buscar?q=${encodeURIComponent(value)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto max-w-[1400px] px-4 md:px-6">
        <div className="flex items-center justify-between gap-4 py-4 md:gap-6">
          <Link href="/" className="shrink-0">
            <Image
              src="/kubo-logo-nuevo.png"
              alt="Kubo anuncios"
              width={1078}
              height={178}
              priority
              className="h-auto w-[380px] md:w-[460px]"
            />
          </Link>

          <div className="ml-auto hidden items-center gap-6 lg:flex">
            <Link
              href="/"
              className="text-[16px] font-semibold text-slate-700 hover:text-slate-900"
            >
              Inicio
            </Link>

            <Link
              href="#"
              className="text-[16px] font-semibold text-slate-700 hover:text-slate-900"
            >
              Mapa
            </Link>

            <Link
              href="/favoritos"
              className="flex items-center gap-2 text-[16px] font-semibold text-slate-700 hover:text-slate-900"
            >
              <Heart className="h-4 w-4" />
              Favoritos
            </Link>

            <Link
              href="/mis-anuncios"
              className="text-[16px] font-semibold text-slate-700 hover:text-slate-900"
            >
              Mis anuncios
            </Link>

            <Link
              href="/publish"
              className="text-[16px] font-semibold text-slate-700 hover:text-slate-900"
            >
              Vender
            </Link>

            {session ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/mi-cuenta"
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  Mi cuenta
                </Link>

                <span className="max-w-[180px] truncate text-sm font-semibold text-slate-700">
                  {session.user?.name || session.user?.email}
                </span>

                <button
                  onClick={() => signOut()}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                >
                  Salir
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn("google")}
                className="rounded-xl bg-[#0f3c8c] px-4 py-2 text-sm font-bold text-white hover:bg-[#0c2f6d]"
              >
                Entrar con Google
              </button>
            )}

            <Link
              href="/publish"
              className="flex h-11 items-center justify-center rounded-xl bg-[#0f3c8c] px-5 text-[15px] font-bold text-white shadow-sm hover:bg-[#0c2f6d]"
            >
              + Publicar anuncio
            </Link>
          </div>
        </div>

        <div className="pb-4">
          <div className="max-w-[720px]">
            <div className="flex h-12 items-center overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center pl-4 pr-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>

              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar carros, motos, repuestos..."
                className="h-full flex-1 text-[15px] font-medium text-slate-700 outline-none placeholder:text-slate-400"
              />

              <button
                onClick={handleSearch}
                className="flex h-12 w-14 items-center justify-center bg-[#0f3c8c] text-white hover:bg-[#0c2f6d]"
                type="button"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}