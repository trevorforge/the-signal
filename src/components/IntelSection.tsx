import { IntelItem } from "@/lib/types";

interface IntelSectionProps {
  title: string;
  subtitle?: string;
  items: IntelItem[];
  variant: "creative" | "knowledge";
}

export function IntelSection({
  title,
  subtitle,
  items,
  variant,
}: IntelSectionProps) {
  if (!items.length) return null;

  const styles =
    variant === "creative"
      ? "bg-blue-50/80 border-blue-200"
      : "bg-purple-50/80 border-purple-200";
  const accentColor =
    variant === "creative" ? "text-blue-600" : "text-purple-600";

  return (
    <section className={`border p-6 sm:p-8 ${styles}`}>
      <h2 className={`font-[Georgia,serif] text-xl font-bold ${accentColor}`}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm text-text-muted mt-1">{subtitle}</p>
      )}
      <div className="mt-5 space-y-4">
        {items.map((item, i) => (
          <div key={i}>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[15px] text-text-primary hover:text-signal-orange transition-colors"
            >
              {item.title}
            </a>
            <span className="text-xs text-text-muted ml-2">{item.source}</span>
            <p className="mt-1 text-sm text-text-secondary leading-relaxed">
              {item.summary}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
