import Link from "next/link";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
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

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditBusinessPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!isAdminEmail(email)) {
    redirect("/");
  }

  const { id } = await params;

  const business = await prisma.business.findUnique({
    where: {
      id,
    },
  });

  if (!business) {
    notFound();
  }

  const businessSlug = business.slug;

  async function updateBusiness(formData: FormData) {
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

    await prisma.business.update({
      where: {
        id,
      },
      data: {
        name,
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
    revalidatePath(`/admin/businesses/${id}`);
    revalidatePath(`/company/${businessSlug}`);

    redirect(`/admin/businesses/${id}`);
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-24 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[900px]">
        <Link
          href={`/admin/businesses/${business.id}`}
          className="mb-5 inline-flex items-center gap-2 text-sm font-black text-[#0f3c8c]"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a la empresa
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
                Editar empresa
              </h1>
            </div>
          </div>

          <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500">
            Actualiza los datos, contactos y estado de {business.name}.
          </p>
        </div>

        <form action={updateBusiness} className="space-y-5">
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
                  defaultValue={business.name}
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
                  defaultValue={business.businessType || "otro"}
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
                defaultValue={business.description || ""}
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
                  defaultValue={business.ownerName || ""}
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
                  defaultValue={business.ownerEmail}
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
                  defaultValue={business.whatsapp || ""}
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
                  defaultValue={business.phone || ""}
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
                  defaultValue={business.website || ""}
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
                  defaultValue={business.instagram || ""}
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
                  defaultValue={business.facebook || ""}
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
                  defaultValue={business.city || ""}
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
                  defaultValue={business.address || ""}
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
                  defaultChecked={business.isVerified}
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
                  defaultChecked={business.isActive}
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
              href={`/admin/businesses/${business.id}`}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-black text-slate-700"
            >
              Cancelar
            </Link>

            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-[#0f3c8c] px-6 text-sm font-black text-white shadow-sm transition hover:opacity-95"
            >
              <Save className="h-5 w-5" />
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
