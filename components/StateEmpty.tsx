export default function StateEmpty({
  title = "No encontramos resultados",
  subtitle = "Prueba con otra búsqueda o ciudad",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="text-lg font-black text-slate-900">{title}</div>

      <p className="mt-2 text-sm font-medium text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}