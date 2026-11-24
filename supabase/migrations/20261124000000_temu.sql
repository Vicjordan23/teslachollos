-- Chollesla: Temu como tienda del programa de Vic (enlaces cortos de afiliado temu.to/k/...).
insert into public.tiendas (id, nombre, dominios, descuento, codigo)
values ('temu', 'Temu', array['temu.to'], 0, null)
on conflict (id) do nothing;
