import { getLatestBriefing, getCategoryCounts } from "@/lib/storage";
import { FeaturedStory } from "@/components/FeaturedStory";
import { StoryListItem } from "@/components/StoryListItem";
import { AnalysisPanel } from "@/components/AnalysisPanel";
import { Sidebar } from "@/components/Sidebar";
import { TopicSection } from "@/components/TopicSection";
import { ProductRadar } from "@/components/ProductRadar";

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
            No briefings yet. The first one will appear here once the daily research agent runs.
          </p>
        </div>
      </main>
    );
  }

  const categoryCounts = await getCategoryCounts();
  const heroIndex = briefing.hero_story_index ?? 0;
  const heroStory = briefing.top_stories[heroIndex];
  const otherStories = briefing.top_stories.filter((_, i) => i !== heroIndex);

  const displayDate = new Date(briefing.date + "T12:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-6">
      {/* Daily Briefing Header */}
      <h1 className="font-[Georgia,serif] text-2xl font-bold text-text-primary mb-1">
        Daily Briefing
      </h1>
      <p className="text-[13px] text-text-muted mb-5">{displayDate}</p>

      {/* Main Grid: Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Main Content */}
        <div>
          {/* Top Stories Section */}
          <section className="mb-6">
            <h2 className="font-[Georgia,serif] text-lg font-bold text-text-primary border-b-2 border-text-primary pb-1 mb-4">
              Top News Stories
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-4">
              {/* Left: Story list */}
              <div>
                {briefing.top_stories.map((story, i) => (
                  <StoryListItem
                    key={i}
                    title={story.title}
                    url={story.url}
                    source={story.source}
                    category={story.category}
                    signalScore={story.signal_score}
                    timeAgo={story.time_ago}
                    compact
                  />
                ))}

                {/* Quick hits below story list */}
                {briefing.quick_hits.slice(0, 4).map((hit, i) => (
                  <StoryListItem
                    key={`qh-${i}`}
                    title={hit.title}
                    url={hit.url}
                    category={hit.category}
                    compact
                  />
                ))}
              </div>

              {/* Right: Featured image + analysis */}
              <div className="space-y-3">
                {heroStory && <FeaturedStory story={heroStory} />}
                {heroStory && <AnalysisPanel story={heroStory} />}
              </div>
            </div>
          </section>

          {/* TL;DR */}
          <section className="border-t border-border pt-5 mb-6">
            <div className="bg-surface-inset rounded-lg p-4">
              <h2 className="text-[13px] font-bold text-text-primary mb-2.5 uppercase tracking-wider">
                TL;DR
              </h2>
              <ul className="space-y-2">
                {briefing.tldr.map((item, i) => (
                  <li key={i} className="flex gap-2.5 text-[13px] leading-relaxed text-text-secondary">
                    <span className="text-signal-orange shrink-0 text-[8px] mt-1.5">&#x25CF;</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Other Top Stories with Analysis */}
          {otherStories.length > 0 && (
            <section className="mb-6">
              {otherStories.map((story, i) => (
                <div key={i} className="border-t border-border pt-4 pb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] text-text-muted">{story.source}</span>
                        <span className="text-[11px] text-text-muted">{story.time_ago}</span>
                      </div>
                      <a
                        href={story.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <h3 className="font-[Georgia,serif] text-base font-bold text-text-primary group-hover:text-signal-orange transition-colors leading-snug">
                          {story.title}
                        </h3>
                      </a>
                      <p className="text-[13px] text-text-secondary mt-1.5 leading-relaxed">
                        {story.summary}
                      </p>
                    </div>
                    {story.image && (
                      <img
                        src={story.image}
                        alt=""
                        className="w-full sm:w-36 h-24 rounded object-cover"
                      />
                    )}
                  </div>
                  <div className="mt-3">
                    <AnalysisPanel story={story} />
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Latest Stories (Product Radar as compact list) */}
          <section className="border-t border-border pt-5 mb-6">
            <h2 className="font-[Georgia,serif] text-lg font-bold text-text-primary border-b-2 border-text-primary pb-1 mb-4">
              Latest Product Radar
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_240px] gap-4">
              <div>
                <ProductRadar items={briefing.product_radar} />
              </div>
              <div />
            </div>
          </section>

          {/* Creative Intelligence Section */}
          <TopicSection
            title="Creative Intelligence"
            slug="creative-advertising"
            items={briefing.creative_intel}
          />

          {/* Knowledge Shelf Section */}
          <TopicSection
            title="Knowledge Shelf"
            slug="rag-knowledge"
            items={briefing.knowledge_shelf}
          />

          {/* Watch List Section */}
          <TopicSection
            title="Watch List"
            slug="claude-anthropic"
            items={briefing.watch_list}
          />
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <Sidebar
              categoryCounts={categoryCounts}
              storyCount={briefing.story_count}
              date={briefing.date}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
