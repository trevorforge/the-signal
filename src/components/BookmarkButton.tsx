"use client";

import { useState, useEffect } from "react";
import { type StoryRef, isStorySaved, saveStory, removeSavedStory } from "@/lib/client-storage";

interface BookmarkButtonProps {
  title: string;
  date: string;
  section: string;
  index: number;
  topicId?: string;
  /** Extra classes on the outer button */
  className?: string;
  /** Icon size in px (default 14) */
  size?: number;
}

export function BookmarkButton({
  title,
  date,
  section,
  index,
  topicId,
  className = "",
  size = 14,
}: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);

  const ref: StoryRef = {
    date,
    section,
    index,
    title,
    url: topicId ? `/topic/${topicId}` : undefined,
  };

  useEffect(() => {
    setSaved(isStorySaved(ref));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, section, index]);

  function toggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeSavedStory(ref);
      setSaved(false);
    } else {
      saveStory(ref);
      setSaved(true);
    }
  }

  return (
    <button
      onClick={toggle}
      className={`p-1.5 rounded-md transition-colors ${
        saved ? "text-signal-orange" : "text-text-muted hover:text-text-secondary"
      } ${className}`}
      title={saved ? "Remove from saved" : "Save for later"}
      aria-label={saved ? "Remove bookmark" : "Bookmark this story"}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
      </svg>
    </button>
  );
}
