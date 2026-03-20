alter table public.child_profiles
  add column if not exists child_age integer;

update public.child_profiles
set child_age = case age_band
  when '2-4' then 4
  when '5-7' then 7
  when '8-12' then 12
  else 6
end
where child_age is null;

alter table public.child_profiles
  alter column child_age set not null;

alter table public.child_profiles
  drop constraint if exists child_profiles_child_age_check;

alter table public.child_profiles
  add constraint child_profiles_child_age_check check (child_age between 2 and 17);
