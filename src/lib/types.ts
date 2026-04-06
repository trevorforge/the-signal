// ═══ SHARED ═══

export type StoryCategory =
  | "claude-anthropic"
  | "design-tools"
  | "creative-advertising"
  | "rag-knowledge"
  | "competitive-intel"
  | "ai-coding"
  | "ai-agents"
  | "product-launches"
  | "general";

export type ImpactTier = "adopt" | "watch" | "ignore";

// ═══ V2: MULTI-SOURCE TOPIC MODEL ═══

export interface Source {
  title: string;
  url: string;
  source_name: string;
  source_logo?: string;
  image?: string;
  published_at?: string;
  excerpt: string;
  applicability_score: number;  // 0-100: how relevant is this angle to Trevor
  factuality_score: number;     // 0-100: how reliable/substantive is this source
  angle: string;                // One-line: what's unique about this coverage
}

export interface RedditThread {
  title: string;
  url: string;
  subreddit: string;
  score: number;
  comment_count: number;
  top_comment?: string;
}

export interface Topic {
  id: string;                    // slug: "claude-microsoft-365"
  title: string;                 // Synthesized headline
  summary: string;               // Claude's 2-3 sentence synthesis
  key_takeaways: string[];       // 3-5 bullet points
  article?: string;              // Custom editorial article (300-500 words, Markdown)
  impact_tier: ImpactTier;
  category: StoryCategory;
  signal_score: number;          // 0-100 overall
  image?: string;                // Best og:image from sources
  tags: string[];
  sources: Source[];             // 2-8 articles covering this topic
  reddit_threads?: RedditThread[];
}

// ═══ V1: LEGACY FLAT MODEL (backward compat) ═══

export interface TopStory {
  title: string;
  url: string;
  source: string;
  image?: string;
  time_ago: string;
  summary: string;
  bull_case: string;
  bear_case: string;
  the_signal: string;
  category?: StoryCategory;
  signal_score?: number;
  tags?: string[];
}

export interface ProductItem {
  name: string;
  url: string;
  description: string;
  tag: "NEW" | "UPDATE" | "BETA" | "BREAKING";
  category?: StoryCategory;
  tags?: string[];
}

export interface IntelItem {
  title: string;
  url: string;
  source: string;
  summary: string;
  category?: StoryCategory;
  signal_score?: number;
  tags?: string[];
}

export interface VideoItem {
  title: string;
  url: string;
  video_id: string;
  channel: string;
  duration?: string;
  summary: string;
  category?: StoryCategory;
  tags?: string[];
}

export interface QuickHit {
  title: string;
  url: string;
  description: string;
  category?: StoryCategory;
  tags?: string[];
}

// ═══ BRIEFING (supports both v1 and v2) ═══

export interface Briefing {
  date: string;
  updated_at: string;
  version?: 2;                   // Present on v2 briefings
  story_count: number;
  tldr: string[];

  // v2 fields (multi-source topic model)
  topics?: Topic[];
  stats?: {
    total_sources: number;
    total_topics: number;
    adopt_count: number;
    watch_count: number;
    ignore_count: number;
  };

  // v1 fields (still supported for backward compat)
  top_stories: TopStory[];
  product_radar: ProductItem[];
  creative_intel: IntelItem[];
  knowledge_shelf: IntelItem[];
  watch_list: VideoItem[];
  quick_hits: QuickHit[];
  hero_story_index?: number;
}

// ═══ HELPERS ═══

export function isV2Briefing(b: Briefing): boolean {
  return b.version === 2 && Array.isArray(b.topics) && b.topics.length > 0;
}

export function getImpactColor(tier: ImpactTier): string {
  switch (tier) {
    case "adopt": return "var(--color-adopt)";
    case "watch": return "var(--color-watch)";
    case "ignore": return "var(--color-ignore)";
  }
}

export function getImpactLabel(tier: ImpactTier): string {
  switch (tier) {
    case "adopt": return "Adopt Now";
    case "watch": return "Watch";
    case "ignore": return "Noise";
  }
}

export function getFactualityLabel(score: number): string {
  if (score >= 80) return "High";
  if (score >= 50) return "Mixed";
  return "Low";
}
