import type { Metadata } from "next";
import Link from "next/link";
import { AVISO_AMAZON } from "@chollesla/core";
import { Dato, Legal } from "@/components/Legal";
import { TITULAR } from "@/lib/titular";

export const metadata: Metadata = { title: "Aviso legal", alternates: { canonical: "/aviso-legal" } };

export default function AvisoLegal() {
  const t = TITULAR;
  return (
    <Legal titulo="Aviso legal">
      <h2>Titular</h2>
      <p>
        En cumplimiento del artículo 10 de la Ley 34/2002, de servicios de la sociedad de la información y de comercio
        electrónico (LSSI), se informa de que esta web, Chollesla, es de:
      </p>
      <ul>
        <li>
          Titular: <Dato valor={t.nombre} />
        </li>
        <li>
          NIF: <Dato valor={t.nif} />
        </li>
        <li>
          Dirección: <Dato valor={t.direccion} />
        </li>
        <li>
          Contacto (también punto de contacto para usuarios y autoridades, artículos 11 y 12 del Reglamento de Servicios
          Digitales): {t.email ? <a href={`mailto:${t.email}`}>{t.email}</a> : <Dato valor={null} />}
        </li>
      </ul>

      <h2>Qué es Chollesla</h2>
      <p>
        Chollesla recopila ofertas de accesorios para coches Tesla vendidos por tiendas de terceros. Chollesla no vende
        nada: la compra se hace siempre en la tienda, con sus condiciones, precios, envíos y garantías.
      </p>
      <p>
        Chollesla no es una web oficial de Tesla ni está relacionada con Tesla, Inc. «Tesla» y los nombres de sus modelos
        son marcas de sus propietarios y aquí solo se usan para indicar con qué coches son compatibles los accesorios.
      </p>

      <h2>Enlaces de afiliado</h2>
      <p>
        Los enlaces a las tiendas son de afiliado: si compras a través de ellos, Chollesla puede recibir una comisión, sin
        coste extra para ti. Esto no cambia el precio que pagas. {AVISO_AMAZON}
      </p>

      <h2>Precios</h2>
      <p>
        Mostramos el precio final después del código de descuento indicado y la fecha en que se comprobó. Las tiendas
        pueden cambiar precios, códigos y existencias en cualquier momento; el precio válido es el que muestra la tienda al
        comprar.
      </p>

      <h2>Propiedad intelectual</h2>
      <p>
        Los textos, el diseño y el logotipo de Chollesla son de su titular. Las fotos de producto pertenecen a las tiendas
        o a sus fabricantes y se muestran enlazadas desde las propias tiendas para identificar el producto.
      </p>

      <h2>Responsabilidad</h2>
      <p>
        Revisamos las ofertas con cuidado, pero no garantizamos que sigan disponibles ni respondemos de los productos o
        servicios de las tiendas. Si ves un contenido ilícito o erróneo, escríbenos al contacto de arriba y lo revisaremos
        cuanto antes.
      </p>

      <h2>Más información</h2>
      <p>
        Consulta también la <Link href="/privacidad">política de privacidad</Link> y la{" "}
        <Link href="/cookies">política de cookies</Link>. La legislación aplicable es la española.
      </p>
    </Legal>
  );
}
