import { Briefing } from "@/lib/types";
import { Header } from "./Header";
import { TldrSection } from "./TldrSection";
import { TopStoryCard } from "./TopStoryCard";
import { HeroStory } from "./HeroStory";
import { ProductRadar } from "./ProductRadar";
import { IntelSection } from "./IntelSection";
import { WatchList } from "./WatchList";
import { QuickHits } from "./QuickHits";
import { Footer } from "./Footer";

interface BriefingViewProps {
  briefing: Briefing;
  showHero?: boolean;
}

export function BriefingView({ briefing, showHero = true }: BriefingViewProps) {
  const heroIndex = briefing.hero_story_index ?? 0;
  const heroStory = showHero ? briefing.top_stories[heroIndex] : null;
  const otherStories = showHero
    ? briefing.top_stories.filter((_, i) => i !== heroIndex)
    : briefing.top_stories;

  const sourceCount =
    briefing.top_stories.length +
    briefing.product_radar.length +
    briefing.creative_intel.length +
    briefing.knowledge_shelf.length +
    briefing.watch_list.length +
    briefing.quick_hits.length;

  return (
    <>
      <Header
        date={briefing.date}
        storyCount={briefing.story_count}
        updatedAt={briefing.updated_at}
      />

      <div className="flex flex-col gap-3">
        <TldrSection items={briefing.tldr} />

        {heroStory && (
          <HeroStory story={heroStory} briefingDate={briefing.date} />
        )}

        {otherStories.length > 0 && (
          <div className="space-y-3">
            {otherStories.map((story, i) => (
              <TopStoryCard
                key={i}
                story={story}
                briefingDate={briefing.date}
                storyIndex={i + (showHero && heroIndex === 0 ? 1 : 0)}
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
    </>
  );
}
