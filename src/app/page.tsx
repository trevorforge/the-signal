import { getLatestBriefing, getCategoryCounts } from "@/lib/storage";
import { getCategoryConfig } from "@/lib/categories";
import Link from "next/link";

export default async function Home() {
  const briefing = await getLatestBriefing();
  if (!briefing) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <h1 className="font-[Georgia,serif] text-2xl font-bold text-text-primary">THE SIGNAL</h1>
          <p className="mt-2 text-text-secondary text-sm">No briefings yet.</p>
        </div>
      </main>
    );
  }

  const categoryCounts = await getCategoryCounts();
  const hero = briefing.top_stories[briefing.hero_story_index ?? 0];
  const otherTopStories = briefing.top_stories.filter((_, i) => i !== (briefing.hero_story_index ?? 0));

  return (
    <main className="max-w-[1100px] mx-auto px-4 pt-4 pb-12">
      {/* ═══ DAILY BRIEFING HEADER ═══ */}
      <h1 className="font-[Georgia,serif] text-[22px] font-bold text-text-primary mb-4">Daily Briefing</h1>

      {/* ═══ TOP NEWS: 3-column grid ═══ */}
      <section className="mb-10">
        <h2 className="text-[15px] font-bold text-text-primary mb-3">Top News Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_260px] gap-x-5 gap-y-4">

          {/* COL 1: Headline list */}
          <div className="divide-y divide-border">
            {briefing.top_stories.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="block py-2 first:pt-0 group">
                <h3 className="text-[13px] font-bold text-text-primary leading-[1.35] group-hover:underline">{s.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {s.signal_score !== undefined && (
                    <div className="flex gap-[3px]">
                      {[0,1,2,3,4].map(j => (
                        <div key={j} className="w-[6px] h-[6px] rounded-full" style={{ backgroundColor: s.signal_score! >= (j+1)*20 ? 'var(--color-signal-orange)' : 'var(--color-border)' }} />
                      ))}
                    </div>
                  )}
                  <span className="text-[10px] text-text-muted">{s.source}</span>
                </div>
              </a>
            ))}
            {/* Quick hits continue the list */}
            {briefing.quick_hits.map((h, i) => (
              <a key={`q${i}`} href={h.url} target="_blank" rel="noopener noreferrer" className="block py-2 group">
                <h3 className="text-[13px] font-bold text-text-primary leading-[1.35] group-hover:underline">{h.title}</h3>
                <span className="text-[10px] text-text-muted mt-0.5 block">{getCategoryConfig(h.category).label}</span>
              </a>
            ))}
          </div>

          {/* COL 2: Featured story + secondary cards */}
          <div>
            {/* Hero image */}
            {hero && (
              <a href={hero.url} target="_blank" rel="noopener noreferrer" className="block relative rounded overflow-hidden group mb-3">
                {hero.image ? (
                  <img src={hero.image} alt="" className="w-full h-[220px] object-cover" />
                ) : (
                  <div className="w-full h-[220px] bg-surface-inset" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="font-[Georgia,serif] text-[17px] font-bold text-white leading-snug group-hover:underline">{hero.title}</h3>
                  <span className="text-[11px] text-white/70 mt-1 block">{hero.source}</span>
                </div>
              </a>
            )}
            {/* Secondary stories row */}
            <div className="grid grid-cols-2 gap-3">
              {otherTopStories.map((s, i) => (
                <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="block group">
                  {s.image && <img src={s.image} alt="" className="w-full h-[90px] object-cover rounded mb-1.5" />}
                  <h4 className="text-[12px] font-bold text-text-primary leading-[1.3] group-hover:underline">{s.title}</h4>
                  <span className="text-[10px] text-text-muted mt-0.5 block">{s.source}</span>
                </a>
              ))}
              {/* Fill remaining slots with product radar */}
              {briefing.product_radar.slice(0, Math.max(0, 4 - otherTopStories.length)).map((p, i) => (
                <a key={`pr${i}`} href={p.url} target="_blank" rel="noopener noreferrer" className="block group">
                  <span className={`text-[9px] font-bold uppercase ${p.tag === 'NEW' ? 'text-bull-green' : p.tag === 'BREAKING' ? 'text-bear-red' : 'text-text-muted'}`}>{p.tag}</span>
                  <h4 className="text-[12px] font-bold text-text-primary leading-[1.3] group-hover:underline mt-0.5">{p.name}</h4>
                  <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{p.description}</p>
                </a>
              ))}
            </div>
          </div>

          {/* COL 3: Sidebar widgets */}
          <div className="space-y-4">
            {/* Signal Analysis widget */}
            {hero && (
              <div className="border border-border rounded p-3">
                <h3 className="text-[12px] font-bold text-text-primary mb-2">Signal Analysis</h3>
                <div className="space-y-2 text-[11px]">
                  <div><span className="font-bold text-bull-green">Bull:</span> <span className="text-text-secondary">{hero.bull_case}</span></div>
                  <div><span className="font-bold text-bear-red">Bear:</span> <span className="text-text-secondary">{hero.bear_case}</span></div>
                  <div><span className="font-bold text-signal-orange">Signal:</span> <span className="text-text-secondary italic">{hero.the_signal}</span></div>
                </div>
              </div>
            )}

            {/* TL;DR widget */}
            <div className="border border-border rounded p-3">
              <h3 className="text-[12px] font-bold text-text-primary mb-2">Today&apos;s TL;DR</h3>
              <ul className="space-y-1.5">
                {briefing.tldr.map((t, i) => (
                  <li key={i} className="text-[11px] text-text-secondary leading-[1.45] flex gap-1.5">
                    <span className="text-signal-orange shrink-0">&#x2022;</span>{t}
                  </li>
                ))}
              </ul>
            </div>

            {/* Browse Topics widget */}
            <div className="border border-border rounded p-3">
              <h3 className="text-[12px] font-bold text-text-primary mb-2">Browse Topics</h3>
              <div className="space-y-1">
                {(["claude-anthropic","competitive-intel","ai-coding","design-tools","creative-advertising","rag-knowledge"] as const).map(slug => {
                  const c = getCategoryConfig(slug);
                  return (
                    <Link key={slug} href={`/topics/${slug}`} className="flex items-center justify-between py-1 group">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                        <span className="text-[11px] text-text-secondary group-hover:text-text-primary">{c.label}</span>
                      </div>
                      <span className="text-[10px] text-text-muted">{categoryCounts[slug] || 0}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CREATIVE INTELLIGENCE SECTION ═══ */}
      {briefing.creative_intel.length > 0 && (
        <section className="mb-10 border-t border-border pt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-text-primary">Creative Intelligence</h2>
            <div className="flex gap-2">
              <Link href="/topics/creative-advertising" className="text-[11px] border border-border rounded px-2.5 py-1 text-text-muted hover:text-text-primary hover:border-text-muted transition-colors">Read More</Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {briefing.creative_intel.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                <span className="text-[10px] font-semibold text-cat-creative">{item.source}</span>
                <h3 className="text-[13px] font-bold text-text-primary leading-[1.35] group-hover:underline mt-0.5">{item.title}</h3>
                <p className="text-[11px] text-text-muted mt-1 line-clamp-3 leading-[1.5]">{item.summary}</p>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ═══ LATEST STORIES ═══ */}
      <section className="mb-10 border-t border-border pt-5">
        <h2 className="text-[15px] font-bold text-text-primary mb-4">Latest Stories</h2>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
          {/* Story list */}
          <div className="divide-y divide-border">
            {briefing.product_radar.map((p, i) => (
              <a key={`pr${i}`} href={p.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-3 py-3 first:pt-0 group">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[9px] font-bold uppercase ${p.tag === 'NEW' ? 'text-bull-green' : p.tag === 'BREAKING' ? 'text-bear-red' : p.tag === 'BETA' ? 'text-purple-500' : 'text-blue-500'}`}>{p.tag}</span>
                    {p.category && <span className="text-[10px] text-text-muted">{getCategoryConfig(p.category).label}</span>}
                  </div>
                  <h3 className="text-[13px] font-bold text-text-primary leading-[1.35] group-hover:underline">{p.name}</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">{p.description}</p>
                </div>
              </a>
            ))}
            {briefing.knowledge_shelf.map((item, i) => (
              <a key={`ks${i}`} href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-start justify-between gap-3 py-3 group">
                <div className="min-w-0">
                  <span className="text-[10px] text-text-muted">{item.source}</span>
                  <h3 className="text-[13px] font-bold text-text-primary leading-[1.35] group-hover:underline">{item.title}</h3>
                  <p className="text-[11px] text-text-muted mt-0.5">{item.summary}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Similar Topics sidebar */}
          <div className="hidden lg:block">
            <h3 className="text-[13px] font-bold text-text-primary mb-3">Similar News Topics</h3>
            {(["claude-anthropic","competitive-intel","ai-agents","ai-coding","design-tools","rag-knowledge"] as const).map(slug => {
              const c = getCategoryConfig(slug);
              return (
                <Link key={slug} href={`/topics/${slug}`} className="flex items-center justify-between py-2 border-b border-border group">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded bg-surface-inset flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                    </div>
                    <span className="text-[12px] text-text-primary group-hover:underline">{c.label}</span>
                  </div>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-text-muted"><polyline points="9 18 15 12 9 6" /></svg>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ WATCH LIST SECTION ═══ */}
      {briefing.watch_list.length > 0 && (
        <section className="mb-10 border-t border-border pt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-text-primary">Watch List</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {briefing.watch_list.map((v, i) => (
              <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="relative rounded overflow-hidden mb-2">
                  <img src={`https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`} alt="" className="w-full aspect-video object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
                  </div>
                  {v.duration && <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">{v.duration}</span>}
                </div>
                <h3 className="text-[12px] font-bold text-text-primary leading-[1.3] group-hover:underline">{v.title}</h3>
                <span className="text-[10px] text-text-muted">{v.channel}</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* ═══ KNOWLEDGE SHELF SECTION ═══ */}
      {briefing.knowledge_shelf.length > 0 && (
        <section className="border-t border-border pt-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[15px] font-bold text-text-primary">Knowledge Shelf</h2>
            <Link href="/topics/rag-knowledge" className="text-[11px] border border-border rounded px-2.5 py-1 text-text-muted hover:text-text-primary hover:border-text-muted transition-colors">Read More</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {briefing.knowledge_shelf.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="block group">
                <span className="text-[10px] font-semibold text-cat-knowledge">{item.source}</span>
                <h3 className="text-[13px] font-bold text-text-primary leading-[1.35] group-hover:underline mt-0.5">{item.title}</h3>
                <p className="text-[11px] text-text-muted mt-1 leading-[1.5]">{item.summary}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
