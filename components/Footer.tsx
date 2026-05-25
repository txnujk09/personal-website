import { SOCIALS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground px-6 py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 text-center">
        <a
          href="/"
          className="text-lg font-bold tracking-tight"
        >
          simplytk
        </a>

        <div className="flex gap-8">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>

        <div className="flex flex-col items-center gap-2 text-xs text-white/40">
          <a
            href="https://astarai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-white/60"
          >
            astarai.com
          </a>
          <p>&copy; {new Date().getFullYear()} Tanuj Kakumani. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
