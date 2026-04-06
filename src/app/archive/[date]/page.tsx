import { notFound } from "next/navigation";
import Link from "next/link";
import { getBriefingByDate, listBriefingDates } from "@/lib/storage";
import { BriefingView } from "@/components/BriefingView";
import { isV2Briefing, getImpactLabel } from "@/lib/types";
import { getCategoryConfig } from "@/lib/categories";

export async function generateStaticParams() {
  const dates = await listBriefingDates();
  return dates.map((date) => ({ date }));
}

export default async function ArchiveDetailPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const briefing = await getBriefingByDate(date);

  if (!briefing) {
    notFound();
  }

  // Get prev/next dates for navigation
  const allDates = await listBriefingDates();
  const currentIdx = allDates.indexOf(date);
  const newerDate = currentIdx > 0 ? allDates[currentIdx - 1] : null;
  const olderDate = currentIdx < allDates.length - 1 ? allDates[currentIdx + 1] : null;

  const v2 = isV2Briefing(briefing);
  const formattedDate = new Date(date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className={v2 ? "max-w-[1200px] mx-auto px-[var(--space-content-px)] max-md:px-[var(--space-content-px-mobile)] pt-6 pb-16" : "flex-1 flex justify-center px-4 pb-8"}>
      <div className={v2 ? "" : "w-full max-w-2xl"}>
        {/* Date navigation */}
        <div className="flex items-center justify-between py-3 px-1">
          {olderDate ? (
            <Link
              href={`/archive/${olderDate}`}
              className="text-xs font-medium text-text-muted hover:text-signal-orange transition-colors"
            >
              &#x2190; Older
            </Link>
          ) : (
            <span />
          )}
          <Link
            href="/archive"
            className="text-xs font-medium text-text-muted hover:text-signal-orange transition-colors"
          >
            All Briefings
          </Link>
          {newerDate ? (
            <Link
              href={`/archive/${newerDate}`}
              className="text-xs font-medium text-text-muted hover:text-signal-orange transition-colors"
            >
              Newer &#x2192;
            </Link>
          ) : (
            <span />
          )}
        </div>

        {v2 && briefing.topics ? (
          <>
            <div className="mb-8">
              <h1 className="font-display text-3xl sm:text-4xl font-bold text-text-primary tracking-tight">
                {formattedDate}
              </h1>
              {briefing.tldr && briefing.tldr.length > 0 && (
                <ul className="mt-3 space-y-1">
                  {briefing.tldr.map((line, i) => (
                    <li key={i} className="text-sm text-text-secondary flex gap-2">
                      <span className="text-signal-orange shrink-0">&#x2022;</span>
                      {line}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--space-card-gap)]">
              {briefing.topics.map((topic) => (
                <Link key={topic.id} href={`/topic/${topic.id}`} className="block group">
                  <article className="bg-surface border border-border rounded-xl overflow-hidden hover:border-signal-orange/40 transition-colors">
                    {topic.image && (
                      <div className="relative overflow-hidden">
                        <img
                          src={topic.image}
                          alt=""
                          className="w-full h-[180px] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />
                        <span className="absolute top-3 left-3 text-[10px] font-semibold text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded uppercase tracking-wider">
                          {getCategoryConfig(topic.category).label}
                        </span>
                      </div>
                    )}
                    <div className="p-4">
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
                      <h3 className="font-display text-lg font-bold text-text-primary leading-snug group-hover:text-signal-orange transition-colors mb-2">
                        {topic.title}
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                        {topic.summary}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <BriefingView briefing={briefing} />
        )}
      </div>
    </main>
  );
}
