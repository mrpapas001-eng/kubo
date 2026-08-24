import Link from "next/link";
import {
  Car,
  Home,
  Smartphone,
  Monitor,
  Sofa,
  Briefcase,
  Wrench,
  BarChart3,
  Laptop,
  Dumbbell,
  Shirt,
  Baby,
  PawPrint,
  Gift,
  ToyBrick,
  Paperclip,
  Hammer,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
} from "lucide-react";

const categories = [
  { slug: "motor", name: "Motor", icon: Car },
  { slug: "inmobiliaria", name: "Inmobiliaria", icon: Home },
  { slug: "celulares", name: "Celulares", icon: Smartphone },
  { slug: "electrodomesticos", name: "Electrodomésticos", icon: Monitor },
  { slug: "hogar", name: "Hogar", icon: Sofa },
  { slug: "empleo", name: "Empleo", icon: Briefcase },
  { slug: "servicios", name: "Servicios", icon: Wrench },
  { slug: "negocios", name: "Negocios", icon: BarChart3 },
  { slug: "informatica", name: "Informática", icon: Laptop },
  { slug: "imagen-sonido", name: "Imagen y sonido", icon: ImageIcon },
  { slug: "formacion", name: "Formación y libros", icon: BookOpen },
  { slug: "deportes", name: "Deportes", icon: Dumbbell },
  { slug: "moda", name: "Moda y complementos", icon: Shirt },
  { slug: "bebes", name: "Bebés", icon: Baby },
  { slug: "mascotas", name: "Mascotas", icon: PawPrint },
  { slug: "regalos-celebraciones", name: "Regalos y celebraciones", icon: Gift },
  { slug: "juguetes", name: "Juguetes", icon: ToyBrick },
  { slug: "papeleria-oficina", name: "Papelería y Oficina", icon: Paperclip },
  {
    slug: "herramientas-ferreteria",
    name: "Herramientas y Ferretería",
    icon: Hammer,
  },
  { slug: "salud-belleza", name: "Salud y Belleza", icon: Sparkles },
];

export default function CategoriasPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FB] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <Link
          href="/"
          className="inline-flex rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
        >
          ← Volver a la Home
        </Link>

        <div className="mt-8">
          <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
            Explora Kubo
          </div>

          <h1 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
            Todas las categorías
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
            Encuentra rápidamente lo que buscas navegando por todas las
            categorías disponibles en Kubo Anuncios.
          </p>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((cat) => {
            const Icon = cat.icon;

            return (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="group flex min-h-[150px] flex-col items-center justify-center rounded-3xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition group-hover:scale-105">
                  <Icon className="h-6 w-6 text-[#0f3c8c]" />
                </div>

                <span className="mt-4 text-sm font-black leading-5 text-slate-800">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}