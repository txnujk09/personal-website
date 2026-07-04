import { PILLARS } from "@/lib/constants";
import { ResourceCard } from "./ResourceCard";

export function ResourceGrid() {
  return (
    <section id="help" className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            How I can help you
          </h2>
          <p className="mt-4 text-muted">
            Four areas I know inside out — because I&apos;ve recently been
            through every one of them myself.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {PILLARS.map((pillar) => (
            <ResourceCard key={pillar.title} {...pillar} />
          ))}
        </div>
      </div>
    </section>
  );
}
