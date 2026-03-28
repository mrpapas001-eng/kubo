import Header from '@/components/Header';
import ListingCard from '@/components/ListingCard';
import MapMock from '@/components/MapMock';
import { mockListings } from '@/data/mockListings';
import { SlidersHorizontal } from 'lucide-react';

export default function SearchPage({ searchParams }: { searchParams: any }) {
  const query = searchParams?.q || "";
  const category = searchParams?.category || "";

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Header />
      <main className="max-w-[1400px] mx-auto px-6 py-6">

        {/* Filtros Rápidos */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:border-blue-500">
            <SlidersHorizontal className="w-4 h-4" /> Filtros
          </button>
          <div className="h-6 w-[1px] bg-slate-200 mx-2"></div>
          {["Menos de 10M", "Verificados", "Particulares"].map((f) => (
            <button
              key={f}
              className="whitespace-nowrap bg-white border border-slate-200 px-4 py-2 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Resultados */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black text-slate-900 mb-2">
              Resultados para {category ? `"${category}"` : "tu búsqueda"}
            </h1>
            <p className="text-sm text-slate-500 mb-8">
              {query ? `Búsqueda: "${query}"` : "Anuncios encontrados cerca de ti"}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {mockListings.map((item, idx) => (
                <ListingCard key={idx} item={item} />
              ))}
            </div>
          </div>

          {/* Mapa Sticky */}
          <aside className="hidden lg:block w-[420px] sticky top-24 shrink-0">
            <div className="rounded-2xl border border-slate-200 overflow-hidden h-[600px] shadow-sm bg-white">
              <MapMock />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}