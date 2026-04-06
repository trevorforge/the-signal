import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryCounts } from "@/lib/storage";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { StoryCategory } from "@/lib/types";

export const metadata: Metadata = { title: "Topics — The Signal", description: "Browse stories by category" };

export default async function TopicsPage() {
  const counts = await getCategoryCounts();

  const categories = (Object.keys(CATEGORY_CONFIG) as StoryCategory[]).map((key) => ({
    slug: key,
    ...CATEGORY_CONFIG[key],
    count: counts[key] || 0,
  }));

  // Sort by count descending, filter out zero
  const sorted = categories.sort((a, b) => b.count - a.count);

  return (
    <main className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] pt-6 pb-16">
      <div className="mb-8">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
          Topics
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Browse stories by category
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        {sorted.map((cat) => (
          <Link
            key={cat.slug}
            href={`/topics/${cat.slug}`}
            className="bg-surface border border-border rounded-xl p-4 sm:p-5 hover:border-signal-orange/40 transition-all group"
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
              style={{ backgroundColor: cat.color + "20" }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
            </div>
            <h2 className="font-display font-semibold text-sm text-text-primary group-hover:text-signal-orange transition-colors">
              {cat.label}
            </h2>
            <p className="text-xs text-text-muted mt-1">
              {cat.count} {cat.count === 1 ? "story" : "stories"}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}
