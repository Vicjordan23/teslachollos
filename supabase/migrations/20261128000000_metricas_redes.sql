-- Seguidores, vistas e interacciones de cada red social, una fila por red y día.
-- Como el panel de afiliados: solo el servidor (clave de servicio) lee y escribe; sin políticas, nadie más accede.
create table if not exists public.metricas_redes (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  fecha date not null,
  red text not null,
  seguidores integer check (seguidores >= 0),
  vistas integer check (vistas >= 0),
  interacciones integer check (interacciones >= 0),
  notas text,
  unique (fecha, red)
);
alter table public.metricas_redes enable row level security;
grant select, insert, update, delete on public.metricas_redes to service_role;
