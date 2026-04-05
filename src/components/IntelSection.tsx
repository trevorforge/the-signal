import { IntelItem } from "@/lib/types";

interface IntelSectionProps {
  title: string;
  subtitle?: string;
  items: IntelItem[];
  variant: "creative" | "knowledge";
}

export function IntelSection({ title, subtitle, items, variant }: IntelSectionProps) {
  if (!items.length) return null;

  const accent = variant === "creative"
    ? "border-cat-creative/30 text-cat-creative"
    : "border-cat-knowledge/30 text-cat-knowledge";

  return (
    <section className={`bg-surface border rounded-xl p-5 sm:p-6 ${accent}`}>
      <h2 className="font-[Georgia,serif] text-xl font-bold text-text-primary">
        {title}
      </h2>
      {subtitle && <p className="text-xs text-text-muted mt-1">{subtitle}</p>}
      <div className="mt-4 space-y-4">
        {items.map((item, i) => (
          <div key={i}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sm text-text-primary hover:text-signal-orange transition-colors"
            >
              {item.title}
            </a>
            <span className="text-[11px] text-text-muted ml-2">{item.source}</span>
            <p className="mt-1 text-sm text-text-secondary leading-relaxed">
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
