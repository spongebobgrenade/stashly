create table memory_representations (
    id uuid primary key default gen_random_uuid(),
    memory_id uuid not null references saves(id) on delete cascade unique,
    version text not null,
    representation jsonb not null,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index memory_representations_memory_id_idx on memory_representations(memory_id);
