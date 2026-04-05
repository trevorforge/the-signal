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
    <header className="bg-dark text-white rounded-t-2xl px-6 py-8 sm:px-10">
      <div className="flex items-center gap-3">
        <div className="w-2 h-9 bg-signal-orange rounded-sm" />
        <h1 className="font-[Georgia,serif] text-3xl sm:text-4xl font-bold tracking-tight">
          THE SIGNAL
        </h1>
      </div>
      <p className="mt-2 text-sm tracking-wide text-text-muted uppercase">
        Daily AI Intelligence for Creative Builders
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-signal-orange/15 text-signal-orange">
          {displayDate}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-signal-teal/15 text-signal-teal">
          {storyCount} stories
        </span>
        <span className="text-xs text-text-muted ml-auto">
          Updated {updateTime}
        </span>
      </div>
    </header>
  );
}
