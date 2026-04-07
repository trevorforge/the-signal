import { Briefing, StoryCategory, Topic, ProductItem, QuickHit, VideoItem } from "./types";
import { supabase } from "./supabase";

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
  const { getServiceClient } = await import("./supabase");
  const db = getServiceClient();

  const { data: briefingRow, error: bErr } = await db
    .from("briefings")
    .upsert({
      date: briefing.date,
      updated_at: briefing.updated_at,
      version: briefing.version ?? 2,
      story_count: briefing.story_count,
      tldr: briefing.tldr,
      stats: briefing.stats ?? null,
      legacy_v1_data: briefing.top_stories?.length > 0 ? {
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

  // Clear existing child rows for upsert
  await db.from("topics").delete().eq("briefing_id", briefingId);
  await db.from("product_radar").delete().eq("briefing_id", briefingId);
  await db.from("quick_hits").delete().eq("briefing_id", briefingId);
  await db.from("watch_list").delete().eq("briefing_id", briefingId);

  // Topics + sources + reddit threads
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

      if (tErr) { console.error(`Topic ${topic.id}: ${tErr.message}`); continue; }

      if (topic.sources.length > 0) {
        await db.from("sources").insert(
          topic.sources.map(s => ({
            topic_id: topicRow.id,
            title: s.title, url: s.url, source_name: s.source_name,
            source_logo: s.source_logo ?? null, image_url: s.image ?? null,
            excerpt: s.excerpt, applicability_score: s.applicability_score,
            factuality_score: s.factuality_score, angle: s.angle,
          }))
        );
      }

      if (topic.reddit_threads?.length) {
        await db.from("reddit_threads").insert(
          topic.reddit_threads.map(r => ({
            topic_id: topicRow.id, title: r.title, url: r.url,
            subreddit: r.subreddit, score: r.score,
            comment_count: r.comment_count, top_comment: r.top_comment ?? null,
          }))
        );
      }
    }
  }

  if (briefing.product_radar?.length) {
    await db.from("product_radar").upsert(
      briefing.product_radar.map(p => ({
        briefing_id: briefingId, name: p.name, url: p.url,
        description: p.description, tag: p.tag,
        category: p.category ?? null, tags: p.tags ?? [],
      })),
      { onConflict: "url", ignoreDuplicates: true }
    );
  }

  if (briefing.quick_hits?.length) {
    await db.from("quick_hits").upsert(
      briefing.quick_hits.map(q => ({
        briefing_id: briefingId, title: q.title, url: q.url,
        description: q.description, category: q.category ?? null, tags: q.tags ?? [],
      })),
      { onConflict: "url", ignoreDuplicates: true }
    );
  }

  if (briefing.watch_list?.length) {
    await db.from("watch_list").upsert(
      briefing.watch_list.map(v => ({
        briefing_id: briefingId, title: v.title, url: v.url,
        video_id: v.video_id, channel: v.channel,
        duration: v.duration ?? null, summary: v.summary,
        category: v.category ?? null, tags: v.tags ?? [],
      })),
      { onConflict: "url", ignoreDuplicates: true }
    );
  }

  return briefingId;
}

// ═══ READ FUNCTIONS ═══

export async function getLatestBriefing(): Promise<Briefing | null> {
  const { data } = await supabase.from("briefings").select("date").order("date", { ascending: false }).limit(1).single();
  if (!data) return null;
  return getBriefingByDate(data.date);
}

export async function getBriefingByDate(date: string): Promise<Briefing | null> {
  const { data } = await supabase.from("briefings").select("*").eq("date", date).single();
  if (!data) return null;
  return reconstructBriefing(data);
}

async function reconstructBriefing(row: Record<string, unknown>): Promise<Briefing> {
  const [topicsRes, productsRes, hitsRes, videosRes] = await Promise.all([
    supabase.from("topics").select("*, sources(*), reddit_threads(*)").eq("briefing_id", row.id).order("signal_score", { ascending: false }),
    supabase.from("product_radar").select("*").eq("briefing_id", row.id),
    supabase.from("quick_hits").select("*").eq("briefing_id", row.id),
    supabase.from("watch_list").select("*").eq("briefing_id", row.id),
  ]);

  const legacy = row.legacy_v1_data as Record<string, unknown> | null;

  return {
    date: row.date as string,
    updated_at: row.updated_at as string,
    version: (row.version as number) === 2 ? 2 : undefined,
    story_count: row.story_count as number,
    tldr: row.tldr as string[],
    stats: row.stats as Briefing["stats"],
    topics: (topicsRes.data ?? []).map(dbTopicToTopic),
    top_stories: legacy?.top_stories as Briefing["top_stories"] ?? [],
    product_radar: (productsRes.data ?? []).map(p => ({
      name: p.name, url: p.url, description: p.description,
      tag: p.tag as ProductItem["tag"], category: p.category, tags: p.tags ?? [],
    })),
    creative_intel: legacy?.creative_intel as Briefing["creative_intel"] ?? [],
    knowledge_shelf: legacy?.knowledge_shelf as Briefing["knowledge_shelf"] ?? [],
    watch_list: (videosRes.data ?? []).map(v => ({
      title: v.title, url: v.url, video_id: v.video_id, channel: v.channel,
      duration: v.duration, summary: v.summary, category: v.category, tags: v.tags ?? [],
    })),
    quick_hits: (hitsRes.data ?? []).map(q => ({
      title: q.title, url: q.url, description: q.description, category: q.category, tags: q.tags ?? [],
    })),
    hero_story_index: legacy?.hero_story_index as number ?? 0,
  };
}

export async function getAllBriefings(): Promise<Briefing[]> {
  const { data } = await supabase.from("briefings").select("date").order("date", { ascending: false });
  if (!data) return [];
  const results: Briefing[] = [];
  for (const row of data) {
    const b = await getBriefingByDate(row.date);
    if (b) results.push(b);
  }
  return results;
}

export async function listBriefingDates(): Promise<string[]> {
  const { data } = await supabase.from("briefings").select("date").order("date", { ascending: false });
  return (data ?? []).map(r => r.date);
}

// ═══ TOPIC QUERIES ═══

export async function getTopicById(topicId: string): Promise<{ topic: Topic; briefingDate: string } | null> {
  const { data } = await supabase
    .from("topics")
    .select("*, sources(*), reddit_threads(*), briefings!inner(date)")
    .eq("slug", topicId)
    .single();
  if (!data) return null;
  return {
    topic: dbTopicToTopic(data),
    briefingDate: ((data.briefings as unknown as { date: string })).date,
  };
}

export async function getAllTopics(): Promise<Array<{ topic: Topic; briefingDate: string }>> {
  const { data } = await supabase
    .from("topics")
    .select("*, sources(*), reddit_threads(*), briefings!inner(date)")
    .order("published_at", { ascending: false });
  return (data ?? []).map(t => ({
    topic: dbTopicToTopic(t),
    briefingDate: ((t.briefings as unknown as { date: string })).date,
  }));
}

export async function getRelatedTopics(currentId: string, category: StoryCategory, tags: string[], limit = 4): Promise<Array<{ topic: Topic; briefingDate: string }>> {
  const { data } = await supabase
    .from("topics")
    .select("*, sources(*), reddit_threads(*), briefings!inner(date)")
    .neq("slug", currentId)
    .or(`category.eq.${category},tags.ov.{${tags.join(",")}}`)
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map(t => ({
    topic: dbTopicToTopic(t),
    briefingDate: ((t.briefings as unknown as { date: string })).date,
  }));
}

export async function getLatestTopics(limit = 20): Promise<Array<{ topic: Topic; briefingDate: string }>> {
  const { data } = await supabase
    .from("topics")
    .select("*, sources(*), reddit_threads(*), briefings!inner(date)")
    .order("published_at", { ascending: false })
    .limit(limit);
  return (data ?? []).map(t => ({
    topic: dbTopicToTopic(t),
    briefingDate: ((t.briefings as unknown as { date: string })).date,
  }));
}

// ═══ SIDEBAR QUERIES ═══

export async function getCategoryCounts(): Promise<Record<string, number>> {
  const { data } = await supabase.from("topics").select("category");
  const counts: Record<string, number> = {};
  for (const row of data ?? []) {
    const key = row.category || "general";
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

export async function getStoriesByCategory(category: StoryCategory): Promise<FlatStory[]> {
  const { data } = await supabase
    .from("topics")
    .select("slug, title, summary, category, briefings!inner(date)")
    .eq("category", category)
    .order("published_at", { ascending: false });
  return (data ?? []).map(t => ({
    type: "top_story" as const,
    title: t.title,
    url: `/topic/${t.slug}`,
    summary: t.summary,
    category: t.category as StoryCategory,
    date: ((t.briefings as unknown as { date: string })).date,
  }));
}

export async function getAllProductRadar(): Promise<Array<{ item: ProductItem; briefingDate: string }>> {
  const { data } = await supabase
    .from("product_radar")
    .select("*, briefings!inner(date)")
    .order("created_at", { ascending: false });
  return (data ?? []).map(p => ({
    item: { name: p.name, url: p.url, description: p.description, tag: p.tag, category: p.category, tags: p.tags },
    briefingDate: ((p.briefings as unknown as { date: string })).date,
  }));
}

export async function getAllQuickHits(): Promise<Array<{ item: QuickHit; briefingDate: string }>> {
  const { data } = await supabase
    .from("quick_hits")
    .select("*, briefings!inner(date)")
    .order("created_at", { ascending: false });
  return (data ?? []).map(q => ({
    item: { title: q.title, url: q.url, description: q.description, category: q.category, tags: q.tags },
    briefingDate: ((q.briefings as unknown as { date: string })).date,
  }));
}

export async function getAllVideos(): Promise<Array<{ item: VideoItem; briefingDate: string }>> {
  const { data } = await supabase
    .from("watch_list")
    .select("*, briefings!inner(date)")
    .order("created_at", { ascending: false });
  return (data ?? []).map(v => ({
    item: { title: v.title, url: v.url, video_id: v.video_id, channel: v.channel, duration: v.duration, summary: v.summary, category: v.category, tags: v.tags },
    briefingDate: ((v.briefings as unknown as { date: string })).date,
  }));
}

// ═══ DB ROW → Topic ═══

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
      title: s.title as string, url: s.url as string, source_name: s.source_name as string,
      source_logo: s.source_logo as string | undefined, image: s.image_url as string | undefined,
      published_at: s.published_at as string | undefined, excerpt: s.excerpt as string,
      applicability_score: s.applicability_score as number, factuality_score: s.factuality_score as number,
      angle: s.angle as string,
    })),
    reddit_threads: threads.map(r => ({
      title: r.title as string, url: r.url as string, subreddit: r.subreddit as string,
      score: r.score as number, comment_count: r.comment_count as number,
      top_comment: r.top_comment as string | undefined,
    })),
  };
}
