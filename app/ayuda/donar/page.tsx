"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ChevronLeft, Upload, CheckCircle2, AlertCircle, Heart, Phone } from "lucide-react";

const CITIES = [
  "Pereira",
  "Dosquebradas",
  "Santa Rosa de Cabal",
  "La Virginia",
  "Cartago",
  "Armenia",
  "Bogotá",
  "Medellín",
  "Cali",
  "Barranquilla",
  "Cartagena",
  "Bucaramanga",
  "Manizales",
  "Madrid, Cundinamarca",
  "Otra",
];

const CATEGORY_OPTIONS: Array<{
  key: string;
  label: string;
  subs: Array<{ slug: string; label: string }>;
}> = [
  {
    key: "motor",
    label: "Motor",
    subs: [
      { slug: "carros", label: "Carros" },
      { slug: "motos", label: "Motos" },
      { slug: "repuestos", label: "Repuestos" },
    ],
  },
  {
    key: "inmobiliaria",
    label: "Inmobiliaria",
    subs: [
      { slug: "casa", label: "Casa" },
      { slug: "apartamento", label: "Apartamento" },
      { slug: "apartaestudio", label: "Apartaestudio" },
      { slug: "local-comercial", label: "Local comercial" },
      { slug: "finca", label: "Finca" },
      { slug: "lote", label: "Lote" },
      { slug: "casa-campestre", label: "Casa campestre" },
      { slug: "bodega", label: "Bodega" },
      { slug: "otros-inmuebles", label: "Otros inmuebles" },
    ],
  },
  {
    key: "celulares",
    label: "Celulares",
    subs: [
      { slug: "celulares", label: "Celulares" },
      { slug: "repuestos", label: "Repuestos" },
      { slug: "telefono-fijo", label: "Teléfono fijo" },
    ],
  },
  {
    key: "electrodomesticos",
    label: "Electrodomésticos",
    subs: [
      { slug: "aires", label: "Aires" },
      { slug: "cocinas", label: "Cocinas" },
      { slug: "hornos", label: "Hornos" },
      { slug: "lavadoras", label: "Lavadoras" },
      { slug: "microondas", label: "Microondas" },
      { slug: "neveras", label: "Neveras" },
      { slug: "pequenos", label: "Electrodomésticos pequeños" },
      { slug: "secadoras", label: "Secadoras" },
    ],
  },
  {
    key: "hogar",
    label: "Hogar",
    subs: [
      { slug: "colchones", label: "Colchones" },
      { slug: "decoracion", label: "Decoración" },
      { slug: "iluminacion", label: "Iluminación" },
      { slug: "jardin", label: "Jardín" },
      { slug: "menaje", label: "Menaje" },
      { slug: "muebles", label: "Muebles" },
      { slug: "organizacion", label: "Organización" },
    ],
  },
  {
    key: "empleo",
    label: "Empleo",
    subs: [
      { slug: "ofrezco-empleo", label: "Ofrezco empleo" },
      { slug: "busco-empleo", label: "Busco empleo" },
    ],
  },
  {
    key: "servicios",
    label: "Servicios",
    subs: [
      { slug: "hogar", label: "Hogar" },
      { slug: "personas", label: "Personas" },
      { slug: "empresas", label: "Empresas" },
      { slug: "electricos", label: "Eléctricos" },
      { slug: "energia-solar", label: "Energía solar" },
      { slug: "motor", label: "Motor" },
      { slug: "bicicleta", label: "Bicicleta" },
      { slug: "otros", label: "Otros" },
    ],
  },
  {
    key: "negocios",
    label: "Negocios",
    subs: [
      { slug: "venta-de-negocios", label: "Venta de negocios" },
      { slug: "traspasos", label: "Traspasos" },
      { slug: "franquicias", label: "Franquicias" },
      { slug: "arriendo-de-negocio", label: "Arriendo de negocio" },
      { slug: "financiacion", label: "Financiación" },
    ],
  },
  {
    key: "informatica",
    label: "Informática",
    subs: [
      { slug: "portatiles", label: "Portátiles" },
      { slug: "todo-en-uno", label: "Todo en uno" },
      { slug: "escritorio", label: "Escritorio" },
      { slug: "tablets", label: "Tablets" },
      { slug: "mac", label: "Mac" },
      { slug: "accesorios", label: "Accesorios" },
      { slug: "software", label: "Software" },
      { slug: "gaming", label: "Gaming" },
    ],
  },
  {
    key: "imagen-sonido",
    label: "Imagen y sonido",
    subs: [
      { slug: "fotografia", label: "Fotografía" },
      { slug: "imagen", label: "Imagen" },
      { slug: "sonido", label: "Sonido" },
      { slug: "musica", label: "Música" },
    ],
  },
  {
    key: "juegos",
    label: "Juegos",
    subs: [
      { slug: "consolas", label: "Consolas" },
      { slug: "videojuegos", label: "Videojuegos" },
      { slug: "accesorios", label: "Accesorios" },
    ],
  },
  {
    key: "formacion",
    label: "Formación y libros",
    subs: [
      { slug: "clases-particulares", label: "Clases particulares" },
      { slug: "libros", label: "Libros" },
      { slug: "idiomas", label: "Idiomas" },
      { slug: "cursos", label: "Cursos" },
      { slug: "autoescuelas", label: "Autoescuelas" },
    ],
  },
  {
    key: "deportes",
    label: "Deportes",
    subs: [
      { slug: "bicicletas", label: "Bicicletas" },
      { slug: "futbol", label: "Fútbol" },
      { slug: "gimnasio", label: "Gimnasio" },
      { slug: "running", label: "Running" },
      { slug: "camping", label: "Camping" },
      { slug: "natacion", label: "Natación" },
      { slug: "otros", label: "Otros" },
    ],
  },
  {
    key: "mascotas",
    label: "Mascotas",
    subs: [
      { slug: "perros", label: "Perros" },
      { slug: "gatos", label: "Gatos" },
      { slug: "caballos", label: "Caballos" },
      { slug: "adopciones", label: "Adopciones" },
      { slug: "peces", label: "Peces" },
      { slug: "varios", label: "Varios" },
    ],
  },
  {
    key: "bebes",
    label: "Bebés",
    subs: [
      { slug: "habitacion-bebes", label: "Habitación bebés" },
      { slug: "camaras-de-vigilancia", label: "Cámaras de vigilancia" },
      { slug: "coches-de-bebe", label: "Coches de bebé" },
      { slug: "juguetes", label: "Juguetes" },
      { slug: "higiene-y-cuidado", label: "Higiene y cuidado" },
      { slug: "varios", label: "Varios" },
    ],
  },
  {
    key: "moda",
    label: "Moda",
    subs: [
      { slug: "moda-hombre", label: "Moda hombre" },
      { slug: "moda-mujer", label: "Moda mujer" },
      { slug: "perfumes", label: "Perfumes" },
      { slug: "calzado", label: "Calzado" },
      { slug: "disfraces", label: "Disfraces" },
      { slug: "joyeria-bisuteria", label: "Joyería y bisutería" },
      { slug: "sex-shop", label: "Sex shop" },
      { slug: "otros-articulos-de-moda", label: "Otros artículos de moda" },
    ],
  },
  {
    key: "regalos-celebraciones",
    label: "Regalos y celebraciones",
    subs: [
      { slug: "velas-y-velones", label: "Velas y velones" },
      { slug: "regalos", label: "Regalos" },
      { slug: "flores-y-detalles", label: "Flores y detalles" },
      { slug: "decoracion-para-fiestas", label: "Decoración para fiestas" },
      { slug: "pinateria", label: "Piñatería" },
    ],
  },
];

const CONDITION_OPTIONS = [
  { value: "NEW", label: "NUEVO" },
  { value: "GOOD", label: "BUEN ESTADO" },
  { value: "USED_FUNCTIONAL", label: "USADO FUNCIONAL" },
];

const DELIVERY_OPTIONS = [
  { value: "PICKUP", label: "Lo recoge la persona" },
  { value: "DELIVERY", label: "Puedo entregarlo" },
  { value: "ARRANGE", label: "Acordar entrega" },
];

export default function DonarPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [city, setCity] = useState("Pereira");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [condition, setCondition] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [verificationStatus, setVerificationStatus] = useState<{
    isVerified: boolean;
    whatsappNumber: string | null;
  }>({
    isVerified: false,
    whatsappNumber: null,
  });

  useEffect(() => {
    if (session?.user?.email) {
      fetchVerificationStatus();
    }
  }, [session]);

  async function fetchVerificationStatus() {
    try {
      const res = await fetch("/api/verification-status");
      const data = await res.json();
      if (data.ok) {
        setVerificationStatus({
          isVerified: data.isVerified,
          whatsappNumber: data.whatsappNumber || null,
        });
      }
    } catch (err) {
      console.error("Error fetching verification status:", err);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      setLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Error subiendo imágenes");
      }

      setUploadedUrls(data.urls || []);
    } catch (err: any) {
      setError(err.message || "Error subiendo imágenes");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    if (!description.trim()) {
      setError("La descripción es obligatoria.");
      return;
    }

    if (!category) {
      setError("La categoría es obligatoria.");
      return;
    }

    if (!subcategory) {
      setError("La subcategoría es obligatoria.");
      return;
    }

    if (!condition) {
      setError("El estado del artículo es obligatorio.");
      return;
    }

    if (!deliveryMethod) {
      setError("La forma de entrega es obligatoria.");
      return;
    }

    if (uploadedUrls.length === 0) {
      setError("Debes subir al menos una foto.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          phone: verificationStatus.whatsappNumber || "",
          price: 0,
          currency: "COP",
          city,
          categorySlug: category,
          subcategorySlug: subcategory,
          template: "GENERAL",
          sellerType: "PARTICULAR",
          isVerified: false,
          imageUrl: uploadedUrls[0] || null,
          details: {
            images: uploadedUrls,
            kuboAyuda: {
              type: "DONATION",
              condition,
              deliveryMethod,
              status: "AVAILABLE",
            },
          },
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Error publicando donación");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/mis-anuncios");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error publicando donación");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB]">
        <div className="text-lg font-bold text-slate-900">Cargando...</div>
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-6">
        <div className="rounded-3xl bg-white p-8 shadow text-center">
          <p className="text-lg font-bold text-slate-900 mb-4">
            Debes iniciar sesión para publicar una donación
          </p>
          <button
            onClick={() => router.push("/api/auth/signin")}
            className="rounded-xl bg-[#0f3c8c] px-6 py-3 text-sm font-black text-white hover:bg-[#0c2f6d]"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    );
  }

  if (!verificationStatus.isVerified) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-6 md:px-6 md:py-10">
        <div className="mx-auto max-w-[600px]">
          <Link
            href="/ayuda"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
          >
            <ChevronLeft className="h-4 w-4" />
            Volver a Kubo Ayuda
          </Link>

          <div className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="h-6 w-6 text-amber-600" />
              <h2 className="text-xl font-black text-slate-900">
                Cuenta verificada requerida
              </h2>
            </div>

            <p className="text-sm leading-6 text-slate-700 mb-6">
              Para proteger a donantes y beneficiarios, necesitamos que tu cuenta esté verificada antes de publicar una donación. Esto incluye verificar tu número de WhatsApp.
            </p>

            <div className="rounded-xl border border-slate-200 bg-white p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span className="text-sm font-semibold text-slate-900">
                  Beneficios de verificar tu cuenta
                </span>
              </div>
              <ul className="text-sm text-slate-600 space-y-1 ml-6">
                <li>• Mayor confianza para donantes y beneficiarios</li>
                <li>• Contacto verificado y confiable</li>
                <li>• Prioridad en revisiones</li>
              </ul>
            </div>

            <Link
              href="/verificar-identidad"
              className="block w-full rounded-xl bg-[#0f3c8c] px-6 py-3 text-center text-sm font-black text-white hover:bg-[#0c2f6d]"
            >
              Verificar mi cuenta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8F9FB] px-6">
        <div className="rounded-3xl bg-white p-8 shadow text-center">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">
            ¡Donación publicada!
          </h2>
          <p className="text-slate-600 mb-4">
            Tu donación ya está visible en Kubo Ayuda.
          </p>
          <p className="text-sm text-slate-500">
            Redirigiendo a Mis anuncios...
          </p>
        </div>
      </div>
    );
  }

  const selectedCategory = CATEGORY_OPTIONS.find((cat) => cat.key === category);
  const selectedSubcategory = selectedCategory?.subs.find((sub) => sub.slug === subcategory);

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 pb-28 pt-6 md:px-6 md:py-10">
      <div className="mx-auto max-w-[800px]">
        <Link
          href="/ayuda"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a Kubo Ayuda
        </Link>

        <div className="mt-6">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-6 w-6 text-amber-600" />
            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">
              ¿Qué quieres donar?
            </h1>
          </div>

          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-semibold text-slate-900">
                DONACIÓN GRATUITA
              </span>
            </div>
            <p className="text-sm text-slate-600">
              Este artículo se entregará gratuitamente a través de Kubo Ayuda. No se permite cobrar por el artículo.
            </p>
          </div>

          {verificationStatus.whatsappNumber && (
            <div className="rounded-xl border border-slate-200 bg-white p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-[#0f3c8c]" />
                <span className="text-sm font-semibold text-slate-900">
                  Contacto de la donación
                </span>
              </div>
              <p className="text-sm text-slate-600">
                WhatsApp verificado: {verificationStatus.whatsappNumber}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Título del artículo
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Bicicleta infantil en buen estado"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#0f3c8c] focus:ring-2 focus:ring-[#0f3c8c]/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setSubcategory("");
                  }}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#0f3c8c] focus:ring-2 focus:ring-[#0f3c8c]/20"
                >
                  <option value="">Seleccionar categoría</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat.key} value={cat.key}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Ciudad
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#0f3c8c] focus:ring-2 focus:ring-[#0f3c8c]/20"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {category && (
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Subcategoría
                </label>
                <select
                  value={subcategory}
                  onChange={(e) => setSubcategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#0f3c8c] focus:ring-2 focus:ring-[#0f3c8c]/20"
                >
                  <option value="">Seleccionar subcategoría</option>
                  {selectedCategory?.subs.map((sub) => (
                    <option key={sub.slug} value={sub.slug}>
                      {sub.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Estado del artículo
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#0f3c8c] focus:ring-2 focus:ring-[#0f3c8c]/20"
              >
                <option value="">Seleccionar estado</option>
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Forma de entrega
              </label>
              <select
                value={deliveryMethod}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#0f3c8c] focus:ring-2 focus:ring-[#0f3c8c]/20"
              >
                <option value="">Seleccionar forma de entrega</option>
                {DELIVERY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe el artículo, sus características y por qué quieres donarlo..."
                rows={4}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#0f3c8c] focus:ring-2 focus:ring-[#0f3c8c]/20 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Fotos
              </label>
              <div className="relative">
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#0f3c8c] focus:ring-2 focus:ring-[#0f3c8c]/20"
                />
                <Upload className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
              {uploadedUrls.length > 0 && (
                <div className="mt-3 flex gap-2 flex-wrap">
                  {uploadedUrls.map((url, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={url}
                        alt={`Foto ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0f3c8c] px-6 py-4 text-sm font-black text-white transition hover:bg-[#0c2f6d] disabled:opacity-50 disabled:cursor-not-allowed md:text-base"
            >
              {loading ? "Publicando..." : "Publicar donación"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
