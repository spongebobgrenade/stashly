-- =====================================================
-- Migration 008
-- Enable RLS on memory tables
-- =====================================================

-- Memory Representations
alter table public.memory_representations
enable row level security;

create policy "Users can view own memory representations"
on public.memory_representations
for select
using (
  exists (
    select 1
    from public.saves
    where saves.id = memory_representations.memory_id
      and saves.user_id = auth.uid()
  )
);

-- Memory Embeddings
alter table public.memory_embeddings
enable row level security;

create policy "Users can view own memory embeddings"
on public.memory_embeddings
for select
using (
  exists (
    select 1
    from public.saves
    where saves.id = memory_embeddings.memory_id
      and saves.user_id = auth.uid()
  )
);