-- ============================================================
-- Migration: Upload de fichiers pour les ressources
-- ============================================================

-- 1. Ajouter les colonnes file_url et file_size
ALTER TABLE resources
ADD COLUMN IF NOT EXISTS file_url TEXT DEFAULT '',
ADD COLUMN IF NOT EXISTS file_size INTEGER DEFAULT 0;

-- 2. Mettre à jour la contrainte de type
ALTER TABLE resources
DROP CONSTRAINT IF EXISTS resources_type_check;

ALTER TABLE resources
ADD CONSTRAINT resources_type_check
CHECK (type IN ('pdf', 'code', 'prompt', 'file', 'github'));

-- 3. Migrer les anciens types vers les nouveaux
UPDATE resources SET type = 'file' WHERE type IN ('link', 'zip');

-- 4. Créer le bucket de stockage (via l'API Supabase)
-- Va dans Storage → Create bucket → name: "resources" → Public ✅
