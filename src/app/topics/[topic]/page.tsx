import { notFound } from "next/navigation";
import Link from "next/link";
import { getStoriesByCategory } from "@/lib/storage";
import { CATEGORY_CONFIG, getCategoryConfig } from "@/lib/categories";
import { StoryCategory } from "@/lib/types";

export async function generateStaticParams() {
  return (Object.keys(CATEGORY_CONFIG) as StoryCategory[]).map((topic) => ({ topic }));
}

export default async function TopicDetailPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;

  if (!(topic in CATEGORY_CONFIG)) {
    notFound();
  }

  const category = topic as StoryCategory;
  const config = getCategoryConfig(category);
  const stories = await getStoriesByCategory(category);

  return (
    <main className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] pt-10 pb-16">
      <header className="mb-10">
        <Link
          href="/topics"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-text-muted hover:text-signal-orange transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All Topics
        </Link>
        <div className="flex items-center gap-4 mt-4">
          <div
            className="w-1.5 h-12 rounded-full shrink-0"
            style={{ backgroundColor: config.color }}
          />
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-text-primary tracking-tight">
              {config.label}
            </h1>
            <p className="text-sm text-text-muted mt-1">
              {stories.length} {stories.length === 1 ? "story" : "stories"} across all briefings
            </p>
          </div>
        </div>
      </header>

      {stories.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <p className="text-text-muted text-base">No stories in this category yet. Check back after more briefings run.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {stories.map((story, i) => {
            const storyDate = new Date(story.date + "T12:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });
            const isInternal = story.url.startsWith("/");
            const cardClass = "block bg-surface border border-border rounded-xl p-5 md:p-6 hover:border-signal-orange/30 transition-colors group";
            const cardContent = (
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="font-display font-bold text-base md:text-lg text-text-primary group-hover:text-signal-orange transition-colors leading-snug">
                    {story.title}
                  </h2>
                  <p className="mt-2 text-sm text-text-secondary leading-relaxed line-clamp-2">
                    {story.summary || story.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    {story.source && (
                      <span className="text-xs text-text-muted">
                        {story.source}
                      </span>
                    )}
                    {story.source && (
                      <span className="text-text-muted/40">&middot;</span>
                    )}
                    <span className="text-xs text-text-muted">
                      {storyDate}
                    </span>
                  </div>
                </div>
                {isInternal && (
                  <span className="shrink-0 text-text-muted group-hover:text-signal-orange transition-colors mt-1">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                )}
                {!isInternal && (
                  <span className="shrink-0 text-text-muted group-hover:text-signal-orange transition-colors mt-1">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </span>
                )}
              </div>
            );
            return isInternal ? (
              <Link
                key={i}
                href={story.url}
                className={cardClass}
              >
                {cardContent}
              </Link>
            ) : (
              <a
                key={i}
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {cardContent}
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}
