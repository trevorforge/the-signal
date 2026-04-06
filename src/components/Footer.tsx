export function Footer({ sourceCount }: { sourceCount: number }) {
  return (
    <footer className="bg-chrome rounded-xl mt-3 px-6 py-7 text-center">
      <div className="flex items-center justify-center gap-2">
        <div className="w-1 h-5 bg-signal-orange rounded-sm" />
        <span className="font-display text-sm font-bold text-white">
          THE SIGNAL
        </span>
      </div>
      <p className="mt-3 text-[12px] text-text-muted leading-relaxed">
        Curated daily by Claude for Trevor Morse
        <br />
        Researched from {sourceCount}+ sources
      </p>
      <p className="mt-2 text-[11px] text-text-muted/60">
        Powered by Claude Code &middot; The Forge Media Group
      </p>
    </footer>
  );
}
