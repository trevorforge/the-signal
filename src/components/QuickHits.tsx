import { QuickHit } from "@/lib/types";

export function QuickHits({ items }: { items: QuickHit[] }) {
  if (!items.length) return null;

  return (
    <section className="bg-surface border border-border rounded-xl p-5 sm:p-6">
      <h2 className="font-[Georgia,serif] text-xl font-bold text-text-primary mb-4">
        Quick Hits
      </h2>
      <ul className="space-y-2.5">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex gap-2.5 text-sm pb-2.5 border-b border-border last:border-0 last:pb-0"
          >
            <span className="text-signal-orange mt-0.5 shrink-0 text-[8px]">&#x25CF;</span>
            <div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-text-primary hover:text-signal-orange transition-colors"
              >
                {item.title}
              </a>
              <span className="text-text-secondary"> &mdash; {item.description}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
