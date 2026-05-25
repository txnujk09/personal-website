export function About() {
  return (
    <section id="about" className="bg-surface px-6 py-24 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Photo placeholder */}
        <div className="aspect-[4/5] w-full max-w-md rounded-2xl bg-border" />

        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            About Tanuj
          </h2>
          <div className="mt-6 space-y-4 text-muted leading-relaxed">
            <p>
              {"{ABOUT_PARAGRAPH_1}"}
            </p>
            <p>
              {"{ABOUT_PARAGRAPH_2}"}
            </p>
            <p>
              {"{ABOUT_PARAGRAPH_3}"}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
