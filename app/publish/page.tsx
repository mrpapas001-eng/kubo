"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";
import { recommendCategory } from "@/lib/catalog/recommendCategory";

type CategoryKey =
  | "motor"
  | "inmobiliaria"
  | "celulares"
  | "empleo"
  | "servicios"
  | "negocios"
  | "informatica"
  | "imagen-sonido"
  | "juegos"
  | "formacion"
  | "deportes"
  | "mascotas"
  | "bebes"
  | "moda"
  | "hogar"
  | "regalos-celebraciones"
  | "juguetes"
  | "papeleria-oficina"
  | "herramientas-ferreteria"
  | "salud-belleza";

type DealType = "venta" | "arriendo";

type Step = 1 | 2 | 3 | 4 | 5;

const CAR_BRANDS = [
  "AUDI",
  "BMW",
  "CHEVROLET",
  "CITROEN",
  "DAEWOO",
  "DODGE",
  "FORD",
  "HONDA",
  "HYUNDAI",
  "JEEP",
  "KIA",
  "LAMBORGHINI",
  "LAND ROVER",
  "MAZDA",
  "MERCEDES",
  "MG",
  "MINI",
  "NISSAN",
  "PEUGEOT",
  "RENAULT",
  "SUBARU",
  "SUZUKI",
  "TOYOTA",
  "VOLKSWAGEN",
  "VOLVO",
  "ELÉCTRICOS",
  "OTRA",
];

const MOTO_BRANDS = [
  "YAMAHA",
  "BMW",
  "HONDA",
  "CRYPTON",
  "VESPA",
  "SUZUKI",
  "AKT",
  "DUCATI",
  "KAWASAKI",
  "BAJAJ",
  "TVS",
  "KTM",
  "DYNAMO",
  "AUTECO",
  "APRILIA",
  "ELÉCTRICAS",
  "OTRA",
];

const CELLPHONE_BRANDS = [
  "SAMSUNG",
  "APPLE",
  "XIAOMI",
  "MOTOROLA",
  "HUAWEI",
  "OPPO",
  "VIVO",
  "REALME",
  "NOKIA",
  "LG",
  "OTRA",
];

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
  key: CategoryKey;
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
      { slug: "hogar", label: "Para hogar" },
      { slug: "personas", label: "Para personas" },
      { slug: "empresas", label: "Para empresas" },
      { slug: "electricos", label: "Servicios eléctricos" },
      { slug: "energia-solar", label: "Energía solar" },
      { slug: "motor", label: "Para motor" },
      { slug: "bicicleta", label: "Para bicicleta" },
      { slug: "otros", label: "Otros servicios" },
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
      { slug: "otros", label: "Otros deportes" },
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
      { slug: "habitacion-bebes", label: "Habitación de bebés" },
      { slug: "camaras-de-vigilancia", label: "Cámaras de vigilancia" },
      { slug: "coches-de-bebe", label: "Coches de bebé" },
      { slug: "juguetes", label: "Juguetes" },
      { slug: "higiene-y-cuidado", label: "Higiene y cuidado" },
      { slug: "varios", label: "Varios" },
    ],
  },
  {
    key: "moda",
    label: "Moda y complementos",
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
      { slug: "desayunos-y-sorpresas", label: "Desayunos y sorpresas" },
      { slug: "globos", label: "Globos" },
      { slug: "invitaciones-y-papeleria", label: "Invitaciones y papelería" },
      { slug: "articulos-religiosos", label: "Artículos religiosos" },
      { slug: "otros", label: "Otros" },
    ],
  },
  {
    key: "hogar",
    label: "Hogar",
    subs: [
      { slug: "muebles-de-hogar", label: "Muebles de hogar" },
      { slug: "decoracion", label: "Decoración" },
      { slug: "colchones", label: "Colchones" },
      { slug: "iluminacion", label: "Iluminación" },
      { slug: "menaje", label: "Menaje" },
      { slug: "organizacion", label: "Organización" },
      { slug: "jardin-y-terraza", label: "Jardín y terraza" },
      { slug: "otros", label: "Otros" },
    ],
  },
  {
    key: "juguetes",
    label: "Juguetes",
    subs: [
      { slug: "peluches", label: "Peluches" },
      { slug: "munecas-y-figuras", label: "Muñecas y figuras" },
      { slug: "juegos-de-mesa", label: "Juegos de mesa" },
      { slug: "didacticos", label: "Didácticos" },
      { slug: "aire-libre", label: "Aire libre" },
      { slug: "otros", label: "Otros" },
    ],
  },
  {
    key: "papeleria-oficina",
    label: "Papelería y Oficina",
    subs: [
      { slug: "utiles-escolares", label: "Útiles escolares" },
      { slug: "cuadernos-y-papel", label: "Cuadernos y papel" },
      { slug: "escritura-y-dibujo", label: "Escritura y dibujo" },
      { slug: "oficina-y-archivo", label: "Oficina y archivo" },
      { slug: "arte-y-manualidades", label: "Arte y manualidades" },
      { slug: "otros", label: "Otros" },
    ],
  },
  {
    key: "herramientas-ferreteria",
    label: "Herramientas y Ferretería",
    subs: [
      { slug: "herramientas-electricas", label: "Herramientas eléctricas" },
      { slug: "herramientas-manuales", label: "Herramientas manuales" },
      { slug: "construccion", label: "Construcción" },
      { slug: "jardineria", label: "Jardinería" },
      { slug: "seguridad-industrial", label: "Seguridad industrial" },
      { slug: "otros", label: "Otros" },
    ],
  },
  {
    key: "salud-belleza",
    label: "Salud y Belleza",
    subs: [
      { slug: "maquillaje", label: "Maquillaje" },
      { slug: "cuidado-de-la-piel", label: "Cuidado de la piel" },
      { slug: "cabello", label: "Cabello" },
      { slug: "aparatos-de-belleza", label: "Aparatos de belleza" },
      { slug: "salud-y-bienestar", label: "Salud y bienestar" },
      { slug: "otros", label: "Otros" },
    ],
  },
];

function toTitleCase(s: string) {
  const x = String(s || "").trim();
  if (!x) return "";
  return x
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

function formatCOP(value: string) {
  const numeric = Number(String(value || "").replace(/\D/g, ""));
  if (!numeric) return "";
  return new Intl.NumberFormat("es-CO").format(numeric);
}

function StepBadge({
  step,
  current,
  label,
}: {
  step: Step;
  current: Step;
  label: string;
}) {
  const isActive = current === step;
  const isDone = current > step;

  return (
    <div className="flex items-center gap-3">
      <div
        className={[
          "flex h-9 w-9 items-center justify-center rounded-full border text-sm font-black",
          isDone
            ? "border-[#0f3c8c] bg-[#0f3c8c] text-white"
            : isActive
            ? "border-[#0f3c8c] bg-[#e8f0ff] text-[#0f3c8c]"
            : "border-slate-200 bg-white text-slate-500",
        ].join(" ")}
      >
        {isDone ? <CheckCircle2 className="h-4 w-4" /> : step}
      </div>

      <div className="min-w-0">
        <div
          className={[
            "text-sm font-black",
            isActive || isDone ? "text-slate-900" : "text-slate-500",
          ].join(" ")}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

export default function PublishPage() {
  const PUBLISH_DRAFT_KEY = "kubo_publish_draft_v1";

  const router = useRouter();
  const { data: session, status } = useSession();

  const [step, setStep] = useState<Step>(1);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState<string>("Pereira");
  const [location, setLocation] = useState<string>("");
  const [manualCity, setManualCity] = useState("");

  const [category, setCategory] = useState<CategoryKey>("motor");
  const [subcategory, setSubcategory] = useState<string>("carros");
  const [sellQuery, setSellQuery] = useState("");
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);
  const [suggestionApplied, setSuggestionApplied] = useState(false);
  const [price, setPrice] = useState<string>("");

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const [carBrand, setCarBrand] = useState<string>(CAR_BRANDS[0]);
  const [carModel, setCarModel] = useState<string>("");
  const [carYear, setCarYear] = useState<string>("");
  const [carKm, setCarKm] = useState<string>("");
  const [carFuel, setCarFuel] = useState<string>("Gasolina");
  const [carTransmission, setCarTransmission] = useState<string>("Mecánica");

  const [motoBrand, setMotoBrand] = useState<string>(MOTO_BRANDS[0]);
  const [motoModel, setMotoModel] = useState<string>("");
  const [motoYear, setMotoYear] = useState<string>("");
  const [motoKm, setMotoKm] = useState<string>("");
  const [motoFuel, setMotoFuel] = useState<string>("Gasolina");
  const [motoTransmission, setMotoTransmission] = useState<string>("Mecánica");

  const [cellBrand, setCellBrand] = useState<string>(CELLPHONE_BRANDS[0]);
  const [cellModel, setCellModel] = useState<string>("");

  const [deal, setDeal] = useState<DealType>("venta");
  const [rooms, setRooms] = useState<string>("");
  const [baths, setBaths] = useState<string>("");
  const [sqm, setSqm] = useState<string>("");
  const [parking, setParking] = useState<boolean>(false);
const [reelUrl, setReelUrl] = useState("");

const [sellerType, setSellerType] = useState<"PARTICULAR" | "EMPRESA">(
  "PARTICULAR"
);

const [businessName, setBusinessName] = useState("");
const [businessDescription, setBusinessDescription] = useState("");
const [businessWebsite, setBusinessWebsite] = useState("");
const [businessInstagram, setBusinessInstagram] = useState("");
const [businessFacebook, setBusinessFacebook] = useState("");
const [businessWhatsapp, setBusinessWhatsapp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [publishedListingId, setPublishedListingId] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
const [promotionLoading, setPromotionLoading] = useState<
  "featured" | "premium" | null
>(null);

const [promotionError, setPromotionError] = useState<string | null>(null);

  // cargar borrador una sola vez al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(PUBLISH_DRAFT_KEY);
      if (!raw) return;

      const draft = JSON.parse(raw);

      if (draft.step) setStep(draft.step);
      if (draft.title !== undefined) setTitle(draft.title);
      if (draft.description !== undefined) setDescription(draft.description);
      if (draft.phone !== undefined) setPhone(draft.phone);
      if (draft.city !== undefined) setCity(draft.city);
      if (draft.manualCity !== undefined) setManualCity(draft.manualCity);
      if (draft.category !== undefined) setCategory(draft.category);
      if (draft.subcategory !== undefined) setSubcategory(draft.subcategory);
      if (draft.sellQuery !== undefined) setSellQuery(draft.sellQuery);
      if (draft.price !== undefined) setPrice(draft.price);

      if (draft.carBrand !== undefined) setCarBrand(draft.carBrand);
      if (draft.carModel !== undefined) setCarModel(draft.carModel);
      if (draft.carYear !== undefined) setCarYear(draft.carYear);
      if (draft.carKm !== undefined) setCarKm(draft.carKm);
      if (draft.carFuel !== undefined) setCarFuel(draft.carFuel);
      if (draft.carTransmission !== undefined) setCarTransmission(draft.carTransmission);

      if (draft.motoBrand !== undefined) setMotoBrand(draft.motoBrand);
      if (draft.motoModel !== undefined) setMotoModel(draft.motoModel);
      if (draft.motoYear !== undefined) setMotoYear(draft.motoYear);
      if (draft.motoKm !== undefined) setMotoKm(draft.motoKm);
      if (draft.motoFuel !== undefined) setMotoFuel(draft.motoFuel);
      if (draft.motoTransmission !== undefined) setMotoTransmission(draft.motoTransmission);

      if (draft.cellBrand !== undefined) setCellBrand(draft.cellBrand);
      if (draft.cellModel !== undefined) setCellModel(draft.cellModel);

      if (draft.deal !== undefined) setDeal(draft.deal);
      if (draft.rooms !== undefined) setRooms(draft.rooms);
      if (draft.baths !== undefined) setBaths(draft.baths);
      if (draft.sqm !== undefined) setSqm(draft.sqm);
      if (draft.parking !== undefined) setParking(draft.parking);
      if (draft.reelUrl !== undefined) setReelUrl(draft.reelUrl);
    } catch {
      localStorage.removeItem(PUBLISH_DRAFT_KEY);
    }
  }, []);

  // guardar borrador cuando cambian campos relevantes
  useEffect(() => {
    const draft = {
      step,
      title,
      description,
      phone,
      city,
      manualCity,
      category,
      subcategory,
      sellQuery,
      price,
      carBrand,
      carModel,
      carYear,
      carKm,
      carFuel,
      carTransmission,
      motoBrand,
      motoModel,
      motoYear,
      motoKm,
      motoFuel,
      motoTransmission,
      cellBrand,
      cellModel,
      deal,
      rooms,
      baths,
      sqm,
      parking,
      reelUrl,
    };

    try {
      localStorage.setItem(PUBLISH_DRAFT_KEY, JSON.stringify(draft));
    } catch {}
  }, [
    step,
    title,
    description,
    phone,
    city,
    manualCity,
    category,
    subcategory,
    sellQuery,
    price,
    carBrand,
    carModel,
    carYear,
    carKm,
    carFuel,
    carTransmission,
    motoBrand,
    motoModel,
    motoYear,
    motoKm,
    motoFuel,
    motoTransmission,
    cellBrand,
    cellModel,
    deal,
    rooms,
    baths,
    sqm,
    parking,
    reelUrl,
  ]);

  // limpiar URLs de preview al desmontar
  useEffect(() => {
    return () => {
      previewUrls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [previewUrls]);

  const subsForCategory = useMemo(() => {
    return CATEGORY_OPTIONS.find((c) => c.key === category)?.subs ?? [];
  }, [category]);

  const suggestion = useMemo(() => {
    const rec = recommendCategory(sellQuery);
    if (!rec) return null;
    const cat = CATEGORY_OPTIONS.find((c) => c.key === rec.categoryKey);
    if (!cat) return null;
    const sub = rec.subcategorySlug
      ? cat.subs.find((s) => s.slug === rec.subcategorySlug) ?? null
      : null;
    return { ...rec, categoryLabel: cat.label, subLabel: sub?.label ?? null, subSlug: sub?.slug ?? null };
  }, [sellQuery]);

  function onSellQueryChange(next: string) {
    setSellQuery(next);
    setSuggestionDismissed(false);
    setSuggestionApplied(false);
  }

  function applySuggestion() {
    if (!suggestion) return;
    setCategory(suggestion.categoryKey as CategoryKey);
    const firstSub =
      CATEGORY_OPTIONS.find((c) => c.key === suggestion.categoryKey)?.subs?.[0]?.slug ??
      "general";
    setSubcategory(suggestion.subSlug ?? firstSub);
    setSuggestionApplied(true);
  }

  function onPickCategory(next: CategoryKey) {
    setCategory(next);
    const firstSub =
      CATEGORY_OPTIONS.find((c) => c.key === next)?.subs?.[0]?.slug ?? "general";
    setSubcategory(firstSub);
  }

  const isCar = category === "motor" && subcategory === "carros";
  const isMoto = category === "motor" && subcategory === "motos";
  const isRealEstate = category === "inmobiliaria";
  const isCellPhone = category === "celulares" && subcategory === "celulares";

  const requiresPrice = !["empleo", "servicios"].includes(category);

  const finalCity = city === "Otra" ? manualCity.trim() : city;

  const suggestedTitle = useMemo(() => {
    if (isCar) {
      const brand = toTitleCase(carBrand.replace("ELÉCTRICOS", "Eléctrico"));
      const model = toTitleCase(carModel);
      const year = String(carYear || "").trim();
      return [brand, model, year].filter(Boolean).join(" ") || "Carro en excelente estado";
    }

    if (isMoto) {
      const brand = toTitleCase(motoBrand.replace("ELÉCTRICAS", "Eléctrica"));
      const model = toTitleCase(motoModel);
      const year = String(motoYear || "").trim();
      return [brand, model, year].filter(Boolean).join(" ") || "Moto en excelente estado";
    }

    if (isRealEstate) {
      const sub =
        subsForCategory.find((s) => s.slug === subcategory)?.label ?? "Inmueble";
      const dealText = deal === "arriendo" ? "en arriendo" : "en venta";
      const roomsText = rooms ? `${rooms} alcobas` : "";
      return [sub, dealText, roomsText].filter(Boolean).join(" ");
    }

    if (isCellPhone) {
      const brand = toTitleCase(cellBrand);
      const model = toTitleCase(cellModel);
      return [brand, model].filter(Boolean).join(" ") || "Celular en venta";
    }

    const catLabel =
      CATEGORY_OPTIONS.find((c) => c.key === category)?.label ?? "Anuncio";

    const subLabel =
      subsForCategory.find((s) => s.slug === subcategory)?.label ??
      toTitleCase(subcategory);

    return `${catLabel}: ${subLabel || "Nuevo"}`;
  }, [
    isCar,
    isMoto,
    isRealEstate,
    isCellPhone,
    carBrand,
    carModel,
    carYear,
    motoBrand,
    motoModel,
    motoYear,
    cellBrand,
    cellModel,
    subcategory,
    deal,
    rooms,
    category,
    subsForCategory,
  ]);

  useEffect(() => {
    if (!title.trim()) {
      setTitle(suggestedTitle);
    }
  }, [suggestedTitle]);



  function validateStep(nextStep?: Step) {
    setError(null);

    if (step === 1 || nextStep === 1) {
      if (!category) return "Selecciona una categoría.";
      if (!subcategory) return "Selecciona una subcategoría.";
      if (!finalCity) return "Selecciona una ciudad.";
    }

    if (step === 2 || nextStep === 2) {
      if (isCar && !carBrand) return "Selecciona la marca del carro.";
      if (isCar && !carModel.trim()) return "Ingresa el modelo del carro.";
      if (isCar && !carYear.trim()) return "Ingresa el año del carro.";

      if (isMoto && !motoBrand) return "Selecciona la marca de la moto.";
      if (isMoto && !motoModel.trim()) return "Ingresa el modelo de la moto.";
      if (isMoto && !motoYear.trim()) return "Ingresa el año de la moto.";

      if (isCellPhone && !cellBrand) return "Selecciona la marca del celular.";
      if (isCellPhone && !cellModel.trim())
        return "Ingresa el modelo del celular.";

      if (isRealEstate) {
        if (!deal) return "Selecciona si es venta o arriendo.";
        if (!String(sqm).trim())
          return "Ingresa los metros cuadrados del inmueble.";

        const requiresRoomsAndBaths = [
          "casa",
          "apartamento",
          "apartaestudio",
          "finca",
        ].includes(subcategory);

        if (requiresRoomsAndBaths) {
          if (!String(rooms).trim()) return "Ingresa el número de alcobas.";
          if (!String(baths).trim()) return "Ingresa el número de baños.";
        }
      }
    }

    if (step === 3 || nextStep === 3) {
      if (!title.trim()) return "Escribe un título para el anuncio.";
      if (!description.trim()) return "Escribe una descripción.";
      if (requiresPrice && !String(price).trim()) {
        return "Ingresa el precio del anuncio.";
      }
    }

if (step === 4 || nextStep === 4) {
  if (imageFiles.length === 0) {
    return "Debes subir al menos una foto.";
  }

  if (!phone.trim()) return "Ingresa un teléfono de contacto.";

  const cleanPhone = phone.replace(/\D/g, "");
  if (cleanPhone.length < 7 || cleanPhone.length > 10) {
    return "El teléfono debe tener entre 7 y 10 dígitos.";
  }

  if (sellerType === "EMPRESA" && !businessName.trim()) {
    return "Ingresa el nombre de la empresa.";
  }
}

    return null;
  }

  function goNext() {
    const message = validateStep();
    if (message) {
      setError(message);
      return;
    }
    setError(null);
    setStep((prev) => (prev < 5 ? ((prev + 1) as Step) : prev));
  }

  function goBack() {
    setError(null);
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    for (const s of [1, 2, 3, 4] as Step[]) {
      const message = validateStep(s);
      if (message) {
        setError(message);
        setStep(s);
        return;
      }
    }

    setLoading(true);

    try {
      let uploadedUrls: string[] = [];

      if (imageFiles.length) {
        const fd = new FormData();
        imageFiles.slice(0, 10).forEach((f) => fd.append("files", f));

        const up = await fetch("/api/upload", {
          method: "POST",
          body: fd,
        });

        const upData = await up.json();

        if (!up.ok || !upData?.ok) {
          throw new Error(upData?.error ?? "No se pudo subir imágenes");
        }

        uploadedUrls = Array.isArray(upData.urls) ? upData.urls : [];
      }

const details: any = {
  images: uploadedUrls,
};

if (reelUrl && reelUrl.trim() !== "") {
  details.reelUrl = reelUrl.trim();
}

if (isCar) {
details.motor = {
  type: "carro",
  brand: carBrand,
  model: carModel || null,
  year: carYear ? Number(carYear) : null,
  km: carKm ? Number(carKm) : null,
  fuel: carFuel,
  transmission: carTransmission,
};
      }
if (isMoto) {
  details.motor = {
    type: "moto",
    brand: motoBrand,
    model: motoModel || null,
    year: motoYear ? Number(motoYear) : null,
    km: motoKm ? Number(motoKm) : null,
    fuel: motoFuel,
    transmission: motoTransmission,
  };
}

      if (isMoto) {

      }

      if (isRealEstate) {
        details.realEstate = {
          deal,
          rooms: rooms ? Number(rooms) : null,
          baths: baths ? Number(baths) : null,
          sqm: sqm ? Number(sqm) : null,
          parking,
        };
      }

      if (isCellPhone) {
        details.cellphone = {
          brand: cellBrand,
          model: cellModel || null,
        };
      }

      const normalizedPrice = String(price).replace(/\D/g, "");

      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          phone: phone.replace(/\D/g, ""),
          price: normalizedPrice ? Number(normalizedPrice) : null,
          currency: "COP",
          city: finalCity,
          location: location.trim(),
          categorySlug: category,
          subcategorySlug: subcategory,
          template: category === "servicios" ? "SERVICE_JOB" : "GENERAL",
          sellerType,
          isVerified: false,
          imageUrl: uploadedUrls[0] ?? null,
          details,
          // normalizamos el email para evitar problemas de mayúsculas/espacios
          ownerEmail: session?.user?.email?.toLowerCase().trim() ?? null,
          businessName: businessName.trim(),
businessDescription: businessDescription.trim(),
businessWebsite: businessWebsite.trim(),
businessInstagram: businessInstagram.trim(),
businessFacebook: businessFacebook.trim(),
businessWhatsapp: businessWhatsapp.trim(),
        }),
      });

const data = await res.json();

if (!res.ok || !data?.ok) {
  throw new Error(data?.error ?? "No se pudo publicar");
}


      localStorage.removeItem(PUBLISH_DRAFT_KEY);
      setPublishedListingId(data.listing.id);
      setVerificationStatus(data.verificationStatus ?? null);
    } catch (err: any) {
      setError(err?.message ?? "Error");
    } finally {
      setLoading(false);
    }
  }
async function activatePromotion(kind: "featured" | "premium") {
  if (!publishedListingId) return;

  try {
    setPromotionLoading(kind);
    setPromotionError(null);

    const res = await fetch(
      `/api/promote/${kind}?listingId=${publishedListingId}`,
      {
        method: "GET",
      }
    );

    if (res.redirected) {
      router.push(`/listing/${publishedListingId}`);
      return;
    }

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(
        data?.error ||
          `No se pudo activar ${
            kind === "featured" ? "Destacado" : "Premium"
          }.`
      );
    }

    router.push(`/listing/${publishedListingId}`);
  } catch (err: any) {
    setPromotionError(
      err?.message ||
        `No se pudo activar ${
          kind === "featured" ? "Destacado" : "Premium"
        }.`
    );
  } finally {
    setPromotionLoading(null);
  }
}

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#F8F9FB] px-6 pb-36 pt-10 md:py-10">
        <div className="mx-auto max-w-[980px] rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-900">Cargando sesión...</h1>
          <p className="mt-2 text-slate-500">
            Estamos comprobando tu acceso para publicar.
          </p>
        </div>
      </div>
    );
  }

if (!session) {
  return (
    <div className="min-h-screen bg-[#F8F9FB] px-6 pb-36 pt-10 md:py-10">
      <div className="mx-auto max-w-[980px] rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black text-slate-900">
          Inicia sesión para publicar
        </h1>

        <p className="mt-2 text-slate-500">
          Necesitas entrar con tu cuenta para crear un anuncio.
        </p>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/publish" })}
          className="mt-6 rounded-xl bg-[#0f3c8c] px-6 py-3 font-bold text-white"
        >
          Entrar con Google
        </button>
      </div>
    </div>
  );
}

  if (publishedListingId) {
    const verificationHref =
      sellerType === "EMPRESA" ? "/verificar-empresa" : "/verificar-identidad";
    const isVerified = verificationStatus === "VERIFIED";
    const isPending = verificationStatus === "PENDING";

    return (
      <div className="min-h-screen bg-[#F8F9FB] px-4 pb-36 pt-6 md:px-6 md:py-10">
        <div className="mx-auto max-w-[680px] rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="h-7 w-7" />
            <h1 className="text-2xl font-black">Tu anuncio fue publicado</h1>
          </div>

          {isVerified ? (
            <p className="mt-4 text-slate-600">
              Tu cuenta ya está verificada.
            </p>
          ) : isPending ? (
            <p className="mt-4 text-slate-600">
              Verificación pendiente. Estamos revisando tu información.
            </p>
          ) : sellerType === "EMPRESA" ? (
            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="font-bold text-slate-900">
                Verifica tu empresa para conseguir la insignia Empresa verificada.
              </p>
              <Link
                href={verificationHref}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-[#0f3c8c] px-5 text-sm font-black text-white hover:bg-[#0c2f6d]"
              >
                Verificar empresa
              </Link>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <p className="font-bold text-slate-900">
                Verifica tu cuenta para conseguir la insignia Usuario verificado en tus anuncios.
              </p>
              <Link
                href={verificationHref}
                className="mt-4 inline-flex h-11 items-center justify-center rounded-xl bg-[#0f3c8c] px-5 text-sm font-black text-white hover:bg-[#0c2f6d]"
              >
                Verificar por WhatsApp
              </Link>
            </div>
          )}

          {sellerType === "EMPRESA" ? (
            <div className="mt-6 space-y-4">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  Dale más visibilidad a tu anuncio
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Durante el lanzamiento de Kubo, las promociones para empresas
                  son gratuitas y tienen cupos diarios limitados.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => activatePromotion("featured")}
                  disabled={promotionLoading !== null}
                  className="rounded-2xl border border-[#0f3c8c]/20 bg-blue-50 p-5 text-left transition hover:-translate-y-0.5 hover:border-[#0f3c8c]/40 hover:shadow-md disabled:opacity-60"
                >
                  <div className="text-xs font-black uppercase tracking-wide text-[#0f3c8c]">
                    Destacado
                  </div>

                  <div className="mt-2 text-xl font-black text-slate-900">
                    Gratis por 48 horas
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Tu anuncio obtiene más visibilidad y se diferencia
                    visualmente del resto.
                  </p>

                  <div className="mt-4 text-sm font-black text-[#0f3c8c]">
                    {promotionLoading === "featured"
                      ? "Activando..."
                      : "Activar Destacado"}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => activatePromotion("premium")}
                  disabled={promotionLoading !== null}
                  className="rounded-2xl border border-amber-300 bg-gradient-to-b from-amber-50 to-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60"
                >
                  <div className="text-xs font-black uppercase tracking-wide text-amber-700">
                    Premium
                  </div>

                  <div className="mt-2 text-xl font-black text-slate-900">
                    Gratis por 48 horas
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Máxima visibilidad durante el lanzamiento, con apariencia
                    Premium y cupos diarios limitados.
                  </p>

                  <div className="mt-4 text-sm font-black text-amber-700">
                    {promotionLoading === "premium"
                      ? "Activando..."
                      : "Activar Premium"}
                  </div>
                </button>
              </div>

              {promotionError ? (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  {promotionError}
                </div>
              ) : null}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => router.push(`/listing/${publishedListingId}`)}
            className="mt-4 h-11 rounded-xl border border-slate-200 px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
          >
            {isVerified || isPending ? "Ver anuncio" : "Ahora no"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] px-4 pb-36 pt-6 md:px-6 md:py-10">
      <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden self-start lg:sticky lg:top-24 lg:block">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="text-xs font-black uppercase tracking-wide text-slate-500">
              Publicar en KUBO
            </div>
            <h2 className="mt-2 text-xl font-black text-slate-900">
              Completa tu anuncio paso a paso
            </h2>

            <div className="mt-6 space-y-5">
              <StepBadge step={1} current={step} label="Categoría y ciudad" />
              <StepBadge step={2} current={step} label="Detalles del producto" />
              <StepBadge step={3} current={step} label="Contenido del anuncio" />
              <StepBadge step={4} current={step} label="Fotos y contacto" />
              <StepBadge step={5} current={step} label="Revisión final" />
            </div>
          </div>
        </aside>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900">
                Publicar anuncio
              </h1>
              <p className="mt-2 font-medium text-slate-500">
                Crea tu anuncio con una experiencia más guiada.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700">
              Paso {step} de 5
            </div>
          </div>

          <div className="mt-5 lg:hidden">
            <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-wide text-slate-500">
              <span>Progreso</span>
              <span>{Math.round((step / 5) * 100)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-[#0f3c8c] transition-all"
                style={{ width: `${(step / 5) * 100}%` }}
              />
            </div>
            <div className="mt-3 grid grid-cols-5 gap-1">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className={`h-9 rounded-xl text-center text-xs font-black leading-9 ${
                    step === item
                      ? "bg-[#0f3c8c] text-white"
                      : step > item
                        ? "bg-blue-50 text-[#0f3c8c]"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-8">
            {step === 1 ? (
              <div className="space-y-5">
                <div className="rounded-2xl border border-blue-100 bg-[#f4f8ff] p-4 md:p-5">
                  <label className="flex items-center gap-2 text-sm font-black text-slate-900">
                    <Sparkles className="h-4 w-4 text-[#0f3c8c]" />
                    ¿Qué quieres vender?
                  </label>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    Escribe qué quieres publicar y te ayudamos a encontrar la categoría.
                  </p>
                  <input
                    value={sellQuery}
                    onChange={(e) => onSellQueryChange(e.target.value)}
                    className="mt-3 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-[15px]"
                    placeholder="Ej: Peluche grande de Stitch"
                  />

                  {suggestion && !suggestionDismissed ? (
                    suggestionApplied && category === suggestion.categoryKey ? (
                      <div className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
                        <CheckCircle2 className="h-4 w-4" />
                        Categoría aplicada: {suggestion.categoryLabel}
                        {suggestion.subLabel ? ` · ${suggestion.subLabel}` : ""}. Puedes
                        cambiarla abajo si lo prefieres.
                      </div>
                    ) : (
                      <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
                        <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                          Categoría recomendada
                        </div>
                        <div className="mt-1 text-lg font-black text-slate-900">
                          {suggestion.emoji} {suggestion.categoryLabel}
                          {suggestion.subLabel ? (
                            <span className="ml-2 text-sm font-bold text-slate-500">
                              {suggestion.subLabel}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                          <button
                            type="button"
                            onClick={applySuggestion}
                            className="h-11 rounded-xl bg-[#0f3c8c] px-5 text-sm font-black text-white hover:bg-[#0c2f6d]"
                          >
                            Usar esta categoría
                          </button>
                          <button
                            type="button"
                            onClick={() => setSuggestionDismissed(true)}
                            className="h-11 rounded-xl border border-slate-200 px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
                          >
                            Elegir otra categoría
                          </button>
                        </div>
                      </div>
                    )
                  ) : null}

                  {sellQuery.trim().length >= 3 && !suggestion ? (
                    <p className="mt-3 text-xs font-bold text-slate-500">
                      No estamos seguros de la categoría ideal. Elige una manualmente abajo.
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Categoría
                    </label>
                    <select
                      value={category}
                      onChange={(e) => onPickCategory(e.target.value as CategoryKey)}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
                    >
                      {CATEGORY_OPTIONS.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
<div>
  <label className="text-sm font-bold text-slate-700">
    Ubicación exacta
  </label>

  <input
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4"
    placeholder="Ej: Centro, Av. 30 de Agosto, cerca del Éxito"
  />
</div>

                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Subcategoría
                    </label>
                    <select
                      value={subcategory}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
                    >
                      {subsForCategory.map((s) => (
                        <option key={s.slug} value={s.slug}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Ciudad</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {city === "Otra" ? (
                  <div>
                    <label className="text-sm font-bold text-slate-700">
                      Escribe tu ciudad
                    </label>
                    <input
                      value={manualCity}
                      onChange={(e) => setManualCity(e.target.value)}
                      className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4"
                      placeholder="Ej: Chía, Cundinamarca"
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {step === 2 ? (
              <div className="space-y-5">
{isCar ? (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="font-black text-slate-900">Datos del carro</div>

    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-bold text-slate-700">Marca</label>
        <select
          value={carBrand}
          onChange={(e) => setCarBrand(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
        >
          {CAR_BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Modelo</label>
        <input
          value={carModel}
          onChange={(e) => setCarModel(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="Ej: Q3, Duster, Mazda 3..."
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Año</label>
        <input
          value={carYear}
          onChange={(e) => setCarYear(e.target.value.replace(/\D/g, ""))}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="Ej: 2020"
          inputMode="numeric"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Km</label>
        <input
          value={carKm}
          onChange={(e) => setCarKm(e.target.value.replace(/\D/g, ""))}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="Ej: 45000"
          inputMode="numeric"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Combustible</label>
        <select
          value={carFuel}
          onChange={(e) => setCarFuel(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
        >
          <option value="Gasolina">Gasolina</option>
          <option value="Diésel">Diésel</option>
          <option value="Gas">Gas</option>
          <option value="Híbrido">Híbrido</option>
          <option value="Eléctrico">Eléctrico</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Transmisión</label>
        <select
          value={carTransmission}
          onChange={(e) => setCarTransmission(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
        >
          <option value="Mecánica">Mecánica</option>
          <option value="Automática">Automática</option>
        </select>
      </div>
    </div>
  </div>
) : null}

{isMoto ? (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="font-black text-slate-900">Datos de la moto</div>

    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="text-sm font-bold text-slate-700">Marca</label>
        <select
          value={motoBrand}
          onChange={(e) => setMotoBrand(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
        >
          {MOTO_BRANDS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Modelo</label>
        <input
          value={motoModel}
          onChange={(e) => setMotoModel(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="Ej: FZ, NKD, Pulsar..."
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Año</label>
        <input
          value={motoYear}
          onChange={(e) => setMotoYear(e.target.value.replace(/\D/g, ""))}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="Ej: 2022"
          inputMode="numeric"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Km</label>
        <input
          value={motoKm}
          onChange={(e) => setMotoKm(e.target.value.replace(/\D/g, ""))}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="Ej: 12000"
          inputMode="numeric"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Combustible</label>
        <select
          value={motoFuel}
          onChange={(e) => setMotoFuel(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
        >
          <option value="Gasolina">Gasolina</option>
          <option value="Eléctrica">Eléctrica</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">Transmisión</label>
        <select
          value={motoTransmission}
          onChange={(e) => setMotoTransmission(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
        >
          <option value="Mecánica">Mecánica</option>
          <option value="Automática">Automática</option>
          <option value="Semiautomática">Semiautomática</option>
        </select>
      </div>
    </div>
  </div>
) : null}

                {isRealEstate ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="font-black text-slate-900">Datos del inmueble</div>

                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-bold text-slate-700">
                          Venta / Arriendo
                        </label>
                        <select
                          value={deal}
                          onChange={(e) => setDeal(e.target.value as DealType)}
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
                        >
                          <option value="venta">Venta</option>
                          <option value="arriendo">Arriendo</option>
                        </select>
                      </div>

                      <div className="flex items-end gap-3">
                        <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                          <input
                            type="checkbox"
                            checked={parking}
                            onChange={(e) => setParking(e.target.checked)}
                            className="h-4 w-4"
                          />
                          Parqueadero
                        </label>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-700">Alcobas</label>
                        <input
                          value={rooms}
                          onChange={(e) => setRooms(e.target.value.replace(/\D/g, ""))}
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
                          placeholder="Ej: 3"
                          inputMode="numeric"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-700">Baños</label>
                        <input
                          value={baths}
                          onChange={(e) => setBaths(e.target.value.replace(/\D/g, ""))}
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
                          placeholder="Ej: 2"
                          inputMode="numeric"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-700">Metros²</label>
                        <input
                          value={sqm}
                          onChange={(e) => setSqm(e.target.value.replace(/\D/g, ""))}
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
                          placeholder="Ej: 85"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {isCellPhone ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="font-black text-slate-900">Datos del celular</div>

                    <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-sm font-bold text-slate-700">Marca</label>
                        <select
                          value={cellBrand}
                          onChange={(e) => setCellBrand(e.target.value)}
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
                        >
                          {CELLPHONE_BRANDS.map((b) => (
                            <option key={b} value={b}>
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-700">Modelo</label>
                        <input
                          value={cellModel}
                          onChange={(e) => setCellModel(e.target.value)}
                          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
                          placeholder="Ej: iPhone 13, Galaxy S23..."
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {!isCar && !isMoto && !isRealEstate && !isCellPhone ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm font-medium text-slate-600">
                    Esta categoría no necesita datos técnicos extra por ahora. Puedes continuar al siguiente paso.
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* Paso 3, 4, 5 y resto del formulario: (mantengo tu código original para estos pasos) */}
            {step === 3 ? (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-slate-700">Título</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4"
                    placeholder="Ej: Chevrolet Onix 2020"
                    required
                  />

                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div className="text-[11px] font-extrabold uppercase text-slate-500">
                      Título sugerido
                    </div>
                    <div className="mt-1 text-sm font-black text-slate-900">
                      {suggestedTitle}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setTitle(suggestedTitle)}
                        className="h-9 rounded-xl bg-slate-900 px-4 text-sm font-black text-white"
                      >
                        Usar sugerido
                      </button>

                      <button
                        type="button"
                        onClick={() => setTitle("")}
                        className="h-9 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700"
                      >
                        Restablecer
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">Descripción</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-2 min-h-[140px] w-full rounded-xl border border-slate-200 p-4"
                    placeholder="Cuenta detalles importantes del producto o servicio..."
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Precio {requiresPrice ? "(COP)" : "(opcional)"}
                  </label>
                  <input
                    value={price}
                    onChange={(e) => {
                      const clean = e.target.value.replace(/\D/g, "");
                      setPrice(clean);
                    }}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4"
                    placeholder="Ej: 85000000"
                    inputMode="numeric"
                  />
                  {price ? (
                    <p className="mt-2 text-sm font-medium text-slate-500">
                      COP {formatCOP(price)}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            {step === 4 ? (
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-bold text-slate-700">
                    Fotos (hasta 10)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="mt-2 block w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm file:mr-4 file:rounded-xl file:border-0 file:bg-[#0f3c8c] file:px-4 file:py-2 file:text-sm file:font-black file:text-white"
                    onChange={(e) => {
                      previewUrls.forEach((u) => URL.revokeObjectURL(u));
                      const list = Array.from(e.target.files ?? []).slice(0, 10);
                      setImageFiles(list);
                      const urls = list.map((f) => URL.createObjectURL(f));
                      setPreviewUrls(urls);
                    }}
                  />

                  {imageFiles.length ? (
                    <p className="mt-2 text-xs font-medium text-slate-500">
                      {imageFiles.length} archivo(s) seleccionados
                    </p>
                  ) : null}

                  {previewUrls.length ? (
                    <div className="mt-3 grid grid-cols-3 gap-2 md:grid-cols-5">
                      {previewUrls.map((u, i) => (
                        <img
                          key={`${u}-${i}`}
                          src={u}
                          alt={`preview-${i}`}
                          className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
                        />
                      ))}
                    </div>
                  ) : null}
                </div>

                <div>
                  <div className="rounded-3xl border border-blue-100 bg-blue-50 p-5">
  <div className="text-sm font-black text-[#0f3c8c]">
    Publicas como particular o empresa?
  </div>

  <p className="mt-1 text-sm font-medium text-slate-600">
    Las empresas verificadas pueden tener perfil, redes sociales,
    mayor visibilidad y branding profesional dentro de Kubo.
  </p>

  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
    <button
      type="button"
      onClick={() => setSellerType("PARTICULAR")}
      className={`rounded-2xl border px-4 py-4 text-left transition ${
        sellerType === "PARTICULAR"
          ? "border-[#0f3c8c] bg-white text-[#0f3c8c]"
          : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      <div className="font-black">Particular</div>

      <div className="mt-1 text-xs font-medium">
        Publico un anuncio personal.
      </div>
    </button>

    <button
      type="button"
      onClick={() => setSellerType("EMPRESA")}
      className={`rounded-2xl border px-4 py-4 text-left transition ${
        sellerType === "EMPRESA"
          ? "border-[#0f3c8c] bg-white text-[#0f3c8c]"
          : "border-slate-200 bg-white text-slate-700"
      }`}
    >
      <div className="font-black">Empresa</div>

      <div className="mt-1 text-xs font-medium">
        Soy negocio, tienda, concesionario o empresa.
      </div>
    </button>
  </div>
</div>
{sellerType === "EMPRESA" ? (
  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
    <div className="text-sm font-black text-slate-900">
      Informacion de empresa
    </div>

    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Nombre empresa
        </label>

        <input
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="Ej: Autos Pereira"
        />
      </div>

      <div className="md:col-span-2">
        <label className="text-sm font-bold text-slate-700">
          Descripcion empresa
        </label>

        <textarea
          value={businessDescription}
          onChange={(e) => setBusinessDescription(e.target.value)}
          className="mt-2 min-h-[120px] w-full rounded-xl border border-slate-200 bg-white p-4"
          placeholder="Describe tu negocio, servicios y experiencia..."
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Sitio web
        </label>

        <input
          value={businessWebsite}
          onChange={(e) => setBusinessWebsite(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Instagram
        </label>

        <input
          value={businessInstagram}
          onChange={(e) => setBusinessInstagram(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="https://instagram.com/..."
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          Facebook
        </label>

        <input
          value={businessFacebook}
          onChange={(e) => setBusinessFacebook(e.target.value)}
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="https://facebook.com/..."
        />
      </div>

      <div>
        <label className="text-sm font-bold text-slate-700">
          WhatsApp empresa
        </label>

        <input
          value={businessWhatsapp}
          onChange={(e) =>
            setBusinessWhatsapp(
              e.target.value.replace(/[^\d]/g, "").slice(0, 10)
            )
          }
          className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-4"
          placeholder="3001234567"
        />
      </div>
    </div>
  </div>
) : null}
                  <label className="text-sm font-bold text-slate-700">Telefono</label>
                  <input
                    value={phone}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/[^\d]/g, "").slice(0, 10))
                    }
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4"
                    placeholder="Ej: 3001234567"
                    inputMode="numeric"
                    required
                  />
                </div>
                <div>
  <label className="text-sm font-bold text-slate-700">
    Enlace del reel o video corto (opcional)
  </label>
  <input
    value={reelUrl}
    onChange={(e) => setReelUrl(e.target.value)}
    className="mt-2 h-11 w-full rounded-xl border border-slate-200 px-4"
    placeholder="Ej: https://www.instagram.com/reel/..."
  />
  <p className="mt-2 text-xs font-medium text-slate-500">
    Puedes pegar un enlace de Instagram, TikTok, YouTube Shorts u otro video.
  </p>
</div>
              </div>
            ) : null}

            {step === 5 ? (
              <div className="space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="text-xs font-black uppercase tracking-wide text-slate-500">
                    Vista previa
                  </div>

                  <div className="mt-3 text-2xl font-black text-slate-900">
                    {title || suggestedTitle}
                  </div>

                  <div className="mt-2 text-sm font-medium text-slate-500">
                    {finalCity || "Sin ciudad"} ·{" "}
                    {
                      CATEGORY_OPTIONS.find((c) => c.key === category)?.label
                    }{" "}
                    /{" "}
                    {subsForCategory.find((s) => s.slug === subcategory)?.label ??
                      subcategory}
                  </div>

                  <div className="mt-4 text-3xl font-black text-[#0f3c8c]">
                    {price ? `COP ${formatCOP(price)}` : "Precio a convenir"}
                  </div>

                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                    {description || "Sin descripción"}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                      Contacto
                    </div>
                    <div className="mt-1 text-sm font-black text-slate-900">
                      {phone || "No definido"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="text-[11px] font-black uppercase tracking-wide text-slate-500">
                      Fotos
                    </div>
                    <div className="mt-1 text-sm font-black text-slate-900">
                      {imageFiles.length} seleccionada(s)
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">
                {error}
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="grid grid-cols-2 gap-3 sm:flex">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-700 hover:bg-slate-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Atrás
                  </button>
                ) : null}

                <Link
                  href="/"
                  className={`flex h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 hover:bg-slate-50 ${
                    step === 1 ? "col-span-2 sm:col-span-1" : ""
                  }`}
                >
                  Cancelar
                </Link>
              </div>

              <div className="flex gap-3">
                {step < 5 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#0f3c8c] px-6 text-sm font-black text-white hover:bg-[#0c2f6d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f3c8c]/30 sm:w-auto"
                  >
                    Siguiente
                    <ChevronRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="h-12 w-full rounded-xl bg-slate-900 px-6 text-sm font-black text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/30 disabled:opacity-60 sm:w-auto"
                  >
                    {loading ? "Publicando..." : "Publicar anuncio"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
