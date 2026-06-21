-- Migration to align search_events table with the required schema
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'search_events' AND column_name = 'mode'
  ) THEN
    ALTER TABLE public.search_events RENAME COLUMN mode TO retrieval_mode;
  END IF;
END $$;

-- Make sure the table itself is created if it does not exist
CREATE TABLE IF NOT EXISTS public.search_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  query TEXT NOT NULL,
  retrieval_mode TEXT NOT NULL,
  results_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.search_events ENABLE ROW LEVEL SECURITY;

-- Recreate policies to ensure correctness
CREATE POLICY "Users can view own search events" ON public.search_events
  FOR SELECT USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_search_events_user_id ON public.search_events(user_id);
CREATE INDEX IF NOT EXISTS idx_search_events_created_at ON public.search_events(created_at DESC);
