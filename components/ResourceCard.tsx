type ResourceCardProps = {
  title: string;
  description: string;
  href: string;
};

export function ResourceCard({ title, description, href }: ResourceCardProps) {
  return (
    <a
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-border transition-colors hover:border-foreground/20"
    >
      {/* Image placeholder */}
      <div className="aspect-[16/10] w-full bg-surface transition-colors group-hover:bg-border" />

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-foreground">
          Learn more
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="transition-transform group-hover:translate-x-0.5"
          >
            <path
              d="M6 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </a>
  );
}
