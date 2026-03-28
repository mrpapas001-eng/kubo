import Header from "@/components/Header";
import CategoryChips from "@/components/CategoryChips";
import HomeMapSection from "@/components/HomeMapSection";
import Footer from "@/components/Footer";
import { getHomeListings } from "@/lib/queries/home";
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

export default async function Home() {
  const sponsors = await getHomeSponsors();
  const initialListings = await getHomeListings({ take: 12, skip: 0 });
  const initialCity = "Pereira";

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 py-6 md:px-6">
        <CategoryChips />

        <section className="mt-6">
          <HomeMapSection
            initialListings={initialListings}
            sponsors={sponsors}
            initialCity={initialCity}
            cities={CITIES}
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}