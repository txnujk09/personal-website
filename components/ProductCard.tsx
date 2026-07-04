import { Button } from "./Button";

type ProductCardProps = {
  title: string;
  format: string;
  description: string;
  price: string;
  href: string;
};

export function ProductCard({
  title,
  format,
  description,
  price,
  href,
}: ProductCardProps) {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border">
      {/* Cover placeholder */}
      <div className="aspect-[16/9] w-full bg-surface" />

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

        <div className="mt-6 flex items-center justify-between">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {price}
          </span>
          <Button href={href} className="text-xs">
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
}
