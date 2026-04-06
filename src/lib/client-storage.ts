"use client";

export interface StoryRef {
  date: string;
  section: string;
  index: number;
  title: string;
  url?: string;
}

const SAVED_KEY = "signal-saved-stories";
const THEME_KEY = "signal-theme";

// Saved stories
export function getSavedStories(): StoryRef[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SAVED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStory(ref: StoryRef): void {
  const saved = getSavedStories();
  if (!isStorySaved(ref)) {
    saved.push(ref);
    localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  }
}

export function removeSavedStory(ref: StoryRef): void {
  const saved = getSavedStories().filter(
    (s) => !(s.date === ref.date && s.section === ref.section && s.index === ref.index)
  );
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
}

export function isStorySaved(ref: StoryRef): boolean {
  return getSavedStories().some(
    (s) => s.date === ref.date && s.section === ref.section && s.index === ref.index
  );
}

// Theme preference
export type ThemePreference = "dark" | "light" | "system";

export function getThemePreference(): ThemePreference {
  if (typeof window === "undefined") return "dark";
  return (localStorage.getItem(THEME_KEY) as ThemePreference) || "dark";
}

export function setThemePreference(pref: ThemePreference): void {
  localStorage.setItem(THEME_KEY, pref);
  applyTheme(pref);
}

export function applyTheme(pref: ThemePreference): void {
  const isDark =
    pref === "dark" ||
    (pref === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  document.documentElement.classList.toggle("dark", isDark);
}
