-- Feed Support Schema
-- These tables support a social-media style feed within EL SPACE

-- Social Posts Table
CREATE TABLE IF NOT EXISTS social_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[] DEFAULT '{}',
  media_type TEXT CHECK (media_type IN ('image', 'video', 'none')) DEFAULT 'none',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  shares_count INTEGER DEFAULT 0,
  reposts_count INTEGER DEFAULT 0,
  original_post_id UUID REFERENCES social_posts(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Social Likes Table
CREATE TABLE IF NOT EXISTS social_likes (
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- Social Comments Table
CREATE TABLE IF NOT EXISTS social_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES social_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES

-- Posts
ALTER TABLE social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social posts are viewable by everyone." ON social_posts FOR SELECT USING (true);
CREATE POLICY "Users can manage own posts." ON social_posts FOR ALL USING (auth.uid() = user_id);

-- Likes
ALTER TABLE social_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social engagement is public." ON social_likes FOR SELECT USING (true);
CREATE POLICY "Users can like/unlike." ON social_likes FOR ALL USING (auth.uid() = user_id);

-- Comments
ALTER TABLE social_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social comments are public." ON social_comments FOR SELECT USING (true);
CREATE POLICY "Users can manage own comments." ON social_comments FOR ALL USING (auth.uid() = user_id);

-- Functions for atomic counters
CREATE OR REPLACE FUNCTION increment_likes(p_post_id UUID) RETURNS VOID AS $$
  UPDATE social_posts SET likes_count = likes_count + 1 WHERE id = p_post_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION decrement_likes(p_post_id UUID) RETURNS VOID AS $$
  UPDATE social_posts SET likes_count = GREATEST(0, likes_count - 1) WHERE id = p_post_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION increment_comments(p_post_id UUID) RETURNS VOID AS $$
  UPDATE social_posts SET comments_count = comments_count + 1 WHERE id = p_post_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION increment_shares(p_post_id UUID) RETURNS VOID AS $$
  UPDATE social_posts SET shares_count = shares_count + 1 WHERE id = p_post_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION increment_reposts(p_post_id UUID) RETURNS VOID AS $$
  UPDATE social_posts SET reposts_count = reposts_count + 1 WHERE id = p_post_id;
$$ LANGUAGE SQL;
