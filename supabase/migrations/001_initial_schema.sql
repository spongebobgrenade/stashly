create table saves (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null,

    content_type text not null,

    original_input text not null,

    source_platform text,

    title text,

    description text,

    thumbnail_url text,

    processing_status text default 'pending',

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);


create table save_processing_jobs (

    id uuid primary key default gen_random_uuid(),

    save_id uuid references saves(id) on delete cascade,

    job_type text not null,

    status text default 'queued',

    retries integer default 0,

    created_at timestamptz default now()
);