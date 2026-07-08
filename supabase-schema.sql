-- Créer la table profiles (données utilisateur étendues)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  name TEXT NOT NULL DEFAULT '',
  initials TEXT NOT NULL DEFAULT '',
  is_admin BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'blocked')),
  validation_code TEXT,
  level TEXT DEFAULT 'Apprenti IA',
  total_progress INTEGER DEFAULT 0,
  videos_watched INTEGER DEFAULT 0,
  total_videos INTEGER DEFAULT 0,
  time_spent TEXT DEFAULT '0h',
  certificates INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger : créer automatiquement un profil après inscription
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, initials, is_admin, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'initials', ''),
    FALSE,
    'pending'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Activer Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès
CREATE POLICY "users_read_own"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users_update_own"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND is_admin = false);

CREATE POLICY "admins_read_all"
  ON profiles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admins_update_all"
  ON profiles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Créer un premier admin (à exécuter APRÈS avoir créé ton compte)
-- Remplace TON_UUID par ton auth.uid() après inscription
-- UPDATE profiles SET is_admin = true, status = 'active' WHERE id = 'TON_UUID';

-- ============================================================
-- Table access_codes (codes d'accès générés par les admins)
-- ============================================================
CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  tag TEXT DEFAULT 'Sans tag',
  uses INTEGER DEFAULT 0,
  max_uses INTEGER,
  expiry TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'depleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admins_read_access_codes"
  ON access_codes FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admins_insert_access_codes"
  ON access_codes FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admins_update_access_codes"
  ON access_codes FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- ============================================================
-- Tables de contenu (modules, vidéos, ressources, progression)
-- ============================================================

CREATE TABLE IF NOT EXISTS modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_short TEXT DEFAULT '',
  description TEXT DEFAULT '',
  videos_count INTEGER DEFAULT 0,
  duration TEXT DEFAULT '0h',
  level TEXT DEFAULT 'Débutant',
  color_from TEXT DEFAULT '#6366F1',
  color_to TEXT DEFAULT '#8B5CF6',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_read_modules"
  ON modules FOR SELECT
  USING (true);

CREATE POLICY "admins_insert_modules"
  ON modules FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admins_update_modules"
  ON modules FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admins_delete_modules"
  ON modules FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT NOT NULL DEFAULT '',
  duration TEXT DEFAULT '00:00',
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_read_videos"
  ON videos FOR SELECT
  USING (true);

CREATE POLICY "admins_insert_videos"
  ON videos FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admins_update_videos"
  ON videos FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admins_delete_videos"
  ON videos FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE TABLE IF NOT EXISTS resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID REFERENCES modules(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('pdf', 'code', 'prompt', 'link', 'zip')),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  url TEXT DEFAULT '',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "all_read_resources"
  ON resources FOR SELECT
  USING (true);

CREATE POLICY "admins_insert_resources"
  ON resources FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admins_update_resources"
  ON resources FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE POLICY "admins_delete_resources"
  ON resources FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE TABLE IF NOT EXISTS video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  watched BOOLEAN DEFAULT false,
  watched_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, video_id)
);

ALTER TABLE video_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_progress"
  ON video_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_progress"
  ON video_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_update_own_progress"
  ON video_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Indexes pour la performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_videos_module_id ON videos(module_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_user_id ON video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_video_progress_video_id ON video_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_resources_module_id ON resources(module_id);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON profiles(status);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_modules_order_index ON modules(order_index);
CREATE INDEX IF NOT EXISTS idx_videos_order_index ON videos(order_index);

-- ============================================================
-- Trigger pour updated_at automatique
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_modules_updated_at
  BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_videos_updated_at
  BEFORE UPDATE ON videos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_resources_updated_at
  BEFORE UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_access_codes_updated_at
  BEFORE UPDATE ON access_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- Table rate_limits (serverless-compatible rate limiting)
-- ============================================================
CREATE TABLE IF NOT EXISTS rate_limits (
  id BIGSERIAL PRIMARY KEY,
  key TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_key_expires ON rate_limits(key, expires_at);

ALTER TABLE rate_limits ENABLE ROW LEVEL SECURITY;

-- Cleanup old entries periodically
CREATE OR REPLACE FUNCTION cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  DELETE FROM rate_limits WHERE expires_at < NOW();
END;
$$;

-- Rate limit check function
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_key TEXT,
  p_max_requests INTEGER DEFAULT 10,
  p_window_ms INTEGER DEFAULT 60000
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Cleanup expired entries
  DELETE FROM rate_limits WHERE expires_at < NOW();

  -- Check current count
  SELECT COUNT(*) INTO current_count
  FROM rate_limits
  WHERE key = p_key AND expires_at > NOW();

  IF current_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;

  -- Record this request
  INSERT INTO rate_limits (key, count, expires_at)
  VALUES (p_key, 1, NOW() + (p_window_ms || ' milliseconds')::INTERVAL);

  RETURN TRUE;
END;
$$;

-- ============================================================
-- Table chat_sessions (serverless-compatible AI mentor sessions)
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_id TEXT NOT NULL DEFAULT 'default',
  role TEXT NOT NULL DEFAULT 'user',
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_conversation ON chat_sessions(user_id, conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_read_own_chat"
  ON chat_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users_insert_own_chat"
  ON chat_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users_delete_own_chat"
  ON chat_sessions FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "admins_read_all_chat"
  ON chat_sessions FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Table leads (email capture pour Module 0 gratuit)
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'module-0-landing',
  subscribed BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_insert_leads"
  ON leads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admins_read_leads"
  ON leads FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

-- Index pour dédoublonnage rapide
CREATE INDEX idx_leads_email ON leads (email);

-- Parrainage
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS referrals_count INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- Communauté : posts
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('general', 'entraide', 'ressources', 'succes')),
  likes INTEGER DEFAULT 0,
  liked_by UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_read_posts"
  ON community_posts FOR SELECT
  USING (true);

CREATE POLICY "auth_insert_posts"
  ON community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_delete_posts"
  ON community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Communauté : commentaires
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone_read_comments"
  ON community_comments FOR SELECT
  USING (true);

CREATE POLICY "auth_insert_comments"
  ON community_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "own_delete_comments"
  ON community_comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX idx_community_posts_channel ON community_posts(channel);
CREATE INDEX idx_community_posts_created ON community_posts(created_at DESC);
CREATE INDEX idx_community_comments_post ON community_comments(post_id);

-- Analytics : événements
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  event TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  page TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "insert_events"
  ON events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "admins_read_events"
  ON events FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = true));

CREATE INDEX idx_events_event ON events(event);
CREATE INDEX idx_events_created ON events(created_at);

-- Fonction pour compter les commentaires de plusieurs posts
CREATE OR REPLACE FUNCTION public.comment_counts(post_ids UUID[])
RETURNS TABLE(post_id UUID, count BIGINT)
LANGUAGE sql
STABLE
AS $$
  SELECT community_comments.post_id, COUNT(*)::BIGINT
  FROM community_comments
  WHERE community_comments.post_id = ANY(post_ids)
  GROUP BY community_comments.post_id;
$$;
