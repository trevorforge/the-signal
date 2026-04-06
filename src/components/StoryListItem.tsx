import { getCategoryConfig } from "@/lib/categories";
import { StoryCategory } from "@/lib/types";

interface StoryListItemProps {
  title: string;
  url: string;
  source?: string;
  category?: StoryCategory;
  signalScore?: number;
  image?: string;
  timeAgo?: string;
  compact?: boolean;
}

export function StoryListItem({
  title,
  url,
  source,
  category,
  signalScore,
  image,
  timeAgo,
  compact = false,
}: StoryListItemProps) {
  const cat = getCategoryConfig(category);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-start gap-3 py-3 border-b border-border last:border-0 group"
    >
      <div className="flex-1 min-w-0">
        {source && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-medium text-text-muted">{source}</span>
            {category && (
              <span className={`text-[10px] font-semibold ${cat.textClass}`}>
                {cat.label}
              </span>
            )}
          </div>
        )}
        <h3
          className={`font-semibold text-text-primary group-hover:text-signal-orange transition-colors leading-snug ${
            compact ? "text-[13px]" : "text-sm"
          }`}
        >
          {title}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          {signalScore !== undefined && (
            <div className="flex items-center gap-1">
              <div className="flex gap-px">
                {[0, 1, 2, 3, 4].map((i) => {
                  const filled = signalScore >= (i + 1) * 20;
                  const partial = signalScore >= i * 20 && signalScore < (i + 1) * 20;
                  return (
                    <div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor: filled
                          ? "var(--color-bull-green)"
                          : partial
                          ? "var(--color-signal-orange)"
                          : "var(--color-border)",
                      }}
                    />
                  );
                })}
              </div>
              <span className="text-[10px] text-text-muted">{signalScore}% substance</span>
            </div>
          )}
          {timeAgo && (
            <span className="text-[10px] text-text-muted">{timeAgo}</span>
          )}
        </div>
      </div>
      {image && (
        <img
          src={image}
          alt=""
          className="shrink-0 w-20 h-14 sm:w-24 sm:h-16 rounded object-cover"
        />
      )}
    </a>
  );
}
