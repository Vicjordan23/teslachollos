import type { Metadata } from "next";
import Link from "next/link";
import { Legal } from "@/components/Legal";

export const metadata: Metadata = { title: "Condiciones de uso", alternates: { canonical: "/condiciones" } };

export default function Condiciones() {
  return (
    <Legal titulo="Condiciones de uso">
      <p>
        Chollesla es gratuita. Ver chollos no necesita cuenta. Con una cuenta puedes votar, guardar, crear alertas, reportar y
        publicar chollos. Al crearla aceptas estas condiciones.
      </p>

      <h2>Tu cuenta</h2>
      <ul>
        <li>Debes tener al menos 14 años. Una cuenta por persona.</li>
        <li>Tu alias es público. No uses el nombre de otra persona, marcas ajenas ni alias ofensivos.</li>
        <li>Puedes dejar de usarla cuando quieras y pedir que la borremos (ver el aviso legal).</li>
      </ul>

      <h2>Publicar chollos</h2>
      <ul>
        <li>Solo accesorios y productos para coches Tesla, de las tiendas admitidas.</li>
        <li>El precio y los datos deben ser reales en el momento de publicar. No publiques productos falsificados, peligrosos o ilegales.</li>
        <li>
          Los enlaces se publican con el enlace de afiliado de Chollesla: si alguien compra, Chollesla puede ganar una
          comisión. Tú no recibes pago por publicar.
        </li>
        <li>Al publicar nos das permiso para mostrar el texto que escribes en Chollesla y en sus canales.</li>
        <li>Los primeros chollos de cada persona se revisan antes de publicarse. Máximo 5 al día.</li>
      </ul>

      <h2>Votos y reportes</h2>
      <ul>
        <li>Vota con honestidad. No uses varias cuentas ni bots para subir o bajar la temperatura.</li>
        <li>
          Reporta los chollos con precios incorrectos, caducados o contenido ilegal con el botón «Reportar» de cada chollo, o
          escribiendo al contacto del <Link href="/aviso-legal">aviso legal</Link>.
        </li>
      </ul>

      <h2>Moderación</h2>
      <p>
        Podemos retirar chollos, caducarlos o suspender cuentas que incumplan estas condiciones. Cuando lo hagamos te
        explicaremos el motivo, y puedes responder a ese aviso si crees que es un error (Reglamento de Servicios Digitales,
        art. 17).
      </p>

      <h2>Responsabilidad</h2>
      <p>
        Los chollos de la comunidad los publica cada persona. Chollesla no vende los productos ni garantiza precios ni
        existencias; la compra es siempre con la tienda.
      </p>
      <p>
        Ver también la <Link href="/privacidad">política de privacidad</Link>.
      </p>
    </Legal>
  );
}
