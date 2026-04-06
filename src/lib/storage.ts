import { Briefing, StoryCategory, Topic, isV2Briefing } from "./types";
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
    const matches = (itemCat: StoryCategory | undefined, defaultCat?: StoryCategory) =>
      (itemCat || defaultCat || "general") === category;

    // V2: aggregate topics matching this category
    if (isV2Briefing(b) && b.topics) {
      for (const t of b.topics) {
        if ((t.category || "general") === category) {
          stories.push({
            type: "top_story",
            title: t.title,
            url: `/topic/${t.id}`,
            summary: t.summary,
            category: t.category,
            date: b.date,
          });
        }
      }
    }

    for (const s of b.top_stories) {
      if (matches(s.category)) {
        stories.push({ type: "top_story", title: s.title, url: s.url, source: s.source, summary: s.summary, category: s.category, date: b.date });
      }
    }
    for (const s of b.product_radar) {
      if (matches(s.category)) {
        stories.push({ type: "product", title: s.name, url: s.url, description: s.description, category: s.category, date: b.date });
      }
    }
    for (const s of b.creative_intel) {
      if (matches(s.category, "creative-advertising")) {
        stories.push({ type: "creative_intel", title: s.title, url: s.url, source: s.source, summary: s.summary, category: s.category, date: b.date });
      }
    }
    for (const s of b.knowledge_shelf) {
      if (matches(s.category, "rag-knowledge")) {
        stories.push({ type: "knowledge_shelf", title: s.title, url: s.url, source: s.source, summary: s.summary, category: s.category, date: b.date });
      }
    }
    for (const s of b.watch_list) {
      if (matches(s.category)) {
        stories.push({ type: "video", title: s.title, url: s.url, summary: s.summary, category: s.category, date: b.date });
      }
    }
    for (const s of b.quick_hits) {
      if (matches(s.category)) {
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
    if (isV2Briefing(b) && b.topics) {
      for (const t of b.topics) {
        const key = t.category || "general";
        counts[key] = (counts[key] || 0) + 1;
      }
    }
    const allItems = [
      ...b.top_stories.map((s) => s.category),
      ...b.product_radar.map((s) => s.category),
      ...b.creative_intel.map((s) => s.category || ("creative-advertising" as StoryCategory)),
      ...b.knowledge_shelf.map((s) => s.category || ("rag-knowledge" as StoryCategory)),
      ...b.watch_list.map((s) => s.category),
      ...b.quick_hits.map((s) => s.category),
    ];
    for (const cat of allItems) {
      const key = cat || "general";
      counts[key] = (counts[key] || 0) + 1;
    }
  }

  return counts;
}

// ═══ V2: TOPIC-BASED QUERIES ═══

export async function getTopicById(topicId: string): Promise<{ topic: Topic; briefingDate: string } | null> {
  const briefings = await getAllBriefings();
  for (const b of briefings) {
    if (isV2Briefing(b) && b.topics) {
      const topic = b.topics.find(t => t.id === topicId);
      if (topic) return { topic, briefingDate: b.date };
    }
  }
  return null;
}

export async function getAllTopics(): Promise<Array<{ topic: Topic; briefingDate: string }>> {
  const briefings = await getAllBriefings();
  const results: Array<{ topic: Topic; briefingDate: string }> = [];
  for (const b of briefings) {
    if (isV2Briefing(b) && b.topics) {
      for (const topic of b.topics) {
        results.push({ topic, briefingDate: b.date });
      }
    }
  }
  return results;
}

export async function getRelatedTopics(currentId: string, category: StoryCategory, tags: string[], limit = 4): Promise<Array<{ topic: Topic; briefingDate: string }>> {
  const all = await getAllTopics();
  return all
    .filter(({ topic }) => topic.id !== currentId)
    .map(({ topic, briefingDate }) => {
      let score = 0;
      if (topic.category === category) score += 3;
      for (const tag of topic.tags) {
        if (tags.includes(tag)) score += 1;
      }
      return { topic, briefingDate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ topic, briefingDate }) => ({ topic, briefingDate }));
}

export async function getLatestTopics(limit = 20): Promise<Array<{ topic: Topic; briefingDate: string }>> {
  const all = await getAllTopics();
  return all.slice(0, limit);
}

export async function getAllProductRadar(): Promise<Array<{ item: import("./types").ProductItem; briefingDate: string }>> {
  const briefings = await getAllBriefings();
  const results: Array<{ item: import("./types").ProductItem; briefingDate: string }> = [];
  const seen = new Set<string>();
  for (const b of briefings) {
    for (const item of b.product_radar) {
      const key = item.name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        results.push({ item, briefingDate: b.date });
      }
    }
  }
  return results;
}

export async function getAllQuickHits(): Promise<Array<{ item: import("./types").QuickHit; briefingDate: string }>> {
  const briefings = await getAllBriefings();
  const results: Array<{ item: import("./types").QuickHit; briefingDate: string }> = [];
  const seen = new Set<string>();
  for (const b of briefings) {
    for (const item of b.quick_hits) {
      if (!seen.has(item.url)) {
        seen.add(item.url);
        results.push({ item, briefingDate: b.date });
      }
    }
  }
  return results;
}

export async function getAllVideos(): Promise<Array<{ item: import("./types").VideoItem; briefingDate: string }>> {
  const briefings = await getAllBriefings();
  const results: Array<{ item: import("./types").VideoItem; briefingDate: string }> = [];
  const seen = new Set<string>();
  for (const b of briefings) {
    for (const item of b.watch_list) {
      if (!seen.has(item.url)) {
        seen.add(item.url);
        results.push({ item, briefingDate: b.date });
      }
    }
  }
  return results;
}
