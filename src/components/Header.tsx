interface HeaderProps {
  date: string;
  storyCount: number;
  updatedAt: string;
}

export function Header({ date, storyCount, updatedAt }: HeaderProps) {
  const displayDate = new Date(date + "T12:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric", year: "numeric" }
  );
  const updateTime = new Date(updatedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="px-1 py-5 sm:py-7">
      <h1 className="font-display text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
        {displayDate}
      </h1>
      <div className="mt-2 flex items-center gap-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold bg-signal-orange/15 text-signal-orange">
          {storyCount} stories
        </span>
        <span className="text-xs text-text-muted">
          Updated {updateTime}
        </span>
      </div>
    </div>
  );
}
