CREATE OR REPLACE FUNCTION public.match_memory_embeddings_for_user(
  query_embedding vector,
  match_count integer,
  target_user_id uuid
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
  where s.user_id = target_user_id
  order by me.embedding <=> query_embedding
  limit match_count;
$function$;

REVOKE ALL ON FUNCTION public.match_memory_embeddings_for_user(
  vector,
  integer,
  uuid
) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.match_memory_embeddings_for_user(
  vector,
  integer,
  uuid
) TO service_role;

NOTIFY pgrst, 'reload schema';
