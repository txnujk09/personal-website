import { Button } from "./Button";

export function Hero() {
  return (
    <section className="px-6 pb-24 pt-20 lg:pb-32 lg:pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left column */}
        <div>
          <p className="mb-4 text-sm font-medium text-muted">
            {"{SOCIAL_PROOF}"}
          </p>

          <h1 className="text-balance text-4xl font-extrabold leading-hero tracking-tighter text-foreground sm:text-5xl lg:text-7xl">
            Imperial student, 6+ spring weeks, co-founder of A* AI, helping
            achieve your dream physique
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            {"{SUBHEADLINE}"}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="#newsletter">Get mentorship</Button>
            <Button href="#resources" variant="outline">
              Free resources
            </Button>
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
