import { RESOURCES } from "@/lib/constants";
import { ResourceCard } from "./ResourceCard";

export function ResourceGrid() {
  return (
    <section id="resources" className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Resources
          </h2>
          <p className="mt-4 text-muted">
            Guides, frameworks, and real advice across the four areas I know
            best.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {RESOURCES.map((resource) => (
            <ResourceCard key={resource.title} {...resource} />
          ))}
        </div>
      </div>
    </section>
  );
}
