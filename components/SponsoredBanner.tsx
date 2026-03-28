import Link from "next/link";
import Image from "next/image";

export default function SponsoredCard({ sponsors }: { sponsors: any[] }) {
  if (!sponsors || sponsors.length === 0) return null;

  const sponsor = sponsors[0];

  return (
    <Link
      href={sponsor?.url ?? "#"}
      className="group block h-full overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <Image
          src={sponsor?.image ?? "/placeholders/listing.jpg"}
          alt={sponsor?.title ?? "Patrocinado"}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute left-3 top-3 rounded-full bg-[#0f3c8c] px-3 py-1 text-[11px] font-bold text-white shadow-sm">
          Patrocinado
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 text-[17px] font-extrabold text-slate-900">
          {sponsor?.title ?? "Oferta destacada"}
        </h3>

        <p className="mt-2 text-sm text-slate-500">
          {sponsor?.description ?? "Descubre esta oferta especial."}
        </p>

        <div className="mt-4">
          <span className="inline-flex items-center rounded-xl bg-[#0f3c8c] px-4 py-2 text-sm font-bold text-white hover:bg-[#0c2f6d]">
            Ver oferta
          </span>
        </div>
      </div>
    </Link>
  );
}