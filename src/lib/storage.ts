import { Briefing, StoryCategory } from "./types";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data", "briefings");

function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export async function saveBriefing(briefing: Briefing): Promise<string> {
  ensureDir();
  const filename = `${briefing.date}.json`;
  const filepath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(briefing, null, 2));
  return filepath;
}

export async function getLatestBriefing(): Promise<Briefing | null> {
  ensureDir();
  const files = fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .reverse();
  if (files.length === 0) return null;
  const content = fs.readFileSync(path.join(DATA_DIR, files[0]), "utf-8");
  return JSON.parse(content);
}

export async function getBriefingByDate(date: string): Promise<Briefing | null> {
  const filepath = path.join(DATA_DIR, `${date}.json`);
  if (!fs.existsSync(filepath)) return null;
  const content = fs.readFileSync(filepath, "utf-8");
  return JSON.parse(content);
}

export async function getAllBriefings(): Promise<Briefing[]> {
  ensureDir();
  const dates = await listBriefingDates();
  const briefings: Briefing[] = [];
  for (const date of dates) {
    const b = await getBriefingByDate(date);
    if (b) briefings.push(b);
  }
  return briefings;
}

export async function listBriefingDates(): Promise<string[]> {
  ensureDir();
  return fs
    .readdirSync(DATA_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(".json", ""))
    .sort()
    .reverse();
}

interface FlatStory {
  type: "top_story" | "product" | "creative_intel" | "knowledge_shelf" | "video" | "quick_hit";
  title: string;
  url: string;
  source?: string;
  summary?: string;
  description?: string;
  category?: StoryCategory;
  date: string;
}

export async function getStoriesByCategory(category: StoryCategory): Promise<FlatStory[]> {
  const briefings = await getAllBriefings();
  const stories: FlatStory[] = [];

  for (const b of briefings) {
    for (const s of b.top_stories) {
      if (s.category === category || !s.category) {
        stories.push({ type: "top_story", title: s.title, url: s.url, source: s.source, summary: s.summary, category: s.category, date: b.date });
      }
    }
    for (const s of b.product_radar) {
      if (s.category === category) {
        stories.push({ type: "product", title: s.name, url: s.url, description: s.description, category: s.category, date: b.date });
      }
    }
    for (const s of b.creative_intel) {
      if (s.category === category || (category === "creative-advertising" && !s.category)) {
        stories.push({ type: "creative_intel", title: s.title, url: s.url, source: s.source, summary: s.summary, category: s.category, date: b.date });
      }
    }
    for (const s of b.knowledge_shelf) {
      if (s.category === category || (category === "rag-knowledge" && !s.category)) {
        stories.push({ type: "knowledge_shelf", title: s.title, url: s.url, source: s.source, summary: s.summary, category: s.category, date: b.date });
      }
    }
    for (const s of b.quick_hits) {
      if (s.category === category) {
        stories.push({ type: "quick_hit", title: s.title, url: s.url, description: s.description, category: s.category, date: b.date });
      }
    }
  }

  return stories;
}

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const briefings = await getAllBriefings();
  const counts: Record<string, number> = {};

  for (const b of briefings) {
    const allItems = [
      ...b.top_stories.map((s) => s.category),
      ...b.product_radar.map((s) => s.category),
      ...b.creative_intel.map(() => "creative-advertising" as StoryCategory),
      ...b.knowledge_shelf.map(() => "rag-knowledge" as StoryCategory),
      ...b.quick_hits.map((s) => s.category),
    ];
    for (const cat of allItems) {
      const key = cat || "general";
      counts[key] = (counts[key] || 0) + 1;
    }
  }

  return counts;
}
