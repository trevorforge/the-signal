"use client";

import { useState } from "react";

interface CollapsibleAnalysisProps {
  bull_case: string;
  bear_case: string;
  the_signal: string;
  defaultOpen?: boolean;
}

export function CollapsibleAnalysis({ bull_case, bear_case, the_signal, defaultOpen = false }: CollapsibleAnalysisProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mt-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-xs font-semibold text-text-muted hover:text-signal-orange transition-colors"
        aria-expanded={open}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-200 ${open ? "rotate-90" : ""}`}
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        {open ? "Hide Analysis" : "View Analysis"}
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="mt-3 rounded-lg bg-surface-inset overflow-hidden divide-y divide-border">
            {/* Bull Case */}
            <div className="p-3.5 flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-bull-green-bg flex items-center justify-center text-[10px] text-bull-green font-bold">
                &#x2191;
              </span>
              <div>
                <span className="text-[10px] font-bold text-bull-green uppercase tracking-wider">
                  Bull Case
                </span>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {bull_case}
                </p>
              </div>
            </div>

            {/* Bear Case */}
            <div className="p-3.5 flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-bear-red-bg flex items-center justify-center text-[10px] text-bear-red font-bold">
                &#x2193;
              </span>
              <div>
                <span className="text-[10px] font-bold text-bear-red uppercase tracking-wider">
                  Bear Case
                </span>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary">
                  {bear_case}
                </p>
              </div>
            </div>

            {/* The Signal */}
            <div className="p-3.5 flex gap-3">
              <span className="shrink-0 w-5 h-5 rounded-full bg-signal-bg flex items-center justify-center text-[10px]">
                &#x26A1;
              </span>
              <div>
                <span className="text-[10px] font-bold text-signal-orange uppercase tracking-wider">
                  The Signal
                </span>
                <p className="mt-1 text-sm leading-relaxed text-text-secondary italic">
                  {the_signal}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
