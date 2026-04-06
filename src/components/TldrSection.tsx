"use client";

import { useState } from "react";

interface TldrProps {
  items: string[];
}

export function TldrSection({ items }: TldrProps) {
  const [open, setOpen] = useState(true);

  return (
    <section className="bg-surface border border-border rounded-xl p-5 sm:p-6">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
        aria-expanded={open}
      >
        <span className="inline-block px-2.5 py-1 rounded text-[11px] font-bold tracking-wider uppercase bg-signal-orange/15 text-signal-orange">
          Morning Brief
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-text-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <ul className="mt-4 space-y-2.5">
            {items.map((item, i) => (
              <li key={i} className="flex gap-3 text-[15px] leading-relaxed">
                <span className="text-signal-orange mt-0.5 shrink-0 text-xs">&#x25CF;</span>
                <span className="text-text-primary">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
