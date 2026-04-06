-- The Signal: Initial Schema

CREATE TABLE briefings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE UNIQUE NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INT DEFAULT 2,
  story_count INT DEFAULT 0,
  tldr TEXT[] NOT NULL DEFAULT '{}',
  stats JSONB,
  legacy_v1_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id UUID NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  article TEXT,
  key_takeaways TEXT[] DEFAULT '{}',
  impact_tier TEXT NOT NULL CHECK (impact_tier IN ('adopt', 'watch', 'ignore')),
  category TEXT NOT NULL,
  signal_score INT CHECK (signal_score >= 0 AND signal_score <= 100),
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(briefing_id, slug)
);

CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  source_name TEXT,
  source_logo TEXT,
  image_url TEXT,
  published_at TIMESTAMPTZ,
  excerpt TEXT,
  applicability_score INT CHECK (applicability_score >= 0 AND applicability_score <= 100),
  factuality_score INT CHECK (factuality_score >= 0 AND factuality_score <= 100),
  angle TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE reddit_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  subreddit TEXT,
  score INT DEFAULT 0,
  comment_count INT DEFAULT 0,
  top_comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE product_radar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id UUID NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  tag TEXT CHECK (tag IN ('NEW', 'UPDATE', 'BETA', 'BREAKING')),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(url)
);

CREATE TABLE quick_hits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id UUID NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(url)
);

CREATE TABLE watch_list (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id UUID NOT NULL REFERENCES briefings(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  video_id TEXT,
  channel TEXT,
  duration TEXT,
  summary TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(url)
);

-- Indexes
CREATE INDEX idx_briefings_date ON briefings(date DESC);
CREATE INDEX idx_topics_briefing ON topics(briefing_id);
CREATE INDEX idx_topics_category ON topics(category);
CREATE INDEX idx_topics_slug ON topics(slug);
CREATE INDEX idx_topics_impact ON topics(impact_tier);
CREATE INDEX idx_topics_published ON topics(published_at DESC);
CREATE INDEX idx_sources_topic ON sources(topic_id);
CREATE INDEX idx_reddit_topic ON reddit_threads(topic_id);

-- RLS
ALTER TABLE briefings ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE reddit_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_radar ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_hits ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_list ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read briefings" ON briefings FOR SELECT USING (true);
CREATE POLICY "Public read topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Public read sources" ON sources FOR SELECT USING (true);
CREATE POLICY "Public read reddit" ON reddit_threads FOR SELECT USING (true);
CREATE POLICY "Public read products" ON product_radar FOR SELECT USING (true);
CREATE POLICY "Public read hits" ON quick_hits FOR SELECT USING (true);
CREATE POLICY "Public read videos" ON watch_list FOR SELECT USING (true);

CREATE POLICY "Service write briefings" ON briefings FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write topics" ON topics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write sources" ON sources FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write reddit" ON reddit_threads FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write products" ON product_radar FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write hits" ON quick_hits FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write videos" ON watch_list FOR ALL USING (auth.role() = 'service_role');
