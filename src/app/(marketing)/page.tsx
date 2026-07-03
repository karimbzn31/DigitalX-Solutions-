import { Hero } from "@/components/landing/Hero";
import { Stats } from "@/components/landing/Stats";
import { Features } from "@/components/landing/Features";
import { ModuleZero } from "@/components/landing/ModuleZero";
import { Modules } from "@/components/landing/Modules";
import { Testimonials } from "@/components/landing/Testimonials";
import { TeamSection } from "@/components/landing/TeamSection";
import { Pricing } from "@/components/landing/Pricing";
import { FAQ } from "@/components/landing/FAQ";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Features />
      <ModuleZero />
      <Modules />
      <Testimonials />
      <TeamSection />
      <Pricing />
      <FAQ />
      <CTASection />
    </>
  );
}
