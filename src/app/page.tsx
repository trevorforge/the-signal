import { getLatestBriefing } from "@/lib/storage";
import { Header } from "@/components/Header";
import { TldrSection } from "@/components/TldrSection";
import { TopStoryCard } from "@/components/TopStoryCard";
import { ProductRadar } from "@/components/ProductRadar";
import { IntelSection } from "@/components/IntelSection";
import { WatchList } from "@/components/WatchList";
import { QuickHits } from "@/components/QuickHits";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

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

  const sourceCount =
    briefing.top_stories.length +
    briefing.product_radar.length +
    briefing.creative_intel.length +
    briefing.knowledge_shelf.length +
    briefing.watch_list.length +
    briefing.quick_hits.length;

  return (
    <main className="flex-1 flex justify-center px-4 py-6 sm:py-10">
      <div className="w-full max-w-2xl">
        <Header
          date={briefing.date}
          storyCount={briefing.story_count}
          updatedAt={briefing.updated_at}
        />

        <div className="flex flex-col">
          <TldrSection items={briefing.tldr} />

          {/* Top Stories */}
          <section className="bg-surface border-x border-b border-border p-6 sm:p-8">
            <h2 className="font-[Georgia,serif] text-xl font-bold text-text-primary mb-5">
              Top Stories
            </h2>
            <div className="space-y-5">
              {briefing.top_stories.map((story, i) => (
                <TopStoryCard key={i} story={story} />
              ))}
            </div>
          </section>

          <ProductRadar items={briefing.product_radar} />

          <IntelSection
            title="Creative Intelligence"
            subtitle="AI in advertising, campaigns & strategy"
            items={briefing.creative_intel}
            variant="creative"
          />

          <IntelSection
            title="Knowledge Shelf"
            subtitle="RAG, Obsidian & knowledge tools"
            items={briefing.knowledge_shelf}
            variant="knowledge"
          />

          <WatchList items={briefing.watch_list} />

          <QuickHits items={briefing.quick_hits} />
        </div>

        <Footer sourceCount={sourceCount} />
      </div>
    </main>
  );
}
