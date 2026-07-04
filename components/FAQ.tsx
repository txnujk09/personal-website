import { FAQS } from "@/lib/constants";

export function FAQ() {
  return (
    <section id="faq" className="bg-surface px-6 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Frequently asked
          </h2>
          <p className="mt-4 text-muted">
            Still unsure?{" "}
            <a
              href="#newsletter"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Get in touch
            </a>{" "}
            and I&apos;ll help you decide.
          </p>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground">
                {item.q}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  className="shrink-0 text-muted transition-transform group-open:rotate-45"
                >
                  <path
                    d="M9 4v10M4 9h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </summary>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
