import { Button } from "./Button";

export function Hero() {
  return (
    <section className="px-6 pb-24 pt-20 lg:pb-32 lg:pt-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Left column */}
        <div>
          <p className="mb-4 text-sm font-medium text-muted">
            Trusted by 500+ students across A-Levels, UCAS &amp; spring weeks
          </p>

          <h1 className="text-balance text-4xl font-extrabold leading-hero tracking-tighter text-foreground sm:text-5xl lg:text-7xl">
            Get into your dream uni. Land the spring week. Build the physique.
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">
            I&apos;m Tanuj — an Imperial student, co-founder of A* AI, and I&apos;ve
            landed 6+ spring weeks. Book 1:1 mentoring or grab the exact
            playbooks I used, and skip the years of trial and error.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="#mentoring">Book mentoring</Button>
            <Button href="#store" variant="outline">
              Browse resources
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted">
            <span>
              <strong className="font-semibold text-foreground">6+</strong> spring
              weeks landed
            </span>
            <span>
              <strong className="font-semibold text-foreground">500+</strong>{" "}
              students helped
            </span>
            <span>
              <strong className="font-semibold text-foreground">Imperial</strong>{" "}
              insider
            </span>
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
