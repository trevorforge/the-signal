import { VideoItem } from "@/lib/types";

export function WatchList({ items }: { items: VideoItem[] }) {
  if (!items.length) return null;

  return (
    <section className="bg-surface border border-border rounded-xl p-5 sm:p-6">
      <h2 className="font-display text-xl font-bold text-text-primary">
        Watch List
      </h2>
      <p className="text-xs text-text-muted mt-1">Worth your screen time</p>
      <div className="mt-4 space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex gap-3.5">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 relative group"
            >
              <img
                src={`https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`}
                alt={item.title}
                width={144}
                height={81}
                className="w-28 sm:w-36 h-auto rounded-lg object-cover"
              />
              {/* Play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              </div>
            </a>
            <div className="min-w-0">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-sm text-text-primary leading-snug hover:text-signal-orange transition-colors line-clamp-2"
              >
                {item.title}
              </a>
              <p className="mt-1 text-[11px] text-text-muted">
                {item.channel}
                {item.duration && <> &middot; {item.duration}</>}
              </p>
              <p className="mt-1 text-sm text-text-secondary leading-relaxed line-clamp-2">
                {item.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
