import { getAllTopics, getTopicById, getRelatedTopics } from "@/lib/storage";
import { getCategoryConfig } from "@/lib/categories";
import { getImpactLabel } from "@/lib/types";
import { StoryImage } from "@/components/StoryImage";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const result = await getTopicById(id);
  if (!result) return { title: "Not Found — The Signal" };
  const { topic } = result;
  return {
    title: `${topic.title} — The Signal`,
    description: topic.summary,
    openGraph: {
      title: topic.title,
      description: topic.summary,
      images: topic.image ? [topic.image] : [],
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const topics = await getAllTopics();
  return topics.map(({ topic }) => ({ id: topic.id }));
}

export default async function TopicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getTopicById(id);
  if (!result) notFound();

  const { topic, briefingDate } = result;
  const catConfig = getCategoryConfig(topic.category);
  const avgApplicability = topic.sources.length > 0 ? Math.round(topic.sources.reduce((sum, s) => sum + s.applicability_score, 0) / topic.sources.length) : 0;
  const avgFactuality = topic.sources.length > 0 ? Math.round(topic.sources.reduce((sum, s) => sum + s.factuality_score, 0) / topic.sources.length) : 0;
  const related = await getRelatedTopics(topic.id, topic.category, topic.tags, 4);

  return (
    <main className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] pt-8 pb-16">

      {/* ═══ BACK NAV ═══ */}
      <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors mb-8">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
        Back to Signal
      </Link>

      {/* ═══ HERO IMAGE — FULL WIDTH ═══ */}
      {topic.image && (
        <div className="relative rounded-xl overflow-hidden mb-10 -mx-[var(--space-content-px)] max-md:-mx-[var(--space-content-px-mobile)]">
          <img src={topic.image} alt={topic.title} className="w-full h-[300px] md:h-[420px] lg:h-[500px] object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
        </div>
      )}

      {/* ═══ HEADLINE — FULL WIDTH ═══ */}
      <header className={`mb-10 ${topic.image ? '-mt-24 relative z-10' : ''}`}>
        <div className="flex items-center gap-3 mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            topic.impact_tier === 'adopt' ? 'bg-adopt-bg text-adopt' :
            topic.impact_tier === 'watch' ? 'bg-watch-bg text-watch' :
            'bg-ignore-bg text-ignore'
          }`}>
            {getImpactLabel(topic.impact_tier)}
          </span>
          <span className="text-xs text-text-muted uppercase tracking-wider" style={{ color: catConfig.color }}>
            {catConfig.label}
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-text-primary leading-[1.05] mb-6 max-w-5xl tracking-tight">
          {topic.title}
        </h1>

        <p className="text-lg text-text-secondary leading-relaxed max-w-3xl">
          {topic.summary}
        </p>

        <p className="text-sm text-text-muted mt-4">{new Date(briefingDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })} · {topic.sources.length} sources</p>
      </header>

      {/* ═══ TWO-COLUMN: ARTICLE + SIDEBAR ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 mb-16">

        {/* ── LEFT: Article ── */}
        <div>
          {topic.article && (
            <section>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-6">The Signal Take</h2>
              <div className="max-w-none">
                {topic.article.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-base md:text-lg text-text-secondary leading-[1.75] mb-5">
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* ── RIGHT: Sidebar Panels ── */}
        <aside className="space-y-5 lg:sticky lg:top-20 lg:self-start">

          {/* Key Takeaways */}
          <div className="rounded-lg border border-border p-5 bg-surface">
            <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">Key Takeaways</h3>
            <ul className="space-y-2">
              {topic.key_takeaways.map((t, i) => (
                <li key={i} className="text-sm text-text-secondary leading-relaxed flex gap-2.5">
                  <span className="text-signal-orange shrink-0 mt-0.5">&bull;</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Coverage Details */}
          <div className="rounded-lg border border-border p-5 bg-surface">
            <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">Coverage Details</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Total Sources</span>
                <span className="text-sm font-semibold text-text-primary">{topic.sources.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Avg Applicability</span>
                <span className="text-sm font-semibold text-text-primary">{avgApplicability}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Avg Factuality</span>
                <span className="text-sm font-semibold text-text-primary">{avgFactuality}</span>
              </div>
              {topic.reddit_threads && topic.reddit_threads.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-text-secondary">Reddit Threads</span>
                  <span className="text-sm font-semibold text-text-primary">{topic.reddit_threads.length}</span>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {topic.tags.length > 0 && (
            <div className="rounded-lg border border-border p-5 bg-surface">
              <h3 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider mb-3">Tags</h3>
              <div className="flex flex-wrap gap-1.5">
                {topic.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-surface-inset text-text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* ═══ SOURCES — FULL WIDTH HORIZONTAL SCROLL ═══ */}
      <section className="mb-12">
        <h2 className="font-display text-xl font-bold text-text-primary mb-5">
          {topic.sources.length} Sources
        </h2>

        <div className="flex gap-5 overflow-x-auto pb-4 -mx-1 px-1 snap-x">
          {topic.sources.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block min-w-[300px] max-w-[340px] shrink-0 snap-start group"
            >
              <div className="border border-border rounded-xl p-5 h-full hover:border-signal-orange/30 hover:shadow-sm transition-all bg-surface">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-text-primary">{source.source_name}</span>
                </div>

                <h3 className="font-display text-base font-bold text-text-primary leading-snug group-hover:text-signal-orange transition-colors mb-3">
                  {source.title}
                </h3>

                <p className="text-sm text-text-muted leading-relaxed line-clamp-3 mb-4">
                  {source.excerpt}
                </p>

                <p className="text-xs text-text-secondary italic mb-4">{source.angle}</p>

                <div className="flex items-center gap-3 pt-3 border-t border-border-subtle">
                  <div className="flex-1">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Applicability</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-inset overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${source.applicability_score}%`,
                            backgroundColor: source.applicability_score >= 80 ? 'var(--color-adopt)' :
                              source.applicability_score >= 50 ? 'var(--color-watch)' : 'var(--color-ignore)'
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-text-primary tabular-nums">{source.applicability_score}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block mb-1">Factuality</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-surface-inset overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${source.factuality_score}%`,
                            backgroundColor: source.factuality_score >= 80 ? 'var(--color-factuality-high)' :
                              source.factuality_score >= 50 ? 'var(--color-factuality-mixed)' : 'var(--color-factuality-low)'
                          }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-text-primary tabular-nums">{source.factuality_score}</span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ═══ REDDIT THREADS — FULL WIDTH ═══ */}
      {topic.reddit_threads && topic.reddit_threads.length > 0 && (
        <section className="mb-12">
          <h2 className="font-display text-xl font-bold text-text-primary mb-5">Reddit Discussions</h2>
          <div className="space-y-4">
            {topic.reddit_threads.map((thread, i) => (
              <a
                key={i}
                href={thread.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block border border-border rounded-lg p-5 hover:border-signal-orange/30 transition-colors bg-surface group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-semibold text-signal-orange">{thread.subreddit}</span>
                  <span className="text-xs text-text-muted">&uarr; {thread.score}</span>
                  <span className="text-xs text-text-muted">{thread.comment_count} comments</span>
                </div>
                <h3 className="text-base font-semibold text-text-primary group-hover:text-signal-orange transition-colors mb-2">
                  {thread.title}
                </h3>
                {thread.top_comment && (
                  <blockquote className="text-sm text-text-secondary italic border-l-2 border-signal-orange/30 pl-4 mt-3">
                    &ldquo;{thread.top_comment}&rdquo;
                  </blockquote>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ═══ RECOMMENDED ARTICLES ═══ */}
      {related.length > 0 && (
        <section className="border-t border-border pt-12">
          <h2 className="font-display text-3xl font-bold text-text-primary mb-8 tracking-tight">Recommended</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--space-card-gap)]">
            {related.map(({ topic: rel }) => (
              <Link key={rel.id} href={`/topic/${rel.id}`} className="block group">
                <article>
                  <div className="relative rounded-lg overflow-hidden mb-3">
                    <StoryImage
                      src={rel.image}
                      alt={rel.title}
                      fallbackLabel={getCategoryConfig(rel.category).label}
                      className="w-full h-[180px] object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      fallbackClassName="w-full h-[180px]"
                    />
                    <span className="absolute top-2 left-2 text-[9px] font-semibold text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded uppercase tracking-wider">
                      {getCategoryConfig(rel.category).label}
                    </span>
                  </div>
                  <h3 className="font-display text-base font-bold text-text-primary leading-snug group-hover:text-signal-orange transition-colors mb-1.5">
                    {rel.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      rel.impact_tier === 'adopt' ? 'bg-adopt-bg text-adopt' :
                      rel.impact_tier === 'watch' ? 'bg-watch-bg text-watch' :
                      'bg-ignore-bg text-ignore'
                    }`}>
                      {getImpactLabel(rel.impact_tier)}
                    </span>
                    <span className="text-xs text-text-muted">{rel.sources.length} sources</span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
