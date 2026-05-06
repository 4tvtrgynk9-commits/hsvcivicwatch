drop policy if exists "Allow public read on seats" on public.seats;

create policy "Allow public read on seats"
on public.seats
for select
to anon, authenticated
using (true);
