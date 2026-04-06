import { getLatestTopics, getAllProductRadar, getAllQuickHits } from "@/lib/storage";
import { getCategoryConfig } from "@/lib/categories";
import { getImpactLabel } from "@/lib/types";
import { StoryImage, HeroImage } from "@/components/StoryImage";
import Link from "next/link";

export default async function Home() {
  const topics = await getLatestTopics(20);
  const products = await getAllProductRadar();
  const quickHits = await getAllQuickHits();

  if (topics.length === 0) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-1 h-8 bg-signal-orange rounded-sm mx-auto mb-4" />
          <h1 className="font-display text-5xl font-bold text-text-primary">THE SIGNAL</h1>
          <p className="mt-4 text-text-muted text-base leading-relaxed">
            Your daily AI intelligence briefing is being prepared. Check back soon.
          </p>
        </div>
      </main>
    );
  }

  const hero = topics[0];
  const featured = topics.slice(1, 4);
  const remaining = topics.slice(4);

  return (
    <main className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] pt-6 pb-16">

      {/* ═══ HERO STORY ═══ */}
      <section className="mb-10">
        <Link href={`/topic/${hero.topic.id}`} className="block group">
          <div className="relative rounded-xl overflow-hidden">
            <HeroImage
              src={hero.topic.image}
              alt={hero.topic.title}
              fallbackLabel={getCategoryConfig(hero.topic.category).label}
              className="w-full h-[400px] md:h-[520px] lg:h-[580px] object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-[11px] font-semibold text-white/80 uppercase tracking-wider">
                  {getCategoryConfig(hero.topic.category).label}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                  hero.topic.impact_tier === 'adopt' ? 'bg-white/15 text-emerald-300 backdrop-blur-sm' :
                  hero.topic.impact_tier === 'watch' ? 'bg-white/15 text-amber-300 backdrop-blur-sm' :
                  'bg-white/10 text-white/60 backdrop-blur-sm'
                }`}>
                  {getImpactLabel(hero.topic.impact_tier)}
                </span>
              </div>
              <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-4 max-w-4xl tracking-tight">
                {hero.topic.title}
              </h2>
              <p className="text-sm md:text-base text-white/70 leading-relaxed max-w-2xl line-clamp-2 mb-5">
                {hero.topic.summary}
              </p>
              <div className="flex items-center gap-4 text-xs text-white/50">
                <span>{hero.topic.sources.length} sources</span>
                {hero.topic.reddit_threads && hero.topic.reddit_threads.length > 0 && (
                  <span>{hero.topic.reddit_threads.length} Reddit threads</span>
                )}
                <span className="inline-flex items-center gap-1.5 text-white/70 font-medium">
                  Read article
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ═══ FEATURED GRID ═══ */}
      {featured.length > 0 && (
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {featured.map(({ topic }) => (
              <Link key={topic.id} href={`/topic/${topic.id}`} className="block group">
                <article>
                  <div className="relative rounded-lg overflow-hidden mb-4">
                    <StoryImage
                      src={topic.image}
                      alt={topic.title}
                      fallbackLabel={getCategoryConfig(topic.category).label}
                      className="w-full h-[220px] md:h-[240px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      fallbackClassName="w-full h-[220px] md:h-[240px]"
                    />
                    <span className="absolute top-3 left-3 text-[10px] font-semibold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded uppercase tracking-wider">
                      {getCategoryConfig(topic.category).label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      topic.impact_tier === 'adopt' ? 'bg-adopt-bg text-adopt' :
                      topic.impact_tier === 'watch' ? 'bg-watch-bg text-watch' :
                      'bg-ignore-bg text-ignore'
                    }`}>
                      {getImpactLabel(topic.impact_tier)}
                    </span>
                    <span className="text-xs text-text-muted">{topic.sources.length} sources</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-text-primary leading-snug group-hover:text-signal-orange transition-colors mb-2">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                    {topic.summary}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ═══ CONTENT + SIDEBAR ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12">

        {/* Main column */}
        <div>
          {remaining.length > 0 && (
            <section>
              <h2 className="font-display text-2xl font-bold text-text-primary mb-6 tracking-tight">More Coverage</h2>
              <div className="divide-y divide-border">
                {remaining.map(({ topic }) => (
                  <Link key={topic.id} href={`/topic/${topic.id}`} className="flex gap-5 py-5 first:pt-0 group">
                    <div className="shrink-0 hidden sm:block rounded-lg overflow-hidden">
                      <StoryImage
                        src={topic.image}
                        alt={topic.title}
                        fallbackLabel={getCategoryConfig(topic.category).label}
                        className="w-[160px] h-[110px] object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        fallbackClassName="w-[160px] h-[110px]"
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-medium" style={{ color: getCategoryConfig(topic.category).color }}>
                          {getCategoryConfig(topic.category).label}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          topic.impact_tier === 'adopt' ? 'bg-adopt-bg text-adopt' :
                          topic.impact_tier === 'watch' ? 'bg-watch-bg text-watch' :
                          'bg-ignore-bg text-ignore'
                        }`}>
                          {getImpactLabel(topic.impact_tier)}
                        </span>
                      </div>
                      <h3 className="font-display text-lg font-bold text-text-primary leading-snug group-hover:text-signal-orange transition-colors mb-1.5">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed line-clamp-2">
                        {topic.summary}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-20 lg:self-start">

          {/* Product Radar */}
          {products.length > 0 && (
            <div className="rounded-lg border border-border p-5 bg-surface">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">Product Radar</h3>
              <div className="space-y-4">
                {products.slice(0, 4).map(({ item }, i) => (
                  <a key={item.name} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        item.tag === 'NEW' ? 'bg-adopt-bg text-adopt' :
                        item.tag === 'BREAKING' ? 'bg-bear-red-bg text-bear-red' :
                        'bg-surface-inset text-text-muted'
                      }`}>
                        {item.tag}
                      </span>
                    </div>
                    <h4 className="text-sm font-semibold text-text-primary group-hover:text-signal-orange transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-xs text-text-muted mt-0.5 line-clamp-2">{item.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Quick Hits */}
          {quickHits.length > 0 && (
            <div className="rounded-lg border border-border p-5 bg-surface">
              <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider mb-4">Quick Hits</h3>
              <div className="space-y-4">
                {quickHits.slice(0, 5).map(({ item }) => (
                  <a key={item.url} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                    <h4 className="text-sm font-semibold text-text-primary group-hover:text-signal-orange transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
