import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { ArchitectureFlow } from "@/components/landing/ArchitectureFlow";
import { TechStackSection } from "@/components/landing/TechStackSection";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <HeroSection />
      <FeaturesGrid />
      <ArchitectureFlow />
      <TechStackSection />
      <Footer />
    </main>
  );
}
