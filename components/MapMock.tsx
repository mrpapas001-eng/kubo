import { Maximize2 } from "lucide-react";

export default function MapMock() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">

      {/* Pins simulados */}
      <div className="absolute left-[40%] top-[30%] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-md border border-slate-200">
          $ 38.000.000
        </div>
      </div>

      <div className="absolute left-[65%] top-[55%] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-md border border-slate-200">
          $ 12.900.000
        </div>
      </div>

      <div className="absolute left-[30%] top-[65%] -translate-x-1/2 -translate-y-1/2">
        <div className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-900 shadow-md border border-slate-200">
          $ 850.000
        </div>
      </div>

      {/* Botón mapa completo */}
      <button className="absolute bottom-4 right-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-md hover:bg-slate-50">
        <Maximize2 className="h-4 w-4" />
        Ver mapa completo
      </button>
    </div>
  );
}