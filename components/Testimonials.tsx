import { TESTIMONIALS } from "@/lib/constants";
import { TestimonialCard } from "./TestimonialCard";

export function Testimonials() {
  return (
    <section id="testimonials" className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            What people say
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} {...t} />
          ))}
        </div>
      </div>
    </section>
  );
}
