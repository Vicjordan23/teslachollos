-- Chollesla: esquema inicial (Supabase / Postgres).
-- Principios:
--  * Todo con RLS activado. Lo público se lee sin cuenta; lo personal, solo su dueño.
--  * Los chollos NO se insertan ni se editan desde el navegador: los crea el servidor (rol service_role)
--    después de pasar aplicarAfiliado() de @chollesla/core, así nadie puede colar su propio afiliado.
--  * Moderación con motivo registrado (Ley de Servicios Digitales, art. 17).
--  * Precios en céntimos (enteros). Sin puntuaciones ni opiniones inventadas: la temperatura sale de votos reales.

-- ---------------------------------------------------------------- perfiles
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  alias text not null unique check (alias ~ '^[a-z0-9_]{3,20}$'),
  rol text not null default 'usuario' check (rol in ('usuario', 'admin')),
  creado timestamptz not null default now()
);

create or replace function public.es_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.perfiles where id = auth.uid() and rol = 'admin');
$$;

-- ---------------------------------------------------------------- tiendas
create table public.tiendas (
  id text primary key,
  nombre text not null,
  dominios text[] not null,
  descuento numeric(4, 3) not null default 0 check (descuento >= 0 and descuento < 1),
  codigo text,
  activa boolean not null default true
);

insert into public.tiendas (id, nombre, dominios, descuento, codigo) values
  ('amazon', 'Amazon.es', array['amazon.es'], 0, null),
  ('jowua', 'Jowua', array['jowua-life.com'], 0.05, 'ACCESORIOSTESLA'),
  ('hansshow', 'Hansshow', array['hansshow.com'], 0.20, 'VICTOR'),
  ('tesery', 'Tesery', array['tesery.com'], 0.05, 'ACCESORIOSTESLA'),
  ('evdance', 'EVDANCE', array['evdances.com'], 0.20, 'EVEU20');

-- ---------------------------------------------------------------- chollos
create table public.chollos (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9-]{1,90}$'),
  tipo text not null check (tipo in ('oficial', 'comunidad')),
  autor uuid references public.perfiles (id) on delete set null,
  tienda text references public.tiendas (id),
  id_externo text unique,                        -- ASIN o id del catálogo antiguo (importación)
  titulo text not null check (char_length(titulo) between 5 and 200),
  descripcion text not null default '' check (char_length(descripcion) <= 2000),
  modelos text not null default '',
  enlace_original text not null,                 -- lo que pegó el usuario
  enlace text not null,                          -- el publicado (con el afiliado de Vic si aplica)
  foto text,
  precio_tienda integer not null check (precio_tienda > 0),
  precio_final integer not null check (precio_final > 0 and precio_final <= precio_tienda),
  desde boolean not null default false,
  fecha_precio date not null default current_date,
  estado text not null default 'pendiente' check (estado in ('pendiente', 'publicado', 'caducado', 'retirado')),
  caduca timestamptz,
  creado timestamptz not null default now(),
  actualizado timestamptz not null default now()
);

create index chollos_estado_creado on public.chollos (estado, creado desc);
create index chollos_tienda on public.chollos (tienda);
create index chollos_autor on public.chollos (autor);

-- ---------------------------------------------------------------- votos (temperatura)
create table public.votos (
  chollo_id bigint not null references public.chollos (id) on delete cascade,
  usuario_id uuid not null references public.perfiles (id) on delete cascade,
  valor smallint not null check (valor in (-1, 1)),
  creado timestamptz not null default now(),
  primary key (chollo_id, usuario_id)
);

-- ---------------------------------------------------------------- guardados
create table public.guardados (
  chollo_id bigint not null references public.chollos (id) on delete cascade,
  usuario_id uuid not null references public.perfiles (id) on delete cascade,
  creado timestamptz not null default now(),
  primary key (chollo_id, usuario_id)
);

-- ---------------------------------------------------------------- alertas
create table public.alertas (
  id bigint generated always as identity primary key,
  usuario_id uuid not null references public.perfiles (id) on delete cascade,
  palabra text check (palabra is null or char_length(palabra) between 2 and 60),
  tienda text references public.tiendas (id),
  modelo text,
  precio_max integer check (precio_max is null or precio_max > 0),
  email boolean not null default true,
  push boolean not null default false,
  creado timestamptz not null default now(),
  check (palabra is not null or tienda is not null or modelo is not null)
);

-- ---------------------------------------------------------------- reportes (aviso de la comunidad / denuncia DSA)
create table public.reportes (
  id bigint generated always as identity primary key,
  chollo_id bigint not null references public.chollos (id) on delete cascade,
  usuario_id uuid not null references public.perfiles (id) on delete cascade,
  motivo text not null check (motivo in ('precio', 'caducado', 'no_tesla', 'spam', 'ilegal', 'otro')),
  detalle text check (detalle is null or char_length(detalle) <= 1000),
  estado text not null default 'abierto' check (estado in ('abierto', 'aceptado', 'rechazado')),
  creado timestamptz not null default now(),
  unique (chollo_id, usuario_id, motivo)
);

-- ---------------------------------------------------------------- moderación (motivación, DSA art. 17)
create table public.moderacion (
  id bigint generated always as identity primary key,
  chollo_id bigint references public.chollos (id) on delete set null,
  admin_id uuid references public.perfiles (id) on delete set null,
  decision text not null check (decision in ('publicar', 'retirar', 'caducar', 'aviso', 'suspender')),
  motivo text not null check (char_length(motivo) between 5 and 2000),
  creado timestamptz not null default now()
);

-- ---------------------------------------------------------------- vista pública con temperatura
create view public.chollos_publicos
with (security_invoker = true) as
select
  c.id, c.slug, c.tipo, c.tienda, c.titulo, c.descripcion, c.modelos, c.enlace, c.foto,
  c.precio_tienda, c.precio_final, c.desde, c.fecha_precio, c.estado, c.caduca, c.creado,
  p.alias as autor_alias,
  coalesce((select sum(v.valor) from public.votos v where v.chollo_id = c.id), 0)::integer as temperatura
from public.chollos c
left join public.perfiles p on p.id = c.autor
where c.estado in ('publicado', 'caducado');

-- ================================================================ RLS
alter table public.perfiles enable row level security;
alter table public.tiendas enable row level security;
alter table public.chollos enable row level security;
alter table public.votos enable row level security;
alter table public.guardados enable row level security;
alter table public.alertas enable row level security;
alter table public.reportes enable row level security;
alter table public.moderacion enable row level security;

-- Permisos de tabla (RLS filtra filas; esto limita columnas y operaciones).
revoke all on all tables in schema public from anon, authenticated;
grant select on public.perfiles, public.tiendas, public.chollos, public.votos, public.chollos_publicos to anon, authenticated;
grant insert (id, alias) on public.perfiles to authenticated;
grant update (alias) on public.perfiles to authenticated;          -- el rol NO se puede cambiar desde el cliente
grant insert, update, delete on public.votos to authenticated;
grant select, insert, delete on public.guardados to authenticated;
grant select, insert, update, delete on public.alertas to authenticated;
grant select, insert on public.reportes to authenticated;
grant select on public.moderacion to authenticated;

-- perfiles: alias públicos; cada uno crea y edita solo el suyo.
create policy perfiles_leer on public.perfiles for select using (true);
create policy perfiles_crear on public.perfiles for insert to authenticated with check (id = auth.uid());
create policy perfiles_editar on public.perfiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- tiendas: lectura pública.
create policy tiendas_leer on public.tiendas for select using (true);

-- chollos: público lo publicado o caducado; el autor ve los suyos pendientes; el admin, todo.
-- Sin políticas de escritura: solo el servidor (service_role) crea y modifica chollos.
create policy chollos_leer on public.chollos for select
  using (estado in ('publicado', 'caducado') or autor = auth.uid() or public.es_admin());

-- votos: lectura pública (para la temperatura); cada uno gestiona su voto, solo en chollos publicados.
create policy votos_leer on public.votos for select using (true);
create policy votos_crear on public.votos for insert to authenticated
  with check (usuario_id = auth.uid() and exists (select 1 from public.chollos c where c.id = chollo_id and c.estado = 'publicado'));
create policy votos_cambiar on public.votos for update to authenticated
  using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy votos_borrar on public.votos for delete to authenticated using (usuario_id = auth.uid());

-- guardados y alertas: solo su dueño.
create policy guardados_propios on public.guardados for all to authenticated
  using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());
create policy alertas_propias on public.alertas for all to authenticated
  using (usuario_id = auth.uid()) with check (usuario_id = auth.uid());

-- reportes: cualquiera con cuenta reporta; ve los suyos; el admin, todos.
create policy reportes_crear on public.reportes for insert to authenticated with check (usuario_id = auth.uid());
create policy reportes_leer on public.reportes for select to authenticated using (usuario_id = auth.uid() or public.es_admin());

-- moderación: el admin ve todo; el autor ve las decisiones sobre sus chollos.
create policy moderacion_leer on public.moderacion for select to authenticated
  using (public.es_admin() or exists (select 1 from public.chollos c where c.id = chollo_id and c.autor = auth.uid()));
