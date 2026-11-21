-- Clics en «Ir al chollo», ingresos de afiliados (a mano o por importación) y quién puede ver el panel.
-- Todo se lee y escribe solo desde el servidor con la clave de servicio: sin políticas, nadie más accede.

-- Un registro por clic: qué chollo y qué tienda, nada de la persona (ni IP ni identificadores).
create table if not exists public.clics_ir (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  slug text not null,
  tienda text,
  titulo text
);
create index if not exists clics_ir_creado_idx on public.clics_ir (creado desc);
create index if not exists clics_ir_slug_idx on public.clics_ir (slug);
alter table public.clics_ir enable row level security;
grant select, insert, delete on public.clics_ir to service_role;

-- Resultados que dan los programas de afiliados (Amazon, Awin, GoAffPro, BixGrow, AliExpress...).
-- Un registro por tienda y día (o por periodo, a mano). Importes en céntimos de euro.
create table if not exists public.ingresos_afiliados (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  fecha date not null,
  tienda text not null,
  clics_tienda integer not null default 0,
  pedidos integer not null default 0,
  ventas_cents bigint not null default 0,
  comision_cents bigint not null default 0,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'aprobada', 'pagada', 'rechazada')),
  origen text not null default 'manual',
  notas text,
  unique (fecha, tienda, origen)
);
create index if not exists ingresos_afiliados_fecha_idx on public.ingresos_afiliados (fecha desc);
alter table public.ingresos_afiliados enable row level security;
grant select, insert, update, delete on public.ingresos_afiliados to service_role;

-- Personas que pueden ver el panel de afiliados (se añaden a mano con su id de Authentication → Users).
create table if not exists public.administradores (
  user_id uuid primary key references auth.users (id) on delete cascade
);
alter table public.administradores enable row level security;
grant select on public.administradores to service_role;
