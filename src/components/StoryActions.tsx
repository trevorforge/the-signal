"use client";

import { useState, useEffect } from "react";
import { type StoryRef, isStorySaved, saveStory, removeSavedStory } from "@/lib/client-storage";

interface StoryActionsProps {
  storyRef: StoryRef;
  shareUrl: string;
}

export function StoryActions({ storyRef, shareUrl }: StoryActionsProps) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSaved(isStorySaved(storyRef));
  }, [storyRef]);

  function toggleSave() {
    if (saved) {
      removeSavedStory(storyRef);
      setSaved(false);
    } else {
      saveStory(storyRef);
      setSaved(true);
    }
  }

  async function share() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-1">
      {/* Bookmark */}
      <button
        onClick={toggleSave}
        className={`p-1.5 rounded-md transition-colors ${
          saved ? "text-signal-orange" : "text-text-muted hover:text-text-secondary"
        }`}
        title={saved ? "Remove from saved" : "Save for later"}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Share */}
      <button
        onClick={share}
        className="p-1.5 rounded-md text-text-muted hover:text-text-secondary transition-colors"
        title="Copy link"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
      </button>
    </div>
  );
}
