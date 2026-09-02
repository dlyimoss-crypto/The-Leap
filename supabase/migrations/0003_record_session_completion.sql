-- The Leap — atomic session-completion write.
-- Replaces a client-side read-then-upsert (racy under concurrent submits,
-- e.g. a double-clicked Continue button or two open tabs) with a single
-- statement per table so current_session_number can only ever move forward.

create or replace function public.record_session_completion(
  p_journey_slug text,
  p_session_number int,
  p_is_last_day boolean
)
returns void
language plpgsql
security invoker
as $$
begin
  insert into session_completions (user_id, journey_slug, session_number)
  values (auth.uid(), p_journey_slug, p_session_number)
  on conflict (user_id, journey_slug, session_number) do nothing;

  insert into journey_progress (
    user_id, journey_slug, current_session_number, completed_at
  )
  values (
    auth.uid(),
    p_journey_slug,
    case when p_is_last_day then p_session_number else p_session_number + 1 end,
    case when p_is_last_day then now() else null end
  )
  on conflict (user_id, journey_slug) do update set
    current_session_number = greatest(
      journey_progress.current_session_number,
      excluded.current_session_number
    ),
    completed_at = coalesce(journey_progress.completed_at, excluded.completed_at);
end;
$$;
