import { getLatestBriefing } from "@/lib/storage";
import { BriefingView } from "@/components/BriefingView";

export default async function Home() {
  const briefing = await getLatestBriefing();

  if (!briefing) {
    return (
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-2 h-10 bg-signal-orange rounded-sm mx-auto mb-4" />
          <h1 className="font-[Georgia,serif] text-2xl font-bold text-text-primary">
            THE SIGNAL
          </h1>
          <p className="mt-3 text-text-secondary">
            No briefings yet. The first one will appear here once the daily
            research agent runs.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex justify-center px-4 pb-8">
      <div className="w-full max-w-2xl">
        <BriefingView briefing={briefing} />
      </div>
    </main>
  );
}
