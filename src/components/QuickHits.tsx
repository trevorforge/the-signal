import { QuickHit } from "@/lib/types";

export function QuickHits({ items }: { items: QuickHit[] }) {
  if (!items.length) return null;

  return (
    <section className="bg-surface border border-border p-6 sm:p-8">
      <h2 className="font-[Georgia,serif] text-xl font-bold text-text-primary mb-4">
        Quick Hits
      </h2>
      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 text-sm pb-3 border-b border-border last:border-0 last:pb-0"
          >
            <span className="text-signal-orange mt-0.5 shrink-0 text-xs">
              &#x25CF;
            </span>
            <div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-text-primary hover:text-signal-orange transition-colors"
              >
                {item.title}
              </a>
              <span className="text-text-secondary">
                {" "}
                &mdash; {item.description}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
