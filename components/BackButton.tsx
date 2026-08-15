"use client";

export default function BackButton({
  className = "",
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.history.back()}
      className={className}
    >
      ← Volver
    </button>
  );
}