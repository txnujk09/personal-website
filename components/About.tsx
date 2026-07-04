import { Button } from "./Button";

export function About() {
  return (
    <section id="about" className="px-6 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Photo placeholder */}
        <div className="aspect-[4/5] w-full max-w-md rounded-2xl bg-surface" />

        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            About Tanuj
          </h2>
          <div className="mt-6 space-y-4 text-muted leading-relaxed">
            <p>
              A few years ago I was exactly where you are — staring at a UCAS
              form, wondering how anyone actually lands a spring week, and
              trying to figure out how to train without falling behind on work.
            </p>
            <p>
              I worked it out the hard way. I got into Imperial, secured 6+
              spring weeks at top banking, tech, and consulting firms, and
              co-founded A* AI along the way — all while building a physique I&apos;m
              genuinely proud of.
            </p>
            <p>
              Now I package everything I learned into clear systems and honest
              1:1 mentoring, so you can get there faster and skip the mistakes I
              made. No gatekeeping, no fluff — just what works.
            </p>
          </div>

          <div className="mt-8">
            <Button href="#mentoring">Work with me</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
