import type { Metadata } from "next";
import Link from "next/link";
import { getCategoryCounts } from "@/lib/storage";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { StoryCategory } from "@/lib/types";

export const metadata: Metadata = { title: "Topics — The Signal", description: "Browse stories by category" };

const CATEGORY_DESCRIPTIONS: Record<StoryCategory, string> = {
  "claude-anthropic": "Claude, Anthropic products, and the models behind them",
  "design-tools": "Webflow, Figma, and the future of design tooling",
  "creative-advertising": "AI meets creative direction, campaigns, and brand",
  "rag-knowledge": "RAG systems, knowledge management, and AI memory",
  "competitive-intel": "OpenAI, Google, and the competitive landscape",
  "ai-coding": "AI-powered development tools and coding assistants",
  "ai-agents": "Agent frameworks, MCP, and autonomous AI systems",
  "product-launches": "New tools, features, and product announcements",
  general: "Everything else worth knowing",
};

export default async function TopicsPage() {
  const counts = await getCategoryCounts();

  const categories = (Object.keys(CATEGORY_CONFIG) as StoryCategory[])
    .map((key) => ({
      slug: key,
      ...CATEGORY_CONFIG[key],
      count: counts[key] || 0,
      description: CATEGORY_DESCRIPTIONS[key],
    }))
    .filter((cat) => cat.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <main className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] pt-10 pb-16">
      <header className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-3">
          Topics
        </h1>
        <p className="text-base text-text-muted leading-relaxed max-w-xl">
          Every story is categorized by domain. Dive into the areas that matter most to your work.
        </p>
      </header>

      {categories.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <p className="text-text-muted text-base">No stories categorized yet. Check back after the first briefing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/topics/${cat.slug}`}
              className="block bg-surface border border-border rounded-xl overflow-hidden hover:border-signal-orange/30 transition-all group"
            >
              <div className="flex h-full">
                {/* Category color accent bar */}
                <div
                  className="w-1 shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <div className="p-6 md:p-7 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="font-display text-lg md:text-xl font-bold text-text-primary group-hover:text-signal-orange transition-colors">
                        {cat.label}
                      </h2>
                      <p className="mt-2 text-sm text-text-secondary leading-relaxed">
                        {cat.description}
                      </p>
                    </div>
                    <span
                      className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full mt-1"
                      style={{
                        backgroundColor: cat.color + "14",
                        color: cat.color,
                      }}
                    >
                      {cat.count}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
