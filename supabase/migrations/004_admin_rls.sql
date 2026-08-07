-- Replace recursive profile policies with a narrowly scoped admin helper.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

-- Admin-only management policies.
drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
  on public.profiles for select to authenticated
  using (public.is_admin());

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id and role = 'user');

drop policy if exists "Admins can manage products" on public.products;
create policy "Admins can manage products" on public.products for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can manage vehicles" on public.vehicles;
create policy "Admins can manage vehicles" on public.vehicles for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can manage materials" on public.materials;
create policy "Admins can manage materials" on public.materials for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can manage orders" on public.orders;
create policy "Admins can manage orders" on public.orders for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can manage bookings" on public.rental_bookings;
create policy "Admins can manage bookings" on public.rental_bookings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Admins can manage inquiries" on public.inquiries;
create policy "Admins can manage inquiries" on public.inquiries for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "Authenticated can manage hero slides" on public.hero_slides;
create policy "Authenticated can manage hero slides" on public.hero_slides for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Keep uploads and deletes admin-only.
drop policy if exists "Admins can upload images" on storage.objects;
create policy "Admins can upload images" on storage.objects for insert to authenticated
  with check (bucket_id in ('products', 'vehicles', 'materials', 'hero-slides') and public.is_admin());
drop policy if exists "Admins can update images" on storage.objects;
create policy "Admins can update images" on storage.objects for update to authenticated
  using (bucket_id in ('products', 'vehicles', 'materials', 'hero-slides') and public.is_admin())
  with check (bucket_id in ('products', 'vehicles', 'materials', 'hero-slides') and public.is_admin());
drop policy if exists "Admins can delete images" on storage.objects;
create policy "Admins can delete images" on storage.objects for delete to authenticated
  using (bucket_id in ('products', 'vehicles', 'materials', 'hero-slides') and public.is_admin());
