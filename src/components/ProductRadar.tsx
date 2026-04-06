import { ProductItem } from "@/lib/types";

const tagStyles: Record<string, string> = {
  NEW: "bg-bull-green-bg text-bull-green",
  UPDATE: "bg-blue-500/15 text-blue-500",
  BETA: "bg-purple-500/15 text-purple-500",
  BREAKING: "bg-bear-red-bg text-bear-red",
};

const tagEmoji: Record<string, string> = {
  NEW: "\u{1F680}",
  UPDATE: "\u{1F504}",
  BETA: "\u{1F9EA}",
  BREAKING: "\u{1F525}",
};

export function ProductRadar({ items }: { items: ProductItem[] }) {
  if (!items.length) return null;

  return (
    <section className="bg-surface border border-border rounded-xl p-5 sm:p-6">
      <h2 className="font-display text-xl font-bold text-text-primary">
        Product Radar
      </h2>
      <p className="text-xs text-text-muted mt-1">New releases & updates</p>
      <div className="mt-4 space-y-3.5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="shrink-0 w-9 h-9 rounded-lg bg-surface-inset flex items-center justify-center text-base">
              {tagEmoji[item.tag] || tagEmoji.UPDATE}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-sm text-text-primary hover:text-signal-orange transition-colors"
                >
                  {item.name}
                </a>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${tagStyles[item.tag] || tagStyles.UPDATE}`}
                >
                  {item.tag}
                </span>
              </div>
              <p className="mt-0.5 text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
