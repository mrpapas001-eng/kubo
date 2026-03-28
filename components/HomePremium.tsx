import CategoryChips from "@/components/CategoryChips";
import ListingCard from "@/components/ListingCard";
import MapMock from "@/components/MapMock";
import { mockListings } from "@/data/mockListings";
import { ArrowRight } from "lucide-react";

export default function HomePremium() {
  const allListings = [...mockListings, ...mockListings].slice(0, 6);

  return (
    <main className="max-w-[1400px] mx-auto px-6 py-6">
      <CategoryChips />

      {/* GRID PRINCIPAL */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-8 items-start">
        
        {/* IZQUIERDA */}
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Encuentra lo que buscas cerca de ti
          </h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            Mostrando resultados en el radio de 5 km
          </p>

          {/* CARDS */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {allListings.map((item, idx) => (
              <ListingCard key={idx} item={item} />
            ))}
          </div>

          {/* DESTACADOS */}
          <section className="mt-16 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Destacados
              </h2>
              <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                Ver todos <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allListings.slice(0, 4).map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white p-3 rounded-2xl border border-slate-100 flex gap-4 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="w-20 h-20 rounded-xl bg-slate-100 shrink-0 overflow-hidden">
                    <img
                      src={item.image}
                      alt=""
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-lg font-black text-blue-600 mt-1">
                      {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* DERECHA */}
<div className="flex flex-col gap-6 lg:flex">          
          {/* CONTROL DISTANCIA */}
          <div className="h-11 w-full rounded-xl border border-slate-200 bg-white flex items-center px-4 shadow-sm">
            <div className="flex items-center gap-2 border-r border-slate-100 pr-4 h-6 shrink-0">
              <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              </div>
              <span className="text-xs font-bold text-slate-800 tracking-tight">
                Madrid
              </span>
            </div>

            <div className="flex-1 flex items-center gap-3 pl-4">
              <input
                type="range"
                min="1"
                max="5"
                defaultValue="5"
                className="flex-1 h-1 rounded-full appearance-none accent-blue-700 cursor-pointer"
              />
              <span className="text-[11px] font-bold text-slate-400">
                5 de 5 km
              </span>
            </div>
          </div>

          {/* MAPA */}
          <div className="sticky top-24 w-full">
  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white h-[620px]">
    <MapMock />
  </div>
</div>

        </div>
      </div>
    </main>
  );
}