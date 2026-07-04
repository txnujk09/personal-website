import { Hero } from "@/components/Hero";
import { ResourceGrid } from "@/components/ResourceGrid";
import { Mentoring } from "@/components/Mentoring";
import { Store } from "@/components/Store";
import { Testimonials } from "@/components/Testimonials";
import { About } from "@/components/About";
import { FAQ } from "@/components/FAQ";
import { Newsletter } from "@/components/Newsletter";

export default function Home() {
  return (
    <>
      <Hero />
      <ResourceGrid />
      <Mentoring />
      <Store />
      <Testimonials />
      <About />
      <FAQ />
      <Newsletter />
    </>
  );
}
