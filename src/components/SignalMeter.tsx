interface SignalMeterProps {
  score: number; // 0-100: 0 = hype, 100 = substance
}

export function SignalMeter({ score }: SignalMeterProps) {
  // Interpolate color: red (0) -> yellow (50) -> green (100)
  const hue = (score / 100) * 120; // 0 = red, 60 = yellow, 120 = green
  const color = `hsl(${hue}, 70%, 45%)`;

  return (
    <div className="flex items-center gap-2 text-[11px]">
      <span className="text-text-muted font-medium shrink-0">Hype</span>
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden relative">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, #ef4444 0%, #eab308 50%, #22c55e 100%)`,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 border-surface shadow-sm transition-all duration-500"
          style={{
            left: `calc(${score}% - 5px)`,
            backgroundColor: color,
          }}
        />
      </div>
      <span className="text-text-muted font-medium shrink-0">Substance</span>
    </div>
  );
}
