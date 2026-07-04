import { PRODUCTS } from "@/lib/constants";
import { ProductCard } from "./ProductCard";

export function Store() {
  return (
    <section id="store" className="px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Resources &amp; guides
          </h2>
          <p className="mt-4 text-muted">
            The exact playbooks, templates, and systems I built for myself —
            now yours to download instantly.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.title} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
