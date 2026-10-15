"use client";

import Link from "next/link";
import {
  Car,
  Home,
  Smartphone,
  Briefcase,
  Wrench,
  BarChart3,
  Laptop,
  Dumbbell,
  Shirt,
  Baby,
  PawPrint,
  Monitor,
  Sofa,
  Gift,
  ToyBrick,
  Paperclip,
  Hammer,
  Sparkles,
  UtensilsCrossed,
  Grid3X3,
} from "lucide-react";
import { CATEGORIES } from "@/data/categories";

const categoryIcons: Record<string, typeof Car> = {
  motor: Car,
  inmobiliaria: Home,
  celulares: Smartphone,
  electrodomesticos: Monitor,
  hogar: Sofa,
  "alimentos-bebidas": UtensilsCrossed,
  empleo: Briefcase,
  servicios: Wrench,
  negocios: BarChart3,
  informatica: Laptop,
  deportes: Dumbbell,
  moda: Shirt,
  bebes: Baby,
  mascotas: PawPrint,
  "regalos-celebraciones": Gift,
  juguetes: ToyBrick,
  "papeleria-oficina": Paperclip,
  "herramientas-ferreteria": Hammer,
  "salud-belleza": Sparkles,
};

const categories = CATEGORIES.map((category) => ({
  slug: category.slug,
  name: category.label,
  icon: categoryIcons[category.slug] ?? Grid3X3,
}));

export default function HomeCategories() {
  return (
    <section id="categorias-home" className="mt-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              Explora
            </div>

            <h2 className="mt-1 text-xl font-black text-slate-900 md:text-2xl">
              Categorías principales
            </h2>
          </div>

          <Link
            href="/categorias"
            className="text-sm font-bold text-[#0f3c8c] hover:underline"
          >
            Ver todas
          </Link>
        </div>

        <div className="mt-5 overflow-x-auto pb-2">
          <div className="flex min-w-max gap-3">
            {categories.map((cat) => {
              const Icon = cat.icon;

              return (
                <Link
                  key={cat.slug}
                  href={`/categoria/${cat.slug}`}
                  className="group flex min-w-[112px] flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center transition hover:-translate-y-0.5 hover:bg-slate-100 hover:shadow-sm"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white shadow-sm transition group-hover:scale-105">
                    <Icon className="h-5 w-5 text-[#0f3c8c]" />
                  </div>

                  <span className="text-xs font-bold text-slate-700">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}