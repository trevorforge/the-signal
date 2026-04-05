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
}

export interface ProductItem {
  name: string;
  url: string;
  description: string;
  tag: "NEW" | "UPDATE" | "BETA" | "BREAKING";
}

export interface IntelItem {
  title: string;
  url: string;
  source: string;
  summary: string;
}

export interface VideoItem {
  title: string;
  url: string;
  video_id: string;
  channel: string;
  duration?: string;
  summary: string;
}

export interface QuickHit {
  title: string;
  url: string;
  description: string;
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
}
