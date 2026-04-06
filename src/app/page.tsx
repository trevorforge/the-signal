import { getLatestBriefing, getCategoryCounts } from "@/lib/storage";
import { getCategoryConfig } from "@/lib/categories";
import { Sidebar } from "@/components/Sidebar";
import { SignalMeter } from "@/components/SignalMeter";
import Link from "next/link";

export default async function Home() {
  const briefing = await getLatestBriefing();

  if (!briefing) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-2 h-10 bg-signal-orange rounded-sm mx-auto mb-4" />
          <h1 className="font-[Georgia,serif] text-2xl font-bold text-text-primary">THE SIGNAL</h1>
          <p className="mt-3 text-text-secondary">No briefings yet.</p>
        </div>
      </main>
    );
  }

  const categoryCounts = await getCategoryCounts();
  const hero = briefing.top_stories[briefing.hero_story_index ?? 0];
  const secondary = briefing.top_stories.filter((_, i) => i !== (briefing.hero_story_index ?? 0));
  const displayDate = new Date(briefing.date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="max-w-6xl mx-auto px-4 pt-5 pb-10">
      {/* Page Header */}
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="font-[Georgia,serif] text-xl font-bold text-text-primary">Daily Briefing</h1>
        <span className="text-[12px] text-text-muted">{displayDate}</span>
      </div>

      {/* === TOP STORIES GRID === */}
      <section className="mb-8">
        <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-wider border-b-2 border-text-primary pb-1.5 mb-4">
          Top News Stories
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-5">
          {/* LEFT: Story list + secondary stories */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-4">
              {/* Story list column */}
              <div className="space-y-0 divide-y divide-border">
                {briefing.top_stories.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="block py-2.5 first:pt-0 group">
                    <span className="text-[10px] text-text-muted block mb-0.5">{s.source} · {s.time_ago}</span>
                    <h3 className="text-[13px] font-semibold text-text-primary leading-snug group-hover:text-signal-orange transition-colors">{s.title}</h3>
                    {s.signal_score !== undefined && (
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex gap-px">
                          {[0,1,2,3,4].map(j => (
                            <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.signal_score! >= (j+1)*20 ? 'var(--color-bull-green)' : 'var(--color-border)' }} />
                          ))}
                        </div>
                        <span className="text-[9px] text-text-muted">{s.signal_score}%</span>
                      </div>
                    )}
                  </a>
                ))}
                {/* Quick hits in same column */}
                {briefing.quick_hits.map((h, i) => (
                  <a key={`q${i}`} href={h.url} target="_blank" rel="noopener noreferrer" className="block py-2.5 group">
                    <span className="text-[10px] text-text-muted block mb-0.5">{getCategoryConfig(h.category).label}</span>
                    <h3 className="text-[13px] font-semibold text-text-primary leading-snug group-hover:text-signal-orange transition-colors">{h.title}</h3>
                  </a>
                ))}
              </div>

              {/* Featured story + more stories */}
              <div className="space-y-3">
                {/* Hero image card */}
                {hero && (
                  <a href={hero.url} target="_blank" rel="noopener noreferrer" className="block group relative rounded overflow-hidden">
                    {hero.image ? (
                      <img src={hero.image} alt={hero.title} className="w-full h-48 sm:h-56 object-cover" />
                    ) : (
                      <div className="w-full h-48 sm:h-56 bg-surface-inset" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <span className="text-[10px] font-semibold text-white/80 block mb-1">{hero.source}</span>
                      <h3 className="font-[Georgia,serif] text-base font-bold text-white leading-snug group-hover:text-signal-orange transition-colors">{hero.title}</h3>
                    </div>
                  </a>
                )}

                {/* Secondary story cards in row */}
                <div className="grid grid-cols-2 gap-2.5">
                  {secondary.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="block group">
                      {s.image && <img src={s.image} alt="" className="w-full h-24 rounded object-cover mb-1.5" />}
                      <span className="text-[10px] text-text-muted">{s.source}</span>
                      <h4 className="text-[12px] font-semibold text-text-primary leading-snug group-hover:text-signal-orange transition-colors mt-0.5">{s.title}</h4>
                    </a>
                  ))}
                  {/* Product radar cards filling the grid */}
                  {briefing.product_radar.slice(0, Math.max(0, 4 - secondary.length)).map((p, i) => (
                    <a key={`p${i}`} href={p.url} target="_blank" rel="noopener noreferrer" className="block group">
                      <div className="flex items-center gap-1 mb-1">
                        <span className={`text-[9px] font-bold uppercase px-1 py-0.5 rounded ${
                          p.tag === 'NEW' ? 'bg-bull-green-bg text-bull-green' :
                          p.tag === 'BREAKING' ? 'bg-bear-red-bg text-bear-red' :
                          'bg-blue-500/15 text-blue-500'
                        }`}>{p.tag}</span>
                      </div>
                      <h4 className="text-[12px] font-semibold text-text-primary leading-snug group-hover:text-signal-orange transition-colors">{p.name}</h4>
                      <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{p.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="hidden lg:block">
            {/* Analysis for hero */}
            {hero && (
              <div className="bg-surface border border-border rounded p-3.5 mb-4">
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2.5">Story Analysis</h3>
                {hero.signal_score !== undefined && (
                  <div className="mb-3"><SignalMeter score={hero.signal_score} /></div>
                )}
                <div className="space-y-2.5 text-[12px]">
                  <div>
                    <span className="font-bold text-bull-green text-[10px] uppercase tracking-wider">Bull Case</span>
                    <p className="text-text-secondary mt-0.5 leading-relaxed">{hero.bull_case}</p>
                  </div>
                  <div>
                    <span className="font-bold text-bear-red text-[10px] uppercase tracking-wider">Bear Case</span>
                    <p className="text-text-secondary mt-0.5 leading-relaxed">{hero.bear_case}</p>
                  </div>
                  <div>
                    <span className="font-bold text-signal-orange text-[10px] uppercase tracking-wider">The Signal</span>
                    <p className="text-text-secondary mt-0.5 leading-relaxed italic">{hero.the_signal}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TL;DR */}
            <div className="bg-surface border border-border rounded p-3.5 mb-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-2">Today&apos;s TL;DR</h3>
              <ul className="space-y-1.5">
                {briefing.tldr.map((t, i) => (
                  <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-text-secondary">
                    <span className="text-signal-orange shrink-0 text-[7px] mt-1.5">&#x25CF;</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Sidebar categoryCounts={categoryCounts} storyCount={briefing.story_count} date={briefing.date} />
          </div>
        </div>
      </section>

      {/* === REMAINING PRODUCT RADAR === */}
      {briefing.product_radar.length > 4 - secondary.length && (
        <section className="mb-8">
          <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-wider border-b-2 border-text-primary pb-1.5 mb-4">
            Product Radar
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {briefing.product_radar.slice(Math.max(0, 4 - secondary.length)).map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noopener noreferrer" className="block bg-surface border border-border rounded p-3 group hover:border-text-muted transition-colors">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    p.tag === 'NEW' ? 'bg-bull-green-bg text-bull-green' :
                    p.tag === 'BREAKING' ? 'bg-bear-red-bg text-bear-red' :
                    p.tag === 'BETA' ? 'bg-purple-500/15 text-purple-500' :
                    'bg-blue-500/15 text-blue-500'
                  }`}>{p.tag}</span>
                  {p.category && <span className="text-[9px] text-text-muted">{getCategoryConfig(p.category).label}</span>}
                </div>
                <h3 className="text-[13px] font-semibold text-text-primary group-hover:text-signal-orange transition-colors">{p.name}</h3>
                <p className="text-[11px] text-text-muted mt-1 line-clamp-2">{p.description}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* === CREATIVE INTELLIGENCE === */}
      {briefing.creative_intel.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between border-b-2 border-text-primary pb-1.5 mb-4">
            <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Creative Intelligence</h2>
            <Link href="/topics/creative-advertising" className="text-[11px] text-text-muted hover:text-text-primary border border-border rounded px-2.5 py-0.5">Read More</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {briefing.creative_intel.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block bg-surface border border-border rounded p-3.5 group hover:border-text-muted transition-colors">
                <span className="text-[10px] font-semibold text-cat-creative">{item.source}</span>
                <h3 className="text-[13px] font-semibold text-text-primary group-hover:text-signal-orange transition-colors leading-snug mt-1">{item.title}</h3>
                <p className="text-[11px] text-text-muted mt-1.5 line-clamp-3">{item.summary}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* === KNOWLEDGE SHELF === */}
      {briefing.knowledge_shelf.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between border-b-2 border-text-primary pb-1.5 mb-4">
            <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Knowledge Shelf</h2>
            <Link href="/topics/rag-knowledge" className="text-[11px] text-text-muted hover:text-text-primary border border-border rounded px-2.5 py-0.5">Read More</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {briefing.knowledge_shelf.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block bg-surface border border-border rounded p-3.5 group hover:border-text-muted transition-colors">
                <span className="text-[10px] font-semibold text-cat-knowledge">{item.source}</span>
                <h3 className="text-[13px] font-semibold text-text-primary group-hover:text-signal-orange transition-colors leading-snug mt-1">{item.title}</h3>
                <p className="text-[11px] text-text-muted mt-1.5 line-clamp-3">{item.summary}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* === WATCH LIST === */}
      {briefing.watch_list.length > 0 && (
        <section className="mb-8">
          <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-wider border-b-2 border-text-primary pb-1.5 mb-4">
            Watch List
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {briefing.watch_list.map((v, i) => (
              <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="relative rounded overflow-hidden mb-2">
                  <img src={`https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`} alt="" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="white" className="opacity-80"><polygon points="5,3 19,12 5,21" /></svg>
                  </div>
                  {v.duration && (
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">{v.duration}</span>
                  )}
                </div>
                <h3 className="text-[13px] font-semibold text-text-primary group-hover:text-signal-orange transition-colors leading-snug">{v.title}</h3>
                <p className="text-[11px] text-text-muted mt-0.5">{v.channel}</p>
                <p className="text-[11px] text-text-secondary mt-0.5 line-clamp-2">{v.summary}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* === LATEST STORIES (remaining quick hits + all products as dense list) === */}
      <section>
        <h2 className="text-[13px] font-bold text-text-primary uppercase tracking-wider border-b-2 border-text-primary pb-1.5 mb-4">
          Latest News Stories
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          <div className="divide-y divide-border">
            {[
              ...briefing.top_stories.map(s => ({ title: s.title, url: s.url, source: s.source, cat: s.category, image: s.image, score: s.signal_score })),
              ...briefing.creative_intel.map(s => ({ title: s.title, url: s.url, source: s.source, cat: s.category, image: undefined, score: s.signal_score })),
              ...briefing.knowledge_shelf.map(s => ({ title: s.title, url: s.url, source: s.source, cat: s.category, image: undefined, score: undefined })),
              ...briefing.quick_hits.map(s => ({ title: s.title, url: s.url, source: undefined, cat: s.category, image: undefined, score: undefined })),
            ].map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 py-3 group">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    {s.source && <span className="text-[10px] text-text-muted">{s.source}</span>}
                    {s.cat && <span className={`text-[10px] font-semibold ${getCategoryConfig(s.cat).textClass}`}>{getCategoryConfig(s.cat).label}</span>}
                  </div>
                  <h3 className="text-[13px] font-semibold text-text-primary leading-snug group-hover:text-signal-orange transition-colors">{s.title}</h3>
                  {s.score !== undefined && (
                    <div className="flex items-center gap-1 mt-1">
                      <div className="flex gap-px">
                        {[0,1,2,3,4].map(j => (
                          <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.score! >= (j+1)*20 ? 'var(--color-bull-green)' : 'var(--color-border)' }} />
                        ))}
                      </div>
                      <span className="text-[9px] text-text-muted">{s.score}% substance</span>
                    </div>
                  )}
                </div>
                {s.image && <img src={s.image} alt="" className="shrink-0 w-20 h-14 rounded object-cover" />}
              </a>
            ))}
          </div>
          {/* Mobile sidebar (shows below on small screens) */}
          <div className="lg:hidden">
            <Sidebar categoryCounts={categoryCounts} storyCount={briefing.story_count} date={briefing.date} />
          </div>
        </div>
      </section>
    </main>
  );
}
