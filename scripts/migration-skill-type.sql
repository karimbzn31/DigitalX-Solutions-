-- Migration : Ajout du type 'skill' (Skills JARVIS)
ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_type_check;
ALTER TABLE resources ADD CONSTRAINT resources_type_check
CHECK (type IN ('pdf', 'code', 'prompt', 'file', 'github', 'skill'));
