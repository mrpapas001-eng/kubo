export default function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
      <div className="h-48 w-full bg-slate-100 animate-pulse" />
      <div className="p-4">
        <div className="h-4 bg-slate-100 rounded animate-pulse w-4/5" />
        <div className="h-4 bg-slate-100 rounded animate-pulse w-3/5 mt-2" />
        <div className="h-7 bg-slate-100 rounded animate-pulse w-2/5 mt-4" />
        <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="h-3 bg-slate-100 rounded animate-pulse w-24" />
          <div className="h-3 bg-slate-100 rounded animate-pulse w-16" />
        </div>
      </div>
    </div>
  );
}