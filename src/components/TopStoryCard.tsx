import { TopStory } from "@/lib/types";
import { getCategoryConfig } from "@/lib/categories";
import { SignalMeter } from "./SignalMeter";
import { CollapsibleAnalysis } from "./CollapsibleAnalysis";
import { StoryActions } from "./StoryActions";

interface TopStoryCardProps {
  story: TopStory;
  briefingDate: string;
  storyIndex: number;
}

export function TopStoryCard({ story, briefingDate, storyIndex }: TopStoryCardProps) {
  const cat = getCategoryConfig(story.category);

  return (
    <article className="bg-surface border border-border rounded-xl overflow-hidden transition-shadow duration-200 hover:shadow-lg">
      {story.image && (
        <a href={story.url} target="_blank" rel="noopener noreferrer">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-40 sm:h-48 object-cover"
          />
        </a>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {story.category && (
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${cat.bgClass} ${cat.textClass}`}>
                {cat.label}
              </span>
            )}
            <span className="px-2 py-0.5 rounded bg-surface-inset text-[10px] font-semibold text-text-muted uppercase tracking-wide">
              {story.source}
            </span>
            <span className="text-[10px] text-text-muted">{story.time_ago}</span>
          </div>
          <StoryActions
            storyRef={{ date: briefingDate, section: "top_stories", index: storyIndex, title: story.title, url: story.url }}
            shareUrl={story.url}
          />
        </div>

        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <h3 className="font-display text-lg font-bold text-text-primary leading-snug group-hover:text-signal-orange transition-colors">
            {story.title}
          </h3>
        </a>

        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {story.summary}
        </p>

        {story.signal_score !== undefined && (
          <div className="mt-3">
            <SignalMeter score={story.signal_score} />
          </div>
        )}

        <CollapsibleAnalysis
          bull_case={story.bull_case}
          bear_case={story.bear_case}
          the_signal={story.the_signal}
        />

        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 text-sm font-semibold text-signal-orange hover:underline"
        >
          Read full story &#x2192;
        </a>
      </div>
    </article>
  );
}
