"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search, ChevronDown } from "lucide-react";

const CATEGORY_OPTIONS = [
  { value: "", label: "Todas las categorías" },
  { value: "motor", label: "Motor" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
  { value: "celulares", label: "Celulares" },
  { value: "empleo", label: "Empleo" },
  { value: "servicios", label: "Servicios" },
  { value: "negocios", label: "Negocios" },
  { value: "informatica", label: "Informática" },
  { value: "moda", label: "Moda" },
  { value: "bebes", label: "Bebés" },
  { value: "mascotas", label: "Mascotas" },
];

export default function HomeHero() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("Pereira");

  function handleSearch() {
    const params = new URLSearchParams();

    if (query.trim()) params.set("q", query.trim());
    if (category) params.set("category", category);
    if (city) params.set("city", city);

    const qs = params.toString();
    router.push(qs ? `/buscar?${qs}` : "/buscar");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  function handleChipClick(value: string) {
    router.push(`/categoria/${value}`);
  }

  return (
    <section className="mt-4 w-full">
      <div className="relative w-full overflow-hidden rounded-[32px] border border-white/40 shadow-[0_24px_60px_rgba(15,23,42,0.10)]">
        <img
          src="/hero-pereira.png"
          alt="Kubo"
          className="absolute inset-0 h-full w-full object-cover object-[center_65%] md:object-[center_62%]"
        />

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.28)_0%,rgba(15,23,42,0.16)_42%,rgba(15,23,42,0.08)_100%)]" />
        <div className="absolute inset-0 bg-black/3" />

        <div className="relative px-6 py-5 text-white md:px-10 md:py-8 lg:px-12 lg:py-9">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-white/90 backdrop-blur-md">
                Anuncios reales, personas reales
              </div>

              <h1 className="mt-4 max-w-3xl text-4xl font-black leading-[1.02] tracking-[-0.04em] md:text-5xl lg:text-[58px]">
                Encuentra lo que
                <br className="hidden md:block" />
                buscas, cerca de ti
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
                Compra, vende o encuentra servicios en tu ciudad con total confianza.
              </p>
            </div>

            <div className="lg:pt-0">
              <div className="rounded-[20px] border border-white/10 bg-slate-900/35 px-5 py-4 backdrop-blur-md">
                <div className="flex items-center gap-2 text-sm font-black text-white">
                  <MapPin className="h-4 w-4 text-rose-300" />
                  {city}, Colombia
                </div>
                <div className="mt-1 text-sm text-white/75">Cambiar ciudad</div>
              </div>
            </div>
          </div>

          <div className="mt-4 max-w-5xl">
            <div className="flex flex-col overflow-hidden rounded-2xl border border-white/15 bg-white shadow-[0_18px_35px_rgba(15,23,42,0.18)] md:flex-row">
              <div className="flex h-14 items-center gap-3 px-4 md:flex-1">
                <Search className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="¿Qué estás buscando?"
                  className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="hidden w-px bg-slate-200 md:block" />

              <div className="relative flex h-14 items-center md:w-[240px]">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-full w-full appearance-none bg-transparent px-4 pr-10 text-sm font-semibold text-slate-700 outline-none"
                >
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-slate-400" />
              </div>

              <div className="hidden w-px bg-slate-200 md:block" />

              <div className="relative flex h-14 items-center md:w-[190px]">
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-full w-full appearance-none bg-transparent px-4 pl-10 pr-8 text-sm font-semibold text-slate-700 outline-none"
                >
                  <option value="Pereira">Pereira</option>
                  <option value="Dosquebradas">Dosquebradas</option>
                  <option value="Santa Rosa de Cabal">Santa Rosa de Cabal</option>
                  <option value="La Virginia">La Virginia</option>
                  <option value="Cartago">Cartago</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Bogotá">Bogotá</option>
                  <option value="Medellín">Medellín</option>
                  <option value="Cali">Cali</option>
                </select>
                <MapPin className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" />
              </div>

              <div className="p-2 md:pl-0">
                <button
                  onClick={handleSearch}
                  className="h-10 w-full rounded-xl bg-[#0f3c8c] px-6 text-sm font-black text-white transition hover:bg-[#0c2f6d] md:w-auto"
                >
                  Buscar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}