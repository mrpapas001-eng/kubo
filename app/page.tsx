import Header from "@/components/Header";
import HomeHero from "@/components/HomeHero";
import HomeCategories from "@/components/HomeCategories";
import HomeFeaturedSection from "@/components/HomeFeaturedSection";
import ReelsSection from "@/components/ReelsSection";
import Footer from "@/components/Footer";
import InstallKuboButton from "@/components/InstallKuboButton";
import { getHomeListings, getHomeReels } from "@/lib/queries/home";
import { getHomeSponsors } from "@/lib/queries/sponsors";

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
];

const CATEGORY_OPTIONS = [
  { slug: "", label: "Todas las categorías" },
  { slug: "motor", label: "Motor" },
  { slug: "inmobiliaria", label: "Inmobiliaria" },
  { slug: "celulares", label: "Celulares" },
  { slug: "electrodomesticos", label: "Electrodomésticos" },
  { slug: "hogar", label: "Hogar" },
  { slug: "empleo", label: "Empleo" },
  { slug: "servicios", label: "Servicios" },
  { slug: "negocios", label: "Negocios" },
  { slug: "informatica", label: "Informática" },
  { slug: "imagen-sonido", label: "Imagen y sonido" },
  { slug: "juegos", label: "Juegos" },
  { slug: "formacion", label: "Formación y libros" },
  { slug: "deportes", label: "Deportes" },
  { slug: "mascotas", label: "Mascotas" },
  { slug: "bebes", label: "Bebés" },
  { slug: "moda", label: "Moda y complementos" },
];

export default async function Home() {
  const sponsors = await getHomeSponsors();
  const initialListings = await getHomeListings({ take: 24, skip: 0 });
  const reels = await getHomeReels();

  return (
    <div className="min-h-screen bg-[#F5F7FB] text-slate-900">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[260px] bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.08),_transparent_38%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.08),_transparent_32%),linear-gradient(to_bottom,_#ffffff,_#f5f7fb)]" />
        <div className="pointer-events-none absolute left-[-120px] top-16 h-72 w-72 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[-80px] top-10 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" />

        <Header />


        <main className="relative pb-10 pt-3 md:pt-4">
          <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
            <HomeHero />
            <InstallKuboButton />
<HomeCategories />

<HomeFeaturedSection
  listings={initialListings}
  sponsors={sponsors}
  cities={CITIES}
/>

<section className="mt-6">
  <ReelsSection items={reels} />
</section>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
