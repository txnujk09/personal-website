import { Button } from "./Button";
import { ABOUT } from "@/lib/constants";

export function About() {
  return (
    <section id="about" className="px-6 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Photo placeholder */}
        <div className="aspect-[4/5] w-full max-w-md rounded-2xl bg-surface" />

        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            {ABOUT.heading}
          </h2>
          <div className="mt-6 space-y-4 text-muted leading-relaxed">
            {ABOUT.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-8">
            <Button href={ABOUT.ctaHref}>{ABOUT.ctaLabel}</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
