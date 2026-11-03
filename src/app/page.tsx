import PageMotion from "@/components/motion/PageMotion";
import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import HowWeFix from "@/components/sections/HowWeFix";
import Services from "@/components/sections/Services";
import ClientResults from "@/components/sections/ClientResults";
import Results from "@/components/sections/Results";
import Process from "@/components/sections/Process";
import Testimonials from "@/components/sections/Testimonials";
import Pricing from "@/components/sections/Pricing";
import Faq from "@/components/sections/Faq";
import Tools from "@/components/sections/Tools";

export default function Home() {
  return (
    <PageMotion>
      <Hero />
      <Problem />
      <HowWeFix />
      <Services />
      <ClientResults />
      <Results />
      <Process />
      <Testimonials />
      <Pricing />
      <Faq />
      <Tools />
    </PageMotion>
  );
}
