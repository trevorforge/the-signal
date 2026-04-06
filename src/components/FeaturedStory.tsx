import { TopStory } from "@/lib/types";
import { getCategoryConfig } from "@/lib/categories";

export function FeaturedStory({ story }: { story: TopStory }) {
  const cat = getCategoryConfig(story.category);

  return (
    <a
      href={story.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group relative rounded-lg overflow-hidden"
    >
      {story.image ? (
        <img
          src={story.image}
          alt={story.title}
          className="w-full h-56 sm:h-72 object-cover"
        />
      ) : (
        <div className="w-full h-56 sm:h-72 bg-surface-inset" />
      )}
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      {/* Content overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
        {story.source && (
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded bg-white/20 backdrop-blur-sm text-[11px] font-semibold text-white">
              {story.source}
            </span>
            {story.category && (
              <span
                className="px-2 py-0.5 rounded text-[11px] font-semibold text-white"
                style={{ backgroundColor: cat.color + "90" }}
              >
                {cat.label}
              </span>
            )}
          </div>
        )}
        <h2 className="font-[Georgia,serif] text-lg sm:text-xl font-bold text-white leading-snug group-hover:text-signal-orange transition-colors">
          {story.title}
        </h2>
        {story.time_ago && (
          <span className="text-[11px] text-white/70 mt-1 block">{story.time_ago}</span>
        )}
      </div>
    </a>
  );
}
