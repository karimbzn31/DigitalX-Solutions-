-- Migration : Ajout de conversation_id pour mémoire par conversation
-- Run this in your Supabase SQL editor

ALTER TABLE chat_sessions
ADD COLUMN IF NOT EXISTS conversation_id TEXT NOT NULL DEFAULT 'default';

CREATE INDEX IF NOT EXISTS idx_chat_sessions_conversation
ON chat_sessions(user_id, conversation_id, created_at);

-- Supprimer les anciennes politiques (optionnel, elles fonctionnent encore)
-- Les nouvelles sessions utiliseront le conversation_id
