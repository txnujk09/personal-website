import { Button } from "./Button";

type ProductCardProps = {
  title: string;
  format: string;
  description: string;
  price: string;
  href: string;
  comingSoon?: boolean;
};

export function ProductCard({
  title,
  format,
  description,
  price,
  href,
  comingSoon = false,
}: ProductCardProps) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-border">
      {/* Cover placeholder */}
      <div className="aspect-[16/9] w-full bg-surface" />

      {comingSoon && (
        <span className="absolute right-4 top-4 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-white">
          Coming soon
        </span>
      )}

      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {format}
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
          {description}
        </p>

        {comingSoon ? (
          <div className="mt-6">
            <span className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted">
              In the works — join the list below
            </span>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {price}
            </span>
            <Button href={href} className="text-xs">
              Buy now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
