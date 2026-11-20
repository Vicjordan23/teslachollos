-- Chollesla: AliExpress, moderación, caducidad e insignias.

-- AliExpress como tienda del programa de Vic (enlace generado por su API de afiliados).
insert into public.tiendas (id, nombre, dominios, descuento, codigo)
values ('aliexpress', 'AliExpress', array['aliexpress.com'], 0, null)
on conflict (id) do nothing;

-- Suspensión de cuentas (moderación). Una cuenta suspendida no puede votar, reportar ni crear alertas.
alter table public.perfiles add column if not exists suspendido boolean not null default false;

create or replace function public.activo()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.perfiles where id = auth.uid() and not suspendido);
$$;

drop policy if exists votos_crear on public.votos;
create policy votos_crear on public.votos for insert to authenticated
  with check (usuario_id = auth.uid() and public.activo()
    and exists (select 1 from public.chollos c where c.id = chollo_id and c.estado = 'publicado'));
drop policy if exists reportes_crear on public.reportes;
create policy reportes_crear on public.reportes for insert to authenticated
  with check (usuario_id = auth.uid() and public.activo());

-- Votos en directo: publicar los cambios de la tabla votos por Supabase Realtime.
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime')
     and not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'votos') then
    execute 'alter publication supabase_realtime add table public.votos';
  end if;
end $$;

-- Perfil público con estadísticas para las insignias. Solo alias y recuentos (sin email ni reportes concretos),
-- por eso la vista se ejecuta con los permisos de su dueño y no expone las tablas que agrega.
create or replace view public.perfiles_publicos
with (security_invoker = false) as
select
  p.alias,
  p.creado,
  (select count(*) from public.chollos c where c.autor = p.id and c.estado in ('publicado', 'caducado'))::integer as chollos,
  (select coalesce(sum(v.valor), 0) from public.votos v join public.chollos c on c.id = v.chollo_id
     where c.autor = p.id and c.estado in ('publicado', 'caducado'))::integer as grados,
  (select count(*) from public.votos v where v.usuario_id = p.id)::integer as votos_dados,
  (select count(*) from public.reportes r where r.usuario_id = p.id and r.estado = 'aceptado')::integer as reportes_utiles
from public.perfiles p
where not p.suspendido;
grant select on public.perfiles_publicos to anon, authenticated;
