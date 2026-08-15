"use client";

import { useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type Props = {
  type: "carros" | "motos" | "repuestos";
  availableBrands: string[];
};

const PART_TYPES = [
  { value: "aire-acondicionado", label: "Aire acondicionado" },
  { value: "amortiguadores", label: "Amortiguadores" },
  { value: "chapa-pintura", label: "Chapa y pintura" },
  { value: "clutch", label: "Clutch" },
  { value: "exostos", label: "Exostos" },
  { value: "llantas", label: "Llantas" },
  { value: "accesorios", label: "Accesorios" },
  { value: "otros", label: "Otros" },
];

export default function MotorFilters({ type, availableBrands }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [brand, setBrand] = useState(searchParams.get("brand") ?? "");
  const [year, setYear] = useState(searchParams.get("year") ?? "");
  const [kmMax, setKmMax] = useState(searchParams.get("kmMax") ?? "");
  const [fuel, setFuel] = useState(searchParams.get("fuel") ?? "");
  const [transmission, setTransmission] = useState(
    searchParams.get("transmission") ?? ""
  );
  const [cc, setCc] = useState(searchParams.get("cc") ?? "");
  const [partType, setPartType] = useState(searchParams.get("partType") ?? "");
  const [compatibleBrand, setCompatibleBrand] = useState(
    searchParams.get("compatibleBrand") ?? ""
  );
  const [priceMax, setPriceMax] = useState(searchParams.get("priceMax") ?? "");
  const [order, setOrder] = useState(searchParams.get("order") ?? "recent");

  const hasFilters = useMemo(() => {
    return Boolean(
      brand ||
        year ||
        kmMax ||
        fuel ||
        transmission ||
        cc ||
        partType ||
        compatibleBrand ||
        priceMax ||
        (order && order !== "recent")
    );
  }, [brand, year, kmMax, fuel, transmission, cc, partType, compatibleBrand, priceMax, order]);

  function updateUrl(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(next).forEach(([key, value]) => {
      const clean = value.trim();
      if (clean) {
        params.set(key, clean);
      } else {
        params.delete(key);
      }
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  }

  function clearAll() {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  return (
    <div className="mt-6 rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.18em] text-slate-500">
              Filtros
            </div>
            <h2 className="mt-2 text-2xl font-black text-slate-900">
              Refina tu búsqueda
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Los cambios se aplican automáticamente.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasFilters ? (
              <button
                type="button"
                onClick={clearAll}
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 hover:bg-slate-50"
              >
                Limpiar
              </button>
            ) : null}

            <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-600">
              {isPending ? "Actualizando..." : "Filtros activos"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {(type === "carros" || type === "motos") ? (
            <select
              value={brand}
              onChange={(e) => {
                const v = e.target.value;
                setBrand(v);
                updateUrl({ brand: v });
              }}
              className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
            >
              <option value="">Marca</option>
              {availableBrands.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          ) : null}

          {type === "carros" ? (
            <>
              <input
                type="number"
                value={year}
                onChange={(e) => {
                  const v = e.target.value;
                  setYear(v);
                  updateUrl({ year: v });
                }}
                placeholder="Año"
                className="h-10 w-[120px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
              />
              <input
                type="number"
                value={kmMax}
                onChange={(e) => {
                  const v = e.target.value;
                  setKmMax(v);
                  updateUrl({ kmMax: v });
                }}
                placeholder="Km máx"
                className="h-10 w-[120px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
              />
              <select
                value={fuel}
                onChange={(e) => {
                  const v = e.target.value;
                  setFuel(v);
                  updateUrl({ fuel: v });
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">Combustible</option>
                <option value="gasolina">Gasolina</option>
                <option value="diesel">Diesel</option>
                <option value="hibrido">Híbrido</option>
                <option value="electrico">Eléctrico</option>
              </select>
              <select
                value={transmission}
                onChange={(e) => {
                  const v = e.target.value;
                  setTransmission(v);
                  updateUrl({ transmission: v });
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">Transmisión</option>
                <option value="manual">Manual</option>
                <option value="automatica">Automática</option>
              </select>
            </>
          ) : null}

          {type === "motos" ? (
            <>
              <input
                type="number"
                value={year}
                onChange={(e) => {
                  const v = e.target.value;
                  setYear(v);
                  updateUrl({ year: v });
                }}
                placeholder="Año"
                className="h-10 w-[120px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
              />
              <input
                type="number"
                value={kmMax}
                onChange={(e) => {
                  const v = e.target.value;
                  setKmMax(v);
                  updateUrl({ kmMax: v });
                }}
                placeholder="Km máx"
                className="h-10 w-[120px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
              />
              <input
                type="number"
                value={cc}
                onChange={(e) => {
                  const v = e.target.value;
                  setCc(v);
                  updateUrl({ cc: v });
                }}
                placeholder="Cilindraje"
                className="h-10 w-[130px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
              />
            </>
          ) : null}

          {type === "repuestos" ? (
            <>
              <select
                value={partType}
                onChange={(e) => {
                  const v = e.target.value;
                  setPartType(v);
                  updateUrl({ partType: v });
                }}
                className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
              >
                <option value="">Tipo de repuesto</option>
                {PART_TYPES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={compatibleBrand}
                onChange={(e) => {
                  const v = e.target.value;
                  setCompatibleBrand(v);
                  updateUrl({ compatibleBrand: v });
                }}
                placeholder="Marca compatible"
                className="h-10 w-[170px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
              />
            </>
          ) : null}

          <input
            type="number"
            value={priceMax}
            onChange={(e) => {
              const v = e.target.value;
              setPriceMax(v);
              updateUrl({ priceMax: v });
            }}
            placeholder="Precio máx"
            className="h-10 w-[140px] rounded-xl border border-slate-200 bg-white px-3 text-sm"
          />

          <select
            value={order}
            onChange={(e) => {
              const v = e.target.value;
              setOrder(v);
              updateUrl({ order: v });
            }}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold"
          >
            <option value="recent">Más recientes</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="popular">Más populares</option>
          </select>
        </div>
      </div>
    </div>
  );
}