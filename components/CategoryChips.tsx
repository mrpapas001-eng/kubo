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

  { label: "Formación y libros", href: "/categoria/formacion", icon: BookOpen },
  { label: "Deportes", href: "/categoria/deportes", icon: Bike },
  { label: "Mascotas", href: "/categoria/mascotas", icon: Dog },
  { label: "Bebés", href: "/categoria/bebes", icon: Baby },
  { label: "Moda", href: "/categoria/moda", icon: Shirt },
];

export default function CategoryChips() {
  return (
    <div className="overflow-x-auto">
      <div className="flex min-w-max items-center gap-2 pb-2">
        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <Link
              key={category.label}
              href={category.href}
              className="flex h-11 items-center justify-center gap-2 rounded-[14px] border border-slate-200 bg-white px-5 text-[15px] font-bold text-slate-700 shadow-sm whitespace-nowrap hover:bg-slate-50"
            >
              {Icon ? <Icon className="h-4 w-4" /> : null}
              {category.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}