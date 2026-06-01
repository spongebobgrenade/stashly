DROP FUNCTION IF EXISTS public.debug_semantic_auth_context(
  uuid
);

DROP FUNCTION IF EXISTS public.match_memory_embeddings(
  vector,
  integer,
  uuid
);

CREATE OR REPLACE FUNCTION public.match_memory_embeddings(
  query_embedding vector,
  match_count integer
)
RETURNS TABLE(
  memory_id uuid,
  similarity double precision
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $function$
  select
    me.memory_id,
    1 - (me.embedding <=> query_embedding) as similarity
  from public.memory_embeddings me
  join public.saves s
    on s.id = me.memory_id
  where s.user_id = auth.uid()
  order by me.embedding <=> query_embedding
  limit match_count;
$function$;

REVOKE ALL ON FUNCTION public.match_memory_embeddings(
  vector,
  integer
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.match_memory_embeddings(
  vector,
  integer
) TO authenticated;

NOTIFY pgrst, 'reload schema';
