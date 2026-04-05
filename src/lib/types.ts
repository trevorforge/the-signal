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

export interface Briefing {
  date: string;
  updated_at: string;
  story_count: number;
  tldr: string[];
  top_stories: TopStory[];
  product_radar: ProductItem[];
  creative_intel: IntelItem[];
  knowledge_shelf: IntelItem[];
  watch_list: VideoItem[];
  quick_hits: QuickHit[];
  hero_story_index?: number;
}
