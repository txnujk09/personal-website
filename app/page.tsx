import { Hero } from "@/components/Hero";
import { Newsletter } from "@/components/Newsletter";
import { ResourceGrid } from "@/components/ResourceGrid";
import { About } from "@/components/About";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <>
      <Hero />
      <Newsletter />
      <ResourceGrid />
      <About />
      <Testimonials />
    </>
  );
}
