import { VideoItem } from "@/lib/types";

export function WatchList({ items }: { items: VideoItem[] }) {
  if (!items.length) return null;

  return (
    <section className="bg-surface border border-border p-6 sm:p-8">
      <h2 className="font-[Georgia,serif] text-xl font-bold text-text-primary">
        Watch List
      </h2>
      <p className="text-sm text-text-muted mt-1">Worth your screen time</p>
      <div className="mt-5 space-y-5">
        {items.map((item, i) => (
          <div key={i} className="flex gap-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <img
                src={`https://img.youtube.com/vi/${item.video_id}/mqdefault.jpg`}
                alt={item.title}
                width={160}
                height={90}
                className="w-32 sm:w-40 h-auto rounded-lg object-cover"
              />
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
              <p className="mt-1 text-xs text-text-muted">
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
