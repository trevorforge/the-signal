import { notFound } from "next/navigation";
import Link from "next/link";
import { getBriefingByDate, listBriefingDates } from "@/lib/storage";
import { BriefingView } from "@/components/BriefingView";

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

  return (
    <main className="flex-1 flex justify-center px-4 pb-8">
      <div className="w-full max-w-2xl">
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

        <BriefingView briefing={briefing} />
      </div>
    </main>
  );
}
