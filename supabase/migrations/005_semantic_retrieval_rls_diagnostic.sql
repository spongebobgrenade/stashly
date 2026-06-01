CREATE OR REPLACE FUNCTION public.debug_semantic_auth_context(
  target_user_id uuid
)
RETURNS TABLE(
  auth_uid uuid,
  visible_memory_rows bigint,
  visible_embedding_rows bigint
)
LANGUAGE sql
SET search_path = public
AS $function$
  select
    auth.uid() as auth_uid,
    (
      select count(*)
      from public.saves s
      where s.user_id = target_user_id
    ) as visible_memory_rows,
    (
      select count(*)
      from public.memory_embeddings me
      join public.saves s
        on s.id = me.memory_id
      where s.user_id = target_user_id
    ) as visible_embedding_rows;
$function$;

GRANT EXECUTE ON FUNCTION public.debug_semantic_auth_context(
  uuid
) TO authenticated;

NOTIFY pgrst, 'reload schema';
