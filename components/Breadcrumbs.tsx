import Link from "next/link";

type Props = {
  category?: string | null;
  subcategory?: string | null;
  title: string;
};

export default function Breadcrumbs({ category, subcategory, title }: Props) {
  return (
    <nav className="mb-6 text-sm font-medium text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/" className="hover:text-slate-900">
            Inicio
          </Link>
        </li>

        {category ? (
          <>
            <li>›</li>
            <li>
              <Link
                href={`/categoria/${category}`}
                className="hover:text-slate-900"
              >
                {category}
              </Link>
            </li>
          </>
        ) : null}

        {subcategory ? (
          <>
            <li>›</li>
            <li>
              <Link
                href={`/categoria/${category}?sub=${subcategory}`}
                className="hover:text-slate-900"
              >
                {subcategory}
              </Link>
            </li>
          </>
        ) : null}

        <li>›</li>
        <li className="text-slate-900 font-bold">{title}</li>
      </ol>
    </nav>
  );
}