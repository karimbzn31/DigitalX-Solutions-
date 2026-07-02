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
