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
    <main className="flex-1 flex justify-center px-4 pb-8">
      <div className="w-full max-w-2xl">
        <div className="px-1 py-5 sm:py-7">
          <Link
            href="/topics"
            className="text-xs font-medium text-text-muted hover:text-signal-orange transition-colors"
          >
            &#x2190; All Topics
          </Link>
          <div className="flex items-center gap-3 mt-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: config.color + "20" }}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: config.color }}
              />
            </div>
            <div>
              <h1 className="font-[Georgia,serif] text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                {config.label}
              </h1>
              <p className="text-sm text-text-secondary">
                {stories.length} {stories.length === 1 ? "story" : "stories"} across all briefings
              </p>
            </div>
          </div>
        </div>

        {stories.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-text-muted">No stories in this category yet. Check back after more briefings run.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {stories.map((story, i) => {
              const storyDate = new Date(story.date + "T12:00:00").toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
              return (
                <a
                  key={i}
                  href={story.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-surface border border-border rounded-xl p-4 hover:border-signal-orange/40 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-text-primary group-hover:text-signal-orange transition-colors leading-snug">
                        {story.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-text-secondary line-clamp-2">
                        {story.summary || story.description}
                      </p>
                      {story.source && (
                        <span className="inline-block mt-2 text-[11px] text-text-muted">
                          {story.source}
                        </span>
                      )}
                    </div>
                    <span className="shrink-0 text-[11px] text-text-muted bg-surface-inset px-2 py-0.5 rounded">
                      {storyDate}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
