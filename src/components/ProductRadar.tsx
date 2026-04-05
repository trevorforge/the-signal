import { ProductItem } from "@/lib/types";

const tagStyles: Record<string, string> = {
  NEW: "bg-bull-green-bg text-bull-green",
  UPDATE: "bg-blue-100 text-blue-700",
  BETA: "bg-purple-100 text-purple-700",
  BREAKING: "bg-bear-red-bg text-bear-red",
};

export function ProductRadar({ items }: { items: ProductItem[] }) {
  if (!items.length) return null;

  return (
    <section className="bg-surface border border-border p-6 sm:p-8">
      <h2 className="font-[Georgia,serif] text-xl font-bold text-text-primary">
        Product Radar
      </h2>
      <p className="text-sm text-text-muted mt-1">New releases & updates</p>
      <div className="mt-5 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3">
            <div className="shrink-0 w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg">
              {item.tag === "NEW"
                ? "🚀"
                : item.tag === "UPDATE"
                ? "🔄"
                : item.tag === "BETA"
                ? "🧪"
                : "🔥"}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[15px] text-text-primary hover:text-signal-orange transition-colors"
                >
                  {item.name}
                </a>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${tagStyles[item.tag] || tagStyles.UPDATE}`}
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
