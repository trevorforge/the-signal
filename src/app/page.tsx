import { getLatestBriefing } from "@/lib/storage";
import { Header } from "@/components/Header";
import { TldrSection } from "@/components/TldrSection";
import { TopStoryCard } from "@/components/TopStoryCard";
import { HeroStory } from "@/components/HeroStory";
import { ProductRadar } from "@/components/ProductRadar";
import { IntelSection } from "@/components/IntelSection";
import { WatchList } from "@/components/WatchList";
import { QuickHits } from "@/components/QuickHits";
import { Footer } from "@/components/Footer";

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

  const heroIndex = briefing.hero_story_index ?? 0;
  const heroStory = briefing.top_stories[heroIndex];
  const otherStories = briefing.top_stories.filter((_, i) => i !== heroIndex);

  const sourceCount =
    briefing.top_stories.length +
    briefing.product_radar.length +
    briefing.creative_intel.length +
    briefing.knowledge_shelf.length +
    briefing.watch_list.length +
    briefing.quick_hits.length;

  return (
    <main className="flex-1 flex justify-center px-4 pb-8">
      <div className="w-full max-w-2xl">
        <Header
          date={briefing.date}
          storyCount={briefing.story_count}
          updatedAt={briefing.updated_at}
        />

        <div className="flex flex-col gap-3">
          {/* Morning Brief */}
          <TldrSection items={briefing.tldr} />

          {/* Hero Story */}
          {heroStory && (
            <HeroStory story={heroStory} briefingDate={briefing.date} />
          )}

          {/* Other Top Stories */}
          {otherStories.length > 0 && (
            <div className="space-y-3">
              {otherStories.map((story, i) => (
                <TopStoryCard
                  key={i}
                  story={story}
                  briefingDate={briefing.date}
                  storyIndex={i + (heroIndex === 0 ? 1 : 0)}
                />
              ))}
            </div>
          )}

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
