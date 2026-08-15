import Link from "next/link";
import {
  Briefcase,
  Car,
  Home,
  Smartphone,
  Wrench,
  Store,
  Laptop,
  Gamepad2,
  BookOpen,
  Bike,
  Dog,
  Baby,
  Shirt,
  Camera,
} from "lucide-react";

const categories = [
  { label: "Todo", href: "/", active: true, icon: null },

  { label: "Motor", href: "/categoria/motor", icon: Car },
  { label: "Inmobiliaria", href: "/categoria/inmobiliaria", icon: Home },
  { label: "Celulares", href: "/categoria/celulares", icon: Smartphone },
  { label: "Empleo", href: "/categoria/empleo", icon: Briefcase },
  { label: "Servicios", href: "/categoria/servicios", icon: Wrench },

  { label: "Negocios", href: "/categoria/negocios", icon: Store },
  { label: "Informática", href: "/categoria/informatica", icon: Laptop },
  { label: "Imagen y sonido", href: "/categoria/imagen-sonido", icon: Camera },
  { label: "Juegos", href: "/categoria/juegos", icon: Gamepad2 },

  { label: "Formación", href: "/categoria/formacion", icon: BookOpen },
  { label: "Deportes", href: "/categoria/deportes", icon: Bike },
  { label: "Mascotas", href: "/categoria/mascotas", icon: Dog },
  { label: "Bebés", href: "/categoria/bebes", icon: Baby },
  { label: "Moda", href: "/categoria/moda", icon: Shirt },
];

export default function CategoryChips() {
  return (
    <div className="relative mt-[-10px]">
      {/* contenedor estilo "bloque integrado" */}
      <div className="rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
        <div className="overflow-x-auto no-scrollbar">
          <div className="flex min-w-max items-center gap-3">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <Link
                  key={category.label}
                  href={category.href}
                  className={`
                    group flex items-center gap-2 rounded-full px-4 py-2
                    text-[14px] font-semibold whitespace-nowrap transition-all
                    ${
                      category.active
                        ? "bg-[#0f3c8c] text-white shadow"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }
                  `}
                >
                  {Icon ? (
                    <Icon
                      className={`h-4 w-4 ${
                        category.active
                          ? "text-white"
                          : "text-slate-500 group-hover:text-slate-700"
                      }`}
                    />
                  ) : null}

                  {category.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* fade lateral */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#F8F9FB] to-transparent" />
    </div>
  );
}