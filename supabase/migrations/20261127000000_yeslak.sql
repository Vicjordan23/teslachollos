-- Chollesla: Yeslak como tienda del programa de Vic (GoAffPro, ?ref=Chollesla, codigo VICTORMARTINJUA 15 %).
insert into public.tiendas (id, nombre, dominios, descuento, codigo)
values ('yeslak', 'Yeslak', array['yeslak.com'], 0.15, 'VICTORMARTINJUA')
on conflict (id) do nothing;
