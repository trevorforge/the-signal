import Link from "next/link";
import { getCategoryCounts } from "@/lib/storage";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { StoryCategory } from "@/lib/types";

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
    <main className="flex-1 flex justify-center px-4 pb-8">
      <div className="w-full max-w-2xl">
        <div className="px-1 py-5 sm:py-7">
          <h1 className="font-[Georgia,serif] text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Topics
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Browse stories by category
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:gap-3">
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
              <h2 className="font-semibold text-sm text-text-primary group-hover:text-signal-orange transition-colors">
                {cat.label}
              </h2>
              <p className="text-xs text-text-muted mt-1">
                {cat.count} {cat.count === 1 ? "story" : "stories"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
