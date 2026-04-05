import { TopStory } from "@/lib/types";

export function TopStoryCard({ story }: { story: TopStory }) {
  return (
    <article className="bg-surface border border-border rounded-xl overflow-hidden">
      {story.image && (
        <a href={story.url} target="_blank" rel="noopener noreferrer">
          <img
            src={story.image}
            alt={story.title}
            className="w-full h-48 sm:h-56 object-cover"
          />
        </a>
      )}
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-2 py-0.5 rounded bg-muted text-[11px] font-semibold text-text-muted uppercase tracking-wide">
            {story.source}
          </span>
          <span className="text-[11px] text-text-muted">{story.time_ago}</span>
        </div>

        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <h3 className="font-[Georgia,serif] text-xl font-bold text-text-primary leading-snug group-hover:text-signal-orange transition-colors">
            {story.title}
          </h3>
        </a>

        <p className="mt-3 text-[15px] leading-relaxed text-text-secondary">
          {story.summary}
        </p>

        {/* Bull / Bear / Signal Analysis */}
        <div className="mt-5 rounded-lg bg-muted overflow-hidden divide-y divide-border">
          {/* Bull Case */}
          <div className="p-4 flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-bull-green-bg flex items-center justify-center text-xs">
              &#x2191;
            </span>
            <div>
              <span className="text-[11px] font-bold text-bull-green uppercase tracking-wide">
                Bull Case
              </span>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                {story.bull_case}
              </p>
            </div>
          </div>

          {/* Bear Case */}
          <div className="p-4 flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-bear-red-bg flex items-center justify-center text-xs">
              &#x2193;
            </span>
            <div>
              <span className="text-[11px] font-bold text-bear-red uppercase tracking-wide">
                Bear Case
              </span>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                {story.bear_case}
              </p>
            </div>
          </div>

          {/* The Signal */}
          <div className="p-4 flex gap-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-signal-bg flex items-center justify-center text-xs">
              &#x26A1;
            </span>
            <div>
              <span className="text-[11px] font-bold text-signal-orange uppercase tracking-wide">
                The Signal
              </span>
              <p className="mt-1 text-sm leading-relaxed text-text-secondary italic">
                {story.the_signal}
              </p>
            </div>
          </div>
        </div>

        <a
          href={story.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-sm font-semibold text-signal-orange hover:underline"
        >
          Read full story &#x2192;
        </a>
      </div>
    </article>
  );
}
