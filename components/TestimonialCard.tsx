type TestimonialCardProps = {
  quote: string;
  name: string;
  descriptor: string;
};

export function TestimonialCard({
  quote,
  name,
  descriptor,
}: TestimonialCardProps) {
  return (
    <div className="flex flex-col rounded-xl border border-border p-6">
      <p className="flex-1 text-sm leading-relaxed text-foreground">
        &ldquo;{quote}&rdquo;
      </p>
      <div className="mt-6">
        <p className="text-sm font-medium text-foreground">{name}</p>
        <p className="text-xs text-muted">{descriptor}</p>
      </div>
    </div>
  );
}
