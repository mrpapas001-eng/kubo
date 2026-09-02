import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  Save,
} from "lucide-react";

import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/db";
import { isAdminEmail } from "@/lib/admin";

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default async function NewBusinessPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  async function createBusiness(formData: FormData) {
    "use server";

    const session = await getServerSession(authOptions);
    const adminEmail = session?.user?.email?.toLowerCase().trim();

    if (!isAdminEmail(adminEmail)) {
      redirect("/");
    }

    const name = String(formData.get("name") || "").trim();
    const ownerEmail = String(formData.get("ownerEmail") || "")
      .trim()
      .toLowerCase();

    const ownerName = String(formData.get("ownerName") || "").trim();
    const description = String(formData.get("description") || "").trim();

    const phone = String(formData.get("phone") || "").trim();
    const whatsapp = String(formData.get("whatsapp") || "").trim();

    const website = String(formData.get("website") || "").trim();
    const instagram = String(formData.get("instagram") || "").trim();
    const facebook = String(formData.get("facebook") || "").trim();

    const city = String(formData.get("city") || "").trim();
    const address = String(formData.get("address") || "").trim();

    const businessType = String(formData.get("businessType") || "").trim();

    const isVerified = formData.get("isVerified") === "on";
    const isActive = formData.get("isActive") === "on";

    if (!name || !ownerEmail) {
      throw new Error("Nombre de empresa y correo son obligatorios.");
    }

    let slug = makeSlug(name);

    const existingSlug = await prisma.business.findUnique({
      where: {
        slug,
      },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`;
    }

    await prisma.business.create({
      data: {
        name,
        slug,

        ownerEmail,
        ownerName: ownerName || null,

        description: description || null,

        phone: phone || null,
        whatsapp: whatsapp || null,

        website: website || null,
        instagram: instagram || null,
        facebook: facebook || null,

        city: city || null,
        address: address || null,

        businessType: businessType || null,

        isVerified,
        isActive,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/businesses");

    redirect("/admin/businesses");
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[900px]">
        <Link
          href="/admin/businesses"
          className="mb-5 inline-flex items-center gap-2 text-sm font-black text-[#0f3c8c]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a empresas
        </Link>

        <div className="mb-7">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8f0ff] text-[#0f3c8c]">
              <Building2 className="h-6 w-6" />
            </div>

            <div>
              <p className="text-xs font-black uppercase tracking-wide text-[#0f3c8c]">
                Kubo Empresas
              </p>

              <h1 className="text-3xl font-black text-slate-900">
                Nueva empresa
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            Crea una empresa para administrar sus anuncios, contactos y
            estadísticas desde Kubo.
          </p>
        </div>

        <form action={createBusiness} className="space-y-5">
          {/* INFORMACIÓN PRINCIPAL */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-black text-slate-900">
              Información principal
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Nombre de la empresa *
                </label>

                <input
                  name="name"
                  required
                  placeholder="Ej. Movil Autos"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Tipo de empresa
                </label>

                <select
                  name="businessType"
                  defaultValue="concesionario"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                >
                  <option value="concesionario">Concesionario</option>
                  <option value="inmobiliaria">Inmobiliaria</option>
                  <option value="tienda">Tienda</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="servicios">Servicios</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className="mb-2 block text-sm font-black text-slate-700">
                Descripción
              </label>

              <textarea
                name="description"
                rows={4}
                placeholder="Describe brevemente la empresa..."
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
              />
            </div>
          </section>

          {/* ACCESO */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-black text-slate-900">
              Responsable de la empresa
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-500">
              Este será el correo asociado a la empresa para darle acceso a su
              panel.
            </p>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Nombre del responsable
                </label>

                <input
                  name="ownerName"
                  placeholder="Ej. Carlos Pérez"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Correo de acceso *
                </label>

                <input
                  name="ownerEmail"
                  type="email"
                  required
                  placeholder="empresa@correo.com"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                />
              </div>
            </div>
          </section>

          {/* CONTACTO */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-black text-slate-900">
              Contacto
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  WhatsApp
                </label>

                <input
                  name="whatsapp"
                  placeholder="Ej. 3001234567"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Teléfono
                </label>

                <input
                  name="phone"
                  placeholder="Teléfono de contacto"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Página web
                </label>

                <input
                  name="website"
                  placeholder="https://..."
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Instagram
                </label>

                <input
                  name="instagram"
                  placeholder="@empresa"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Facebook
                </label>

                <input
                  name="facebook"
                  placeholder="Página o enlace de Facebook"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                />
              </div>
            </div>
          </section>

          {/* UBICACIÓN */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-black text-slate-900">
              Ubicación
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Ciudad
                </label>

                <input
                  name="city"
                  placeholder="Ej. Pereira"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-black text-slate-700">
                  Dirección
                </label>

                <input
                  name="address"
                  placeholder="Dirección de la empresa"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-900 outline-none focus:border-[#0f3c8c]"
                />
              </div>
            </div>
          </section>

          {/* ESTADO */}

          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-black text-slate-900">
              Estado de la empresa
            </h2>

            <div className="mt-5 space-y-4">
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  name="isVerified"
                  defaultChecked
                  className="h-5 w-5"
                />

                <div>
                  <div className="flex items-center gap-2 font-black text-slate-900">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    Empresa verificada
                  </div>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Mostrará que la empresa fue validada por Kubo.
                  </p>
                </div>
              </label>

              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 p-4">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked
                  className="h-5 w-5"
                />

                <div>
                  <div className="font-black text-slate-900">
                    Empresa activa
                  </div>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Permite mantener la empresa disponible dentro de Kubo.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* BOTONES */}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/admin/businesses"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-6 text-sm font-black text-white shadow-sm transition hover:opacity-95"
            >
              <Save className="h-5 w-5" />
              Crear empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}