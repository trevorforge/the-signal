import Link from "next/link";
import { listBriefingDates, getBriefingByDate } from "@/lib/storage";

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
    <main className="flex-1 flex justify-center px-4 pb-8">
      <div className="w-full max-w-2xl">
        <div className="px-1 py-5 sm:py-7">
          <h1 className="font-[Georgia,serif] text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Archive
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Browse past briefings
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <p className="text-text-muted">No briefings yet.</p>
          </div>
        ) : (
          <div className="space-y-2">
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
                  className="block bg-surface border border-border rounded-xl p-5 hover:border-signal-orange/40 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="font-[Georgia,serif] text-lg font-bold text-text-primary group-hover:text-signal-orange transition-colors">
                      {displayDate}
                    </h2>
                    <span className="text-xs text-text-muted bg-surface-inset px-2.5 py-1 rounded-full">
                      {item.storyCount} stories
                    </span>
                  </div>
                  {item.tldr.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {item.tldr.map((bullet, i) => (
                        <li key={i} className="flex gap-2 text-sm text-text-secondary">
                          <span className="text-signal-orange shrink-0 text-[8px] mt-1.5">&#x25CF;</span>
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
      </div>
    </main>
  );
}
