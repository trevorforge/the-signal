import Link from "next/link";
import { CATEGORY_CONFIG } from "@/lib/categories";
import { StoryCategory } from "@/lib/types";

interface SidebarProps {
  categoryCounts?: Record<string, number>;
  storyCount?: number;
  date?: string;
}

const topicOrder: StoryCategory[] = [
  "claude-anthropic",
  "competitive-intel",
  "ai-coding",
  "ai-agents",
  "design-tools",
  "creative-advertising",
  "rag-knowledge",
  "product-launches",
];

export function Sidebar({ categoryCounts, storyCount, date }: SidebarProps) {
  return (
    <aside className="space-y-4">
      {/* Signal Score Widget */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="font-[Georgia,serif] text-sm font-bold text-text-primary mb-1">
          Today&apos;s Signal
        </h3>
        <p className="text-[12px] text-text-muted mb-3">
          {storyCount || 0} stories curated from 14+ searches
        </p>
        <div className="text-[11px] text-text-muted">
          {date && (
            <span>
              {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      {/* Similar Topics */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="font-[Georgia,serif] text-sm font-bold text-text-primary mb-3">
          Browse Topics
        </h3>
        <div className="space-y-0.5">
          {topicOrder.map((slug) => {
            const config = CATEGORY_CONFIG[slug];
            const count = categoryCounts?.[slug] || 0;
            return (
              <Link
                key={slug}
                href={`/topics/${slug}`}
                className="flex items-center justify-between py-2 px-2 -mx-2 rounded hover:bg-surface-inset transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center"
                    style={{ backgroundColor: config.color + "20" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                  </div>
                  <span className="text-[13px] text-text-secondary group-hover:text-text-primary transition-colors">
                    {config.label}
                  </span>
                </div>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-text-muted"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Saved / For You */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="font-[Georgia,serif] text-sm font-bold text-text-primary mb-2">
          Your Saved Stories
        </h3>
        <p className="text-[12px] text-text-muted mb-3">
          Bookmark stories to save them for later reading.
        </p>
        <Link
          href="/saved"
          className="text-[12px] font-semibold text-signal-orange hover:underline"
        >
          View saved stories &#x2192;
        </Link>
      </div>
    </aside>
  );
}
