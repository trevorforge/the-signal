import Link from "next/link";
import { getCategoryConfig } from "@/lib/categories";
import { StoryCategory, IntelItem, VideoItem } from "@/lib/types";

interface TopicSectionProps {
  title: string;
  slug: StoryCategory;
  items: (IntelItem | VideoItem)[];
}

function isVideo(item: IntelItem | VideoItem): item is VideoItem {
  return "video_id" in item;
}

export function TopicSection({ title, slug, items }: TopicSectionProps) {
  if (!items.length) return null;
  const config = getCategoryConfig(slug);

  return (
    <section className="border-t border-border pt-6 pb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-[Georgia,serif] text-xl font-bold text-text-primary">
          {title}
        </h2>
        <Link
          href={`/topics/${slug}`}
          className="text-[12px] font-medium text-text-muted hover:text-text-primary border border-border rounded px-3 py-1 transition-colors"
        >
          Read More
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.slice(0, 3).map((item, i) => (
          <a
            key={i}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-surface border border-border rounded-lg overflow-hidden group hover:border-text-muted transition-colors"
          >
            {isVideo(item) && (
              <div className="relative">
                <img
                  src={`https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`}
                  alt=""
                  className="w-full h-28 object-cover"
                />
                <div className="absolute bottom-1.5 left-1.5">
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
                    style={{ backgroundColor: config.color }}
                  >
                    {config.label}
                  </span>
                </div>
              </div>
            )}
            <div className="p-3">
              {!isVideo(item) && item.source && (
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="px-1.5 py-0.5 rounded text-[10px] font-semibold text-white"
                    style={{ backgroundColor: config.color }}
                  >
                    {item.source}
                  </span>
                </div>
              )}
              <h3 className="text-[13px] font-semibold text-text-primary leading-snug group-hover:text-signal-orange transition-colors line-clamp-2">
                {isVideo(item) ? item.title : item.title}
              </h3>
              <p className="text-[11px] text-text-muted mt-1 line-clamp-2">
                {isVideo(item) ? `${item.channel} · ${item.duration || ""}` : item.summary}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
