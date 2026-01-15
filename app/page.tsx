import FounderSection from "@/components/founder-section";
import Hero from "@/components/hero";
import KpiSection from "@/components/kpi-section";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <Hero />
      <KpiSection />
      <FounderSection />
    </main>
  );
}
