-- Chollesla: envío de alertas, categoría y modelos en los chollos, y límites para publicar.

-- Alertas: hasta cuándo se ha avisado (el envío solo manda chollos publicados después).
alter table public.alertas add column if not exists ultimo_aviso timestamptz not null default now();
alter table public.alertas add column if not exists categoria text;
grant update (ultimo_aviso) on public.alertas to service_role;

-- Máximo 20 alertas por persona.
create or replace function public.limite_alertas()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.alertas where usuario_id = new.usuario_id) >= 20 then
    raise exception 'Máximo 20 alertas por cuenta';
  end if;
  return new;
end;
$$;
drop trigger if exists alertas_limite on public.alertas;
create trigger alertas_limite before insert on public.alertas for each row execute function public.limite_alertas();

-- Chollos: tipo de producto (para filtrar los de la comunidad igual que los oficiales).
alter table public.chollos add column if not exists categoria text not null default 'otros';
create index if not exists chollos_tipo_estado on public.chollos (tipo, estado, creado desc);

-- Vista pública con la categoría.
create or replace view public.chollos_publicos
with (security_invoker = true) as
select
  c.id, c.slug, c.tipo, c.tienda, c.titulo, c.descripcion, c.modelos, c.enlace, c.foto,
  c.precio_tienda, c.precio_final, c.desde, c.fecha_precio, c.estado, c.caduca, c.creado,
  p.alias as autor_alias,
  coalesce((select sum(v.valor) from public.votos v where v.chollo_id = c.id), 0)::integer as temperatura,
  c.categoria
from public.chollos c
left join public.perfiles p on p.id = c.autor
where c.estado in ('publicado', 'caducado');
grant select on public.chollos_publicos to anon, authenticated;
