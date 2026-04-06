import { Briefing, StoryCategory, Topic, ProductItem, QuickHit, VideoItem, isV2Briefing } from "./types";
import { supabase, isSupabaseBackend } from "./supabase";

// ═══ FILESYSTEM BACKEND (legacy) ═══

let fs: typeof import("fs") | null = null;
let path: typeof import("path") | null = null;

function getFsModules() {
  if (!fs) fs = require("fs");
  if (!path) path = require("path");
  return { fs: fs!, path: path! };
}

function getDataDir() {
  const { path: p } = getFsModules();
  return p.join(process.cwd(), "src", "data", "briefings");
}

function ensureDir() {
  const { fs: f } = getFsModules();
  const dir = getDataDir();
  if (!f.existsSync(dir)) f.mkdirSync(dir, { recursive: true });
}

// ═══ SHARED TYPES ═══

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

// ═══ SAVE BRIEFING ═══

export async function saveBriefing(briefing: Briefing): Promise<string> {
  if (isSupabaseBackend()) {
    return saveBriefingSupabase(briefing);
  }
  ensureDir();
  const { fs: f, path: p } = getFsModules();
  const filepath = p.join(getDataDir(), `${briefing.date}.json`);
  f.writeFileSync(filepath, JSON.stringify(briefing, null, 2));
  return filepath;
}

async function saveBriefingSupabase(briefing: Briefing): Promise<string> {
  const { getServiceClient } = await import("./supabase");
  const db = getServiceClient();

  // Upsert briefing
  const { data: briefingRow, error: bErr } = await db
    .from("briefings")
    .upsert({
      date: briefing.date,
      updated_at: briefing.updated_at,
      version: briefing.version ?? 2,
      story_count: briefing.story_count,
      tldr: briefing.tldr,
      stats: briefing.stats ?? null,
      legacy_v1_data: briefing.top_stories.length > 0 ? {
        top_stories: briefing.top_stories,
        creative_intel: briefing.creative_intel,
        knowledge_shelf: briefing.knowledge_shelf,
        hero_story_index: briefing.hero_story_index,
      } : null,
    }, { onConflict: "date" })
    .select("id")
    .single();

  if (bErr) throw new Error(`Failed to save briefing: ${bErr.message}`);
  const briefingId = briefingRow.id;

  // Delete existing child rows for this briefing (for upsert behavior)
  await db.from("topics").delete().eq("briefing_id", briefingId);
  await db.from("product_radar").delete().eq("briefing_id", briefingId);
  await db.from("quick_hits").delete().eq("briefing_id", briefingId);
  await db.from("watch_list").delete().eq("briefing_id", briefingId);

  // Insert topics + sources + reddit threads
  if (briefing.topics) {
    for (const topic of briefing.topics) {
      const { data: topicRow, error: tErr } = await db
        .from("topics")
        .insert({
          briefing_id: briefingId,
          slug: topic.id,
          title: topic.title,
          summary: topic.summary,
          article: topic.article ?? null,
          key_takeaways: topic.key_takeaways,
          impact_tier: topic.impact_tier,
          category: topic.category,
          signal_score: topic.signal_score,
          image_url: topic.image ?? null,
          tags: topic.tags,
        })
        .select("id")
        .single();

      if (tErr) { console.error(`Failed to save topic ${topic.id}: ${tErr.message}`); continue; }

      // Sources
      if (topic.sources.length > 0) {
        await db.from("sources").insert(
          topic.sources.map(s => ({
            topic_id: topicRow.id,
            title: s.title,
            url: s.url,
            source_name: s.source_name,
            source_logo: s.source_logo ?? null,
            image_url: s.image ?? null,
            excerpt: s.excerpt,
            applicability_score: s.applicability_score,
            factuality_score: s.factuality_score,
            angle: s.angle,
          }))
        );
      }

      // Reddit threads
      if (topic.reddit_threads && topic.reddit_threads.length > 0) {
        await db.from("reddit_threads").insert(
          topic.reddit_threads.map(r => ({
            topic_id: topicRow.id,
            title: r.title,
            url: r.url,
            subreddit: r.subreddit,
            score: r.score,
            comment_count: r.comment_count,
            top_comment: r.top_comment ?? null,
          }))
        );
      }
    }
  }

  // Product radar
  if (briefing.product_radar.length > 0) {
    await db.from("product_radar").upsert(
      briefing.product_radar.map(p => ({
        briefing_id: briefingId,
        name: p.name,
        url: p.url,
        description: p.description,
        tag: p.tag,
        category: p.category ?? null,
        tags: p.tags ?? [],
      })),
      { onConflict: "url", ignoreDuplicates: true }
    );
  }

  // Quick hits
  if (briefing.quick_hits.length > 0) {
    await db.from("quick_hits").upsert(
      briefing.quick_hits.map(q => ({
        briefing_id: briefingId,
        title: q.title,
        url: q.url,
        description: q.description,
        category: q.category ?? null,
        tags: q.tags ?? [],
      })),
      { onConflict: "url", ignoreDuplicates: true }
    );
  }

  // Watch list
  if (briefing.watch_list.length > 0) {
    await db.from("watch_list").upsert(
      briefing.watch_list.map(v => ({
        briefing_id: briefingId,
        title: v.title,
        url: v.url,
        video_id: v.video_id,
        channel: v.channel,
        duration: v.duration ?? null,
        summary: v.summary,
        category: v.category ?? null,
        tags: v.tags ?? [],
      })),
      { onConflict: "url", ignoreDuplicates: true }
    );
  }

  return briefingId;
}

// ═══ READ FUNCTIONS ═══

export async function getLatestBriefing(): Promise<Briefing | null> {
  if (isSupabaseBackend()) {
    const { data } = await supabase.from("briefings").select("date").order("date", { ascending: false }).limit(1).single();
    if (!data) return null;
    return getBriefingByDate(data.date);
  }
  ensureDir();
  const { fs: f, path: p } = getFsModules();
  const files = f.readdirSync(getDataDir()).filter(f => f.endsWith(".json")).sort().reverse();
  if (files.length === 0) return null;
  return JSON.parse(f.readFileSync(p.join(getDataDir(), files[0]), "utf-8"));
}

export async function getBriefingByDate(date: string): Promise<Briefing | null> {
  if (isSupabaseBackend()) {
    const { data } = await supabase.from("briefings").select("*").eq("date", date).single();
    if (!data) return null;
    // Reconstruct Briefing from DB
    return reconstructBriefing(data);
  }
  const { fs: f, path: p } = getFsModules();
  const filepath = p.join(getDataDir(), `${date}.json`);
  if (!f.existsSync(filepath)) return null;
  return JSON.parse(f.readFileSync(filepath, "utf-8"));
}

async function reconstructBriefing(briefingRow: Record<string, unknown>): Promise<Briefing> {
  const { data: topics } = await supabase
    .from("topics")
    .select("*, sources(*), reddit_threads(*)")
    .eq("briefing_id", briefingRow.id)
    .order("signal_score", { ascending: false });

  const { data: products } = await supabase
    .from("product_radar")
    .select("*")
    .eq("briefing_id", briefingRow.id);

  const { data: quickHits } = await supabase
    .from("quick_hits")
    .select("*")
    .eq("briefing_id", briefingRow.id);

  const { data: videos } = await supabase
    .from("watch_list")
    .select("*")
    .eq("briefing_id", briefingRow.id);

  const legacy = briefingRow.legacy_v1_data as Record<string, unknown> | null;

  return {
    date: briefingRow.date as string,
    updated_at: briefingRow.updated_at as string,
    version: (briefingRow.version as number) === 2 ? 2 : undefined,
    story_count: briefingRow.story_count as number,
    tldr: briefingRow.tldr as string[],
    stats: briefingRow.stats as Briefing["stats"],
    topics: (topics ?? []).map(t => ({
      id: t.slug,
      title: t.title,
      summary: t.summary,
      article: t.article ?? undefined,
      key_takeaways: t.key_takeaways ?? [],
      impact_tier: t.impact_tier as Topic["impact_tier"],
      category: t.category as StoryCategory,
      signal_score: t.signal_score,
      image: t.image_url ?? undefined,
      tags: t.tags ?? [],
      sources: (t.sources ?? []).map((s: Record<string, unknown>) => ({
        title: s.title as string,
        url: s.url as string,
        source_name: s.source_name as string,
        source_logo: s.source_logo as string | undefined,
        image: s.image_url as string | undefined,
        published_at: s.published_at as string | undefined,
        excerpt: s.excerpt as string,
        applicability_score: s.applicability_score as number,
        factuality_score: s.factuality_score as number,
        angle: s.angle as string,
      })),
      reddit_threads: (t.reddit_threads ?? []).map((r: Record<string, unknown>) => ({
        title: r.title as string,
        url: r.url as string,
        subreddit: r.subreddit as string,
        score: r.score as number,
        comment_count: r.comment_count as number,
        top_comment: r.top_comment as string | undefined,
      })),
    })),
    top_stories: legacy?.top_stories as Briefing["top_stories"] ?? [],
    product_radar: (products ?? []).map(p => ({
      name: p.name,
      url: p.url,
      description: p.description,
      tag: p.tag as ProductItem["tag"],
      category: p.category as StoryCategory | undefined,
      tags: p.tags ?? [],
    })),
    creative_intel: legacy?.creative_intel as Briefing["creative_intel"] ?? [],
    knowledge_shelf: legacy?.knowledge_shelf as Briefing["knowledge_shelf"] ?? [],
    watch_list: (videos ?? []).map(v => ({
      title: v.title,
      url: v.url,
      video_id: v.video_id,
      channel: v.channel,
      duration: v.duration ?? undefined,
      summary: v.summary,
      category: v.category as StoryCategory | undefined,
      tags: v.tags ?? [],
    })),
    quick_hits: (quickHits ?? []).map(q => ({
      title: q.title,
      url: q.url,
      description: q.description,
      category: q.category as StoryCategory | undefined,
      tags: q.tags ?? [],
    })),
    hero_story_index: legacy?.hero_story_index as number ?? 0,
  };
}

export async function getAllBriefings(): Promise<Briefing[]> {
  if (isSupabaseBackend()) {
    const { data } = await supabase.from("briefings").select("date").order("date", { ascending: false });
    if (!data) return [];
    const results: Briefing[] = [];
    for (const row of data) {
      const b = await getBriefingByDate(row.date);
      if (b) results.push(b);
    }
    return results;
  }
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
  if (isSupabaseBackend()) {
    const { data } = await supabase.from("briefings").select("date").order("date", { ascending: false });
    return (data ?? []).map(r => r.date);
  }
  ensureDir();
  const { fs: f } = getFsModules();
  return f.readdirSync(getDataDir()).filter(f => f.endsWith(".json")).map(f => f.replace(".json", "")).sort().reverse();
}

// ═══ TOPIC QUERIES ═══

export async function getTopicById(topicId: string): Promise<{ topic: Topic; briefingDate: string } | null> {
  if (isSupabaseBackend()) {
    const { data } = await supabase
      .from("topics")
      .select("*, sources(*), reddit_threads(*), briefings!inner(date)")
      .eq("slug", topicId)
      .single();
    if (!data) return null;
    return {
      topic: dbTopicToTopic(data),
      briefingDate: (data.briefings as Record<string, string>).date,
    };
  }
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
  if (isSupabaseBackend()) {
    const { data } = await supabase
      .from("topics")
      .select("*, sources(*), reddit_threads(*), briefings!inner(date)")
      .order("published_at", { ascending: false });
    return (data ?? []).map(t => ({
      topic: dbTopicToTopic(t),
      briefingDate: ((t.briefings as unknown as { date: string }) ).date,
    }));
  }
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
  if (isSupabaseBackend()) {
    const { data } = await supabase
      .from("topics")
      .select("*, sources(*), reddit_threads(*), briefings!inner(date)")
      .neq("slug", currentId)
      .or(`category.eq.${category},tags.ov.{${tags.join(",")}}`)
      .order("published_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map(t => ({
      topic: dbTopicToTopic(t),
      briefingDate: ((t.briefings as unknown as { date: string }) ).date,
    }));
  }
  const all = await getAllTopics();
  return all
    .filter(({ topic }) => topic.id !== currentId)
    .map(({ topic, briefingDate }) => {
      let score = 0;
      if (topic.category === category) score += 3;
      for (const tag of topic.tags) { if (tags.includes(tag)) score += 1; }
      return { topic, briefingDate, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ topic, briefingDate }) => ({ topic, briefingDate }));
}

export async function getLatestTopics(limit = 20): Promise<Array<{ topic: Topic; briefingDate: string }>> {
  if (isSupabaseBackend()) {
    const { data } = await supabase
      .from("topics")
      .select("*, sources(*), reddit_threads(*), briefings!inner(date)")
      .order("published_at", { ascending: false })
      .limit(limit);
    return (data ?? []).map(t => ({
      topic: dbTopicToTopic(t),
      briefingDate: ((t.briefings as unknown as { date: string }) ).date,
    }));
  }
  const all = await getAllTopics();
  return all.slice(0, limit);
}

// ═══ SIDEBAR QUERIES ═══

export async function getCategoryCounts(): Promise<Record<string, number>> {
  if (isSupabaseBackend()) {
    const { data } = await supabase.from("topics").select("category");
    const counts: Record<string, number> = {};
    for (const row of data ?? []) {
      const key = row.category || "general";
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }
  const briefings = await getAllBriefings();
  const counts: Record<string, number> = {};
  for (const b of briefings) {
    if (isV2Briefing(b) && b.topics) {
      for (const t of b.topics) { counts[t.category || "general"] = (counts[t.category || "general"] || 0) + 1; }
    }
    for (const cat of [...b.top_stories.map(s => s.category), ...b.product_radar.map(s => s.category), ...b.quick_hits.map(s => s.category)]) {
      const key = cat || "general";
      counts[key] = (counts[key] || 0) + 1;
    }
  }
  return counts;
}

export async function getStoriesByCategory(category: StoryCategory): Promise<FlatStory[]> {
  if (isSupabaseBackend()) {
    const { data: topics } = await supabase
      .from("topics")
      .select("slug, title, summary, category, briefings!inner(date)")
      .eq("category", category)
      .order("published_at", { ascending: false });
    return (topics ?? []).map(t => ({
      type: "top_story" as const,
      title: t.title,
      url: `/topic/${t.slug}`,
      summary: t.summary,
      category: t.category as StoryCategory,
      date: ((t.briefings as unknown as { date: string }) ).date,
    }));
  }
  // Filesystem fallback (existing code)
  const briefings = await getAllBriefings();
  const stories: FlatStory[] = [];
  for (const b of briefings) {
    const matches = (itemCat: StoryCategory | undefined, defaultCat?: StoryCategory) =>
      (itemCat || defaultCat || "general") === category;
    if (isV2Briefing(b) && b.topics) {
      for (const t of b.topics) {
        if ((t.category || "general") === category) {
          stories.push({ type: "top_story", title: t.title, url: `/topic/${t.id}`, summary: t.summary, category: t.category, date: b.date });
        }
      }
    }
    for (const s of b.top_stories) { if (matches(s.category)) stories.push({ type: "top_story", title: s.title, url: s.url, source: s.source, summary: s.summary, category: s.category, date: b.date }); }
    for (const s of b.product_radar) { if (matches(s.category)) stories.push({ type: "product", title: s.name, url: s.url, description: s.description, category: s.category, date: b.date }); }
    for (const s of b.quick_hits) { if (matches(s.category)) stories.push({ type: "quick_hit", title: s.title, url: s.url, description: s.description, category: s.category, date: b.date }); }
  }
  return stories;
}

export async function getAllProductRadar(): Promise<Array<{ item: ProductItem; briefingDate: string }>> {
  if (isSupabaseBackend()) {
    const { data } = await supabase
      .from("product_radar")
      .select("*, briefings!inner(date)")
      .order("created_at", { ascending: false });
    return (data ?? []).map(p => ({
      item: { name: p.name, url: p.url, description: p.description, tag: p.tag, category: p.category, tags: p.tags },
      briefingDate: ((p.briefings as unknown as { date: string })).date,
    }));
  }
  const briefings = await getAllBriefings();
  const results: Array<{ item: ProductItem; briefingDate: string }> = [];
  const seen = new Set<string>();
  for (const b of briefings) {
    for (const item of b.product_radar) {
      const key = item.name.toLowerCase();
      if (!seen.has(key)) { seen.add(key); results.push({ item, briefingDate: b.date }); }
    }
  }
  return results;
}

export async function getAllQuickHits(): Promise<Array<{ item: QuickHit; briefingDate: string }>> {
  if (isSupabaseBackend()) {
    const { data } = await supabase
      .from("quick_hits")
      .select("*, briefings!inner(date)")
      .order("created_at", { ascending: false });
    return (data ?? []).map(q => ({
      item: { title: q.title, url: q.url, description: q.description, category: q.category, tags: q.tags },
      briefingDate: (q.briefings as Record<string, string>).date,
    }));
  }
  const briefings = await getAllBriefings();
  const results: Array<{ item: QuickHit; briefingDate: string }> = [];
  const seen = new Set<string>();
  for (const b of briefings) {
    for (const item of b.quick_hits) {
      if (!seen.has(item.url)) { seen.add(item.url); results.push({ item, briefingDate: b.date }); }
    }
  }
  return results;
}

export async function getAllVideos(): Promise<Array<{ item: VideoItem; briefingDate: string }>> {
  if (isSupabaseBackend()) {
    const { data } = await supabase
      .from("watch_list")
      .select("*, briefings!inner(date)")
      .order("created_at", { ascending: false });
    return (data ?? []).map(v => ({
      item: { title: v.title, url: v.url, video_id: v.video_id, channel: v.channel, duration: v.duration, summary: v.summary, category: v.category, tags: v.tags },
      briefingDate: (v.briefings as Record<string, string>).date,
    }));
  }
  const briefings = await getAllBriefings();
  const results: Array<{ item: VideoItem; briefingDate: string }> = [];
  const seen = new Set<string>();
  for (const b of briefings) {
    for (const item of b.watch_list) {
      if (!seen.has(item.url)) { seen.add(item.url); results.push({ item, briefingDate: b.date }); }
    }
  }
  return results;
}

// ═══ HELPER: DB ROW → Topic INTERFACE ═══

function dbTopicToTopic(row: Record<string, unknown>): Topic {
  const sources = (row.sources ?? []) as Array<Record<string, unknown>>;
  const threads = (row.reddit_threads ?? []) as Array<Record<string, unknown>>;
  return {
    id: row.slug as string,
    title: row.title as string,
    summary: row.summary as string,
    article: row.article as string | undefined,
    key_takeaways: (row.key_takeaways ?? []) as string[],
    impact_tier: row.impact_tier as Topic["impact_tier"],
    category: row.category as StoryCategory,
    signal_score: row.signal_score as number,
    image: row.image_url as string | undefined,
    tags: (row.tags ?? []) as string[],
    sources: sources.map(s => ({
      title: s.title as string,
      url: s.url as string,
      source_name: s.source_name as string,
      source_logo: s.source_logo as string | undefined,
      image: s.image_url as string | undefined,
      published_at: s.published_at as string | undefined,
      excerpt: s.excerpt as string,
      applicability_score: s.applicability_score as number,
      factuality_score: s.factuality_score as number,
      angle: s.angle as string,
    })),
    reddit_threads: threads.map(r => ({
      title: r.title as string,
      url: r.url as string,
      subreddit: r.subreddit as string,
      score: r.score as number,
      comment_count: r.comment_count as number,
      top_comment: r.top_comment as string | undefined,
    })),
  };
}
