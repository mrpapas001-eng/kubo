export default function StateError({
  message = "Ha ocurrido un error",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mt-6 rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
      <div className="text-lg font-black text-red-600">Ups…</div>

      <p className="mt-2 text-sm font-medium text-slate-600">
        {message}
      </p>

      {onRetry ? (
        <button
          onClick={onRetry}
          className="mt-4 rounded-xl bg-red-600 px-5 py-2 text-sm font-bold text-white hover:bg-red-700"
        >
          Reintentar
        </button>
      ) : null}
    </div>
  );
}