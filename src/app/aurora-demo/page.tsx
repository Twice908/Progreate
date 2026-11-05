import PageMotion from "@/components/motion/PageMotion";
import Hero from "./_components/Hero";
import Problem from "./_components/Problem";
import HowWeFix from "./_components/HowWeFix";
import Services from "./_components/Services";
import ClientResults from "./_components/ClientResults";
import Results from "./_components/Results";
import Process from "./_components/Process";
import Testimonials from "./_components/Testimonials";
import Pricing from "./_components/Pricing";
import Faq from "./_components/Faq";
import Tools from "./_components/Tools";

export default function AuroraDemoPage() {
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
