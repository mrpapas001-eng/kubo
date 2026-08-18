"use client";

import Link from "next/link";
import { Heart, HandHeart, ShieldCheck } from "lucide-react";

export default function HomeAyudaSection() {
  return (
    <section className="mt-6">
      <div className="overflow-hidden rounded-[28px] border border-[#0f3c8c]/20 bg-gradient-to-br from-[#0f3c8c] to-[#0c2f6d] p-6 shadow-[0_20px_50px_rgba(15,60,140,0.15)] md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-amber-300 backdrop-blur-sm">
              <Heart className="h-3.5 w-3.5" />
              KUBO AYUDA
            </div>

            <h2 className="mt-4 text-2xl font-black leading-tight text-white md:text-3xl lg:text-4xl">
              Lo que a ti ya no te sirve,
              <br />
              puede hacerle falta a alguien.
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/80 md:text-base">
              Conectamos personas que quieren donar con personas que realmente
              lo necesitan.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:w-auto md:min-w-[280px]">
            <Link
              href="/ayuda"
              className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 transition hover:bg-white/20 hover:scale-[1.02]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20">
                <HandHeart className="h-6 w-6 text-amber-300" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-black text-white">
                  QUIERO DONAR
                </div>
                <div className="mt-0.5 text-xs text-white/70">
                  Tengo algo que puedo entregar gratuitamente.
                </div>
              </div>
            </Link>

            <Link
              href="/ayuda"
              className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-5 py-4 transition hover:bg-white/20 hover:scale-[1.02]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20">
                <Heart className="h-6 w-6 text-amber-300" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-black text-white">
                  NECESITO AYUDA
                </div>
                <div className="mt-0.5 text-xs text-white/70">
                  Tengo una necesidad concreta y quiero solicitar ayuda.
                </div>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
          <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-300" />
          <p className="text-xs leading-5 text-white/70">
            Las solicitudes de ayuda son revisadas antes de publicarse.
          </p>
        </div>
      </div>
    </section>
  );
}
