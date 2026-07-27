-- Migração para adicionar novos campos às tabelas

-- Adicionar campos à tabela plantas
ALTER TABLE plantas ADD COLUMN IF NOT EXISTS categoria VARCHAR(100);
ALTER TABLE plantas ADD COLUMN IF NOT EXISTS tags VARCHAR(500);
ALTER TABLE plantas ADD COLUMN IF NOT EXISTS created_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE plantas ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP NOT NULL DEFAULT NOW();
ALTER TABLE plantas ADD COLUMN IF NOT EXISTS visualizacoes INTEGER DEFAULT 0;

-- Adicionar campos à tabela sassanhas
ALTER TABLE sassanhas ADD COLUMN IF NOT EXISTS audio_url VARCHAR(500);
ALTER TABLE sassanhas ADD COLUMN IF NOT EXISTS transricao_fonetica VARCHAR(500);

-- Atualizar registros existentes com valores padrão
UPDATE plantas SET created_at = NOW() WHERE created_at IS NULL;
UPDATE plantas SET updated_at = NOW() WHERE updated_at IS NULL;
UPDATE plantas SET visualizacoes = 0 WHERE visualizacoes IS NULL;
