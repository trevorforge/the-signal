export function Footer({ sourceCount }: { sourceCount: number }) {
  return (
    <footer className="bg-dark rounded-b-2xl px-6 py-8 text-center">
      <div className="flex items-center justify-center gap-2">
        <div className="w-1 h-5 bg-signal-orange rounded-sm" />
        <span className="font-[Georgia,serif] text-base font-bold text-white">
          THE SIGNAL
        </span>
      </div>
      <p className="mt-3 text-[13px] text-text-muted leading-relaxed">
        Curated daily by Claude for Trevor Morse
        <br />
        Researched from {sourceCount}+ sources across the AI landscape
      </p>
      <p className="mt-3 text-[11px] text-text-muted/60">
        Powered by Claude Code &middot; The Forge Media Group
      </p>
    </footer>
  );
}
