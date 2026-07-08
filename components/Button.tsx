import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type Variant = "primary" | "outline";

type BaseProps = {
  variant?: Variant;
  className?: string;
  // Cal.com embed hooks — when set, the button opens the booking popup.
  "data-cal-link"?: string;
  "data-cal-config"?: string;
};

type AsButton = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };

type AsAnchor = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type ButtonProps = AsButton | AsAnchor;

const base =
  "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20";

const variants: Record<Variant, string> = {
  primary: "bg-foreground text-white hover:bg-foreground/90",
  outline:
    "border border-border text-foreground hover:bg-surface",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    const { href, ...rest } = props as AsAnchor;
    return <a href={href} className={classes} {...rest} />;
  }

  return <button className={classes} {...(props as AsButton)} />;
}
