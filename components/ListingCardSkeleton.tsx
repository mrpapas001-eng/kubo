export default function ListingCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-sm">
      {/* Imagen */}
      <div className="relative h-60 w-full bg-slate-200">
        <div className="absolute left-3 top-3 h-6 w-20 rounded-full bg-slate-300" />
        <div className="absolute right-3 top-3 h-9 w-9 rounded-full bg-slate-300" />
      </div>

      {/* Contenido */}
      <div className="p-4">
        {/* Título */}
        <div className="h-4 w-[90%] rounded bg-slate-200" />
        <div className="mt-2 h-4 w-[70%] rounded bg-slate-200" />

        {/* Ciudad + extra */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-slate-200" />
          <div className="h-3 w-24 rounded bg-slate-200" />
        </div>

        <div className="mt-2 h-3 w-32 rounded bg-slate-200" />

        {/* Seller */}
        <div className="mt-3 flex items-center gap-2">
          <div className="h-4 w-4 rounded-full bg-slate-200" />
          <div className="h-3 w-28 rounded bg-slate-200" />
        </div>

        {/* Precio */}
        <div className="mt-4 h-6 w-32 rounded bg-slate-300" />

        {/* Footer tipo empresa */}
        <div className="mt-4 overflow-hidden rounded-xl bg-slate-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="h-3 w-32 rounded bg-slate-300" />
            <div className="h-3 w-16 rounded bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}