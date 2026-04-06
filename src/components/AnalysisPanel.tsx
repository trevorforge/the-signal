import { TopStory } from "@/lib/types";
import { SignalMeter } from "./SignalMeter";

export function AnalysisPanel({ story }: { story: TopStory }) {
  return (
    <div className="bg-surface border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[13px] font-bold text-text-primary">Story Analysis</h3>
        {story.signal_score !== undefined && (
          <div className="w-32">
            <SignalMeter score={story.signal_score} />
          </div>
        )}
      </div>

      <div className="space-y-2.5">
        {/* Bull Case */}
        <div className="flex gap-2">
          <div className="shrink-0 w-4 h-4 rounded-full bg-bull-green-bg flex items-center justify-center mt-0.5">
            <span className="text-[8px] text-bull-green font-bold">&#x2191;</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-bull-green uppercase tracking-wider">Bull Case</span>
            <p className="text-[12px] text-text-secondary leading-relaxed mt-0.5">{story.bull_case}</p>
          </div>
        </div>

        {/* Bear Case */}
        <div className="flex gap-2">
          <div className="shrink-0 w-4 h-4 rounded-full bg-bear-red-bg flex items-center justify-center mt-0.5">
            <span className="text-[8px] text-bear-red font-bold">&#x2193;</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-bear-red uppercase tracking-wider">Bear Case</span>
            <p className="text-[12px] text-text-secondary leading-relaxed mt-0.5">{story.bear_case}</p>
          </div>
        </div>

        {/* The Signal */}
        <div className="flex gap-2">
          <div className="shrink-0 w-4 h-4 rounded-full bg-signal-bg flex items-center justify-center mt-0.5">
            <span className="text-[8px]">&#x26A1;</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-signal-orange uppercase tracking-wider">The Signal</span>
            <p className="text-[12px] text-text-secondary leading-relaxed mt-0.5 italic">{story.the_signal}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
