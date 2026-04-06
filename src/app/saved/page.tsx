"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSavedStories, removeSavedStory, type StoryRef } from "@/lib/client-storage";

export default function SavedPage() {
  const [saved, setSaved] = useState<StoryRef[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSaved(getSavedStories());
    setLoaded(true);
  }, []);

  function handleRemove(ref: StoryRef) {
    removeSavedStory(ref);
    setSaved(getSavedStories());
  }

  function handleClearAll() {
    localStorage.removeItem("signal-saved-stories");
    setSaved([]);
  }

  if (!loaded) {
    return (
      <main className="flex-1 flex justify-center px-4 pb-8">
        <div className="w-full max-w-2xl">
          <div className="px-1 py-5 sm:py-7">
            <h1 className="font-[Georgia,serif] text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Saved
            </h1>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-5 animate-pulse">
                <div className="h-4 bg-surface-inset rounded w-3/4" />
                <div className="h-3 bg-surface-inset rounded w-1/2 mt-2" />
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex justify-center px-4 pb-8">
      <div className="w-full max-w-2xl">
        <div className="px-1 py-5 sm:py-7 flex items-end justify-between">
          <div>
            <h1 className="font-[Georgia,serif] text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Saved
            </h1>
            <p className="mt-1 text-sm text-text-secondary">
              {saved.length} {saved.length === 1 ? "story" : "stories"} saved
            </p>
          </div>
          {saved.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-text-muted hover:text-bear-red transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {saved.length === 0 ? (
          <div className="bg-surface border border-border rounded-xl p-8 text-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="mx-auto text-text-muted mb-3"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <p className="text-text-muted text-sm">No saved stories yet.</p>
            <p className="text-text-muted text-xs mt-1">
              Tap the bookmark icon on any story to save it here.
            </p>
            <Link
              href="/"
              className="inline-block mt-4 text-sm font-semibold text-signal-orange hover:underline"
            >
              Go to today&apos;s briefing
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {saved.map((ref, i) => (
              <div
                key={i}
                className="bg-surface border border-border rounded-xl p-4 flex items-start justify-between gap-3"
              >
                <div className="min-w-0">
                  <Link
                    href={`/archive/${ref.date}`}
                    className="font-semibold text-sm text-text-primary hover:text-signal-orange transition-colors leading-snug"
                  >
                    {ref.title}
                  </Link>
                  <p className="text-[11px] text-text-muted mt-1">
                    From {new Date(ref.date + "T12:00:00").toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })} &middot; {ref.section.replace("_", " ")}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(ref)}
                  className="shrink-0 p-1.5 rounded-md text-text-muted hover:text-bear-red transition-colors"
                  title="Remove"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
