import { Button } from "./Button";
import { HERO } from "@/lib/constants";

export function Hero() {
  return (
    <section className="px-6 pb-24 pt-20 lg:pb-32 lg:pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left column */}
        <div>
          <p className="mb-4 text-sm font-medium text-muted">{HERO.eyebrow}</p>

          <h1 className="text-balance text-4xl font-extrabold leading-hero tracking-tighter text-foreground sm:text-5xl lg:text-7xl">
            {HERO.title}
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            {HERO.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={HERO.primaryCta.href}>{HERO.primaryCta.label}</Button>
            <Button href={HERO.secondaryCta.href} variant="outline">
              {HERO.secondaryCta.label}
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
            {HERO.stats.map((stat) => (
              <span key={stat.label}>
                <strong className="font-semibold text-foreground">
                  {stat.value}
                </strong>{" "}
                {stat.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right column — image placeholder */}
        <div className="flex items-center justify-center lg:justify-end">
          <div className="aspect-[3/4] w-full max-w-sm rounded-2xl bg-surface" />
        </div>
      </div>
    </section>
  );
}
