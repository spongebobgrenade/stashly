ALTER TABLE saves
ADD COLUMN IF NOT EXISTS canonical_url TEXT;

ALTER TABLE saves
ADD COLUMN IF NOT EXISTS creator_name TEXT;

ALTER TABLE saves
ADD COLUMN IF NOT EXISTS raw_metadata JSONB;

UPDATE saves
SET processing_status = 'queued'
WHERE processing_status = 'pending';

ALTER TABLE saves
DROP CONSTRAINT IF EXISTS saves_processing_status_check;

ALTER TABLE saves
ADD CONSTRAINT saves_processing_status_check
CHECK (
  processing_status IN (
    'queued',
    'processing',
    'completed',
    'failed'
  )
);

ALTER TABLE saves
ALTER COLUMN processing_status
SET DEFAULT 'queued';