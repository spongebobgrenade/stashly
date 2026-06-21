create table if not exists search_events (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null references auth.users(id) on delete cascade,

  query text not null,

  mode text not null,

  results_count integer not null default 0,

  created_at timestamptz not null default now()
);

alter table search_events
enable row level security;

create policy "Users can view own search events"
on search_events
for select
using (
  auth.uid() = user_id
);

create policy "Users can insert own search events"
on search_events
for insert
with check (
  auth.uid() = user_id
);

create index idx_search_events_user_id
on search_events(user_id);

create index idx_search_events_created_at
on search_events(created_at desc);