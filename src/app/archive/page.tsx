import type { Metadata } from "next";
import Link from "next/link";
import { listBriefingDates, getBriefingByDate } from "@/lib/storage";
import { isV2Briefing } from "@/lib/types";

export const metadata: Metadata = { title: "Archive — The Signal", description: "Browse past briefings" };

export default async function ArchivePage() {
  const dates = await listBriefingDates();

  const briefings = await Promise.all(
    dates.map(async (date) => {
      const b = await getBriefingByDate(date);
      if (!b) return null;
      return {
        date,
        storyCount: b.story_count,
        tldr: b.tldr.slice(0, 3),
        isV2: isV2Briefing(b),
        topicCount: b.topics?.length ?? 0,
      };
    })
  );

  const items = briefings.filter(Boolean);

  return (
    <main className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] pt-10 pb-16">
      <header className="mb-12">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-3">
          Archive
        </h1>
        <p className="text-base text-text-muted leading-relaxed max-w-xl">
          Browse past briefings. Each edition distills the day&apos;s most important AI, creative, and tech developments into a single intelligence report.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-12 text-center">
          <p className="text-text-muted text-base">No briefings yet. Check back after the first daily run.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            if (!item) return null;
            const displayDate = new Date(item.date + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            });
            return (
              <Link
                key={item.date}
                href={`/archive/${item.date}`}
                className="block border border-border rounded-xl p-6 md:p-8 hover:border-signal-orange/30 transition-colors group bg-surface"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-display text-xl md:text-2xl font-bold text-text-primary group-hover:text-signal-orange transition-colors">
                        {displayDate}
                      </h2>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-text-muted bg-surface-inset px-3 py-1 rounded-full">
                        {item.storyCount} stories
                      </span>
                      {item.isV2 && (
                        <span className="text-xs font-semibold text-adopt bg-adopt-bg px-3 py-1 rounded-full">
                          v2 &middot; {item.topicCount} topics
                        </span>
                      )}
                      {!item.isV2 && (
                        <span className="text-xs text-text-muted bg-surface-inset px-3 py-1 rounded-full">
                          Legacy format
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="shrink-0 text-text-muted group-hover:text-signal-orange transition-colors mt-1">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </span>
                </div>

                {item.tldr.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {item.tldr.map((bullet, i) => (
                      <li key={i} className="flex gap-3 text-sm text-text-secondary leading-relaxed">
                        <span className="text-signal-orange shrink-0 mt-0.5">&bull;</span>
                        <span className="line-clamp-2">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
