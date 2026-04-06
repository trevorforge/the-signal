import type { Metadata } from "next";
import Link from "next/link";
import { listBriefingDates, getBriefingByDate } from "@/lib/storage";

export const metadata: Metadata = { title: "Archive — The Signal", description: "Browse past briefings" };

export default async function ArchivePage() {
  const dates = await listBriefingDates();

  const briefings = await Promise.all(
    dates.map(async (date) => {
      const b = await getBriefingByDate(date);
      return b ? { date, storyCount: b.story_count, tldr: b.tldr.slice(0, 2) } : null;
    })
  );

  const items = briefings.filter(Boolean);

  return (
    <main className="max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] pt-10 pb-16">
      <h1 className="font-display text-4xl md:text-5xl font-bold text-text-primary tracking-tight mb-2">
        Archive
      </h1>
      <p className="text-base text-text-muted mb-10">
        Browse past briefings
      </p>

      {items.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-8 text-center">
          <p className="text-text-muted">No briefings yet.</p>
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
                className="block border border-border rounded-xl p-6 hover:border-signal-orange/30 transition-colors group bg-surface"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-xl font-bold text-text-primary group-hover:text-signal-orange transition-colors">
                    {displayDate}
                  </h2>
                  <span className="text-xs text-text-muted bg-surface-inset px-3 py-1 rounded-full">
                    {item.storyCount} stories
                  </span>
                </div>
                {item.tldr.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {item.tldr.map((bullet, i) => (
                      <li key={i} className="flex gap-3 text-sm text-text-secondary">
                        <span className="text-signal-orange shrink-0 mt-0.5">&bull;</span>
                        <span className="line-clamp-1">{bullet}</span>
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
