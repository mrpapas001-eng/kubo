"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Search,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const CATEGORY_OPTIONS = [
  { value: "", label: "Todas las categorías" },
  { value: "motor", label: "Motor" },
  { value: "inmobiliaria", label: "Inmobiliaria" },
  { value: "celulares", label: "Celulares" },
  { value: "empleo", label: "Empleo" },
  { value: "servicios", label: "Servicios" },
  { value: "negocios", label: "Negocios" },
  { value: "informatica", label: "Informática" },
  {
    value: "electrodomesticos",
    label: "Electrodomésticos",
  },
  { value: "moda", label: "Moda" },
  { value: "bebes", label: "Bebés" },
  { value: "mascotas", label: "Mascotas" },
  { value: "juguetes", label: "Juguetes" },
  {
    value: "papeleria-oficina",
    label: "Papelería y Oficina",
  },
  {
    value: "herramientas-ferreteria",
    label: "Herramientas y Ferretería",
  },
  {
    value: "salud-belleza",
    label: "Salud y Belleza",
  },
];

const CITY_OPTIONS = [
  "Pereira",
  "Dosquebradas",
  "Santa Rosa de Cabal",
  "La Virginia",
  "Cartago",
  "Armenia",
  "Bogotá",
  "Medellín",
  "Cali",
];

export default function HomeHero() {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("Pereira");
  const [showCityPicker, setShowCityPicker] = useState(false);

  function handleSearch() {
    const params = new URLSearchParams();

    if (query.trim()) {
      params.set("q", query.trim());
    }

    if (category) {
      params.set("category", category);
    }

    if (city) {
      params.set("city", city);
    }

    const qs = params.toString();

    router.push(qs ? `/buscar?${qs}` : "/buscar");
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  function selectCity(value: string) {
    setCity(value);
    setShowCityPicker(false);
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
                <span className="block">Encuentra</span>
                <span className="block">lo que buscas,</span>
                <span className="block">cerca de ti</span>
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/85 md:text-base">
                Compra, vende o encuentra servicios en tu ciudad
                con total confianza.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:pt-0">
              <Link
                href="/ayuda"
                className="group flex items-center gap-2 rounded-xl bg-amber-400 px-3 py-2 shadow-lg transition hover:bg-amber-300 md:px-4 md:py-2.5"
              >
                <span className="text-[10px] font-black text-[#0f3c8c] md:text-xs">
                  🇨🇴 CON KUBO AYUDA ❤️
                </span>

                <span className="hidden text-xs font-semibold text-[#0f3c8c] md:inline">
                  Personas ayudando a personas
                </span>

                <ArrowRight className="h-3.5 w-3.5 text-[#0f3c8c] transition group-hover:translate-x-0.5 md:h-4 md:w-4" />
              </Link>

              <div className="relative">
                <div className="rounded-[20px] border border-white/10 bg-slate-900/35 px-5 py-4 backdrop-blur-md">
                  <div className="flex items-center gap-2 text-sm font-black text-white">
                    <MapPin className="h-4 w-4 text-rose-300" />
                    {city}, Colombia
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowCityPicker((prev) => !prev)
                    }
                    className="mt-1 flex items-center gap-1 text-sm text-white/75 transition hover:text-white"
                  >
                    Cambiar ciudad
                    <ChevronDown
                      className={`h-4 w-4 transition ${
                        showCityPicker ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>

                {showCityPicker ? (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-full min-w-[230px] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 text-slate-800 shadow-2xl">
                    {CITY_OPTIONS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => selectCity(item)}
                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-slate-100 ${
                          city === item
                            ? "bg-blue-50 text-[#0f3c8c]"
                            : "text-slate-700"
                        }`}
                      >
                        <MapPin className="h-4 w-4" />
                        {item}
                      </button>
                    ))}
                  </div>
                ) : null}
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
                    <option
                      key={item.value}
                      value={item.value}
                    >
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
                  {CITY_OPTIONS.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <MapPin className="pointer-events-none absolute left-4 h-4 w-4 text-slate-400" />
              </div>

              <div className="p-2 md:pl-0">
                <button
                  type="button"
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