import Header from "@/components/Header";
import HomeHero from "@/components/HomeHero";
import HomeCategories from "@/components/HomeCategories";
import HomeFeaturedSection from "@/components/HomeFeaturedSection";
import HomeSponsorMain from "@/components/HomeSponsorMain";
import Footer from "@/components/Footer";
import InstallKuboButton from "@/components/InstallKuboButton";
import { getHomeListings, getHomeReels } from "@/lib/queries/home";
import { getHomeSponsors } from "@/lib/queries/sponsors";
import { HOME_CITIES } from "@/app/data/cities";

export const revalidate = 60;



type HomeProps = {
  searchParams: Promise<{
    city?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const requestedCity =
    typeof params.city === "string" ? params.city : "";

  const initialCity = HOME_CITIES.includes(
  requestedCity as (typeof HOME_CITIES)[number]
)
  ? requestedCity
  : "Pereira";

  const sponsors = await getHomeSponsors();
  const initialListings = await getHomeListings({
    take: 24,
    skip: 0,
  });
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
            <HomeHero initialCity={initialCity} />

            <InstallKuboButton />

            <HomeCategories />

            <HomeSponsorMain sponsors={sponsors.main} />

            <HomeFeaturedSection
              listings={initialListings}
              sideSponsors={sponsors.side}
              feedSponsors={sponsors.feed}
              reels={reels}
              cities={[...HOME_CITIES]}
              initialCity={initialCity}
            />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}