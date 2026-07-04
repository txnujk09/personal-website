import { PACKAGES } from "@/lib/constants";
import { Button } from "./Button";

export function Mentoring() {
  return (
    <section id="mentoring" className="bg-surface px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 max-w-xl">
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            1:1 Mentoring
          </h2>
          <p className="mt-4 text-muted">
            Work with me directly. Pick the level of support that fits where you
            are — from a single power session to a full application cycle.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-3 lg:gap-8">
          {PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative flex flex-col rounded-2xl border p-8 ${
                pkg.highlighted
                  ? "border-foreground bg-background shadow-xl"
                  : "border-border bg-background"
              }`}
            >
              {pkg.highlighted && (
                <span className="absolute -top-3 left-8 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-white">
                  Most popular
                </span>
              )}

              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {pkg.name}
              </h3>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-4xl font-bold tracking-tight text-foreground">
                  {pkg.price}
                </span>
                <span className="text-sm text-muted">{pkg.cadence}</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted">
                {pkg.description}
              </p>

              <ul className="mt-6 flex-1 space-y-3">
                {pkg.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="mt-0.5 shrink-0 text-accent"
                    >
                      <path
                        d="M13 4L6 11.5 3 8.5"
                        stroke="currentColor"
                        strokeWidth="1.75"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                href={pkg.bookingUrl}
                variant={pkg.highlighted ? "primary" : "outline"}
                className="mt-8 w-full"
              >
                {pkg.cta}
              </Button>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted">
          Not sure which to pick?{" "}
          <a
            href="#faq"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Read the FAQ
          </a>{" "}
          or start with a Kickstarter session.
        </p>
      </div>
    </section>
  );
}
