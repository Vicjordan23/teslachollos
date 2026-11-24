import type { Metadata } from "next";
import Link from "next/link";
import { Dato, Legal } from "@/components/Legal";
import { TITULAR } from "@/lib/titular";

export const metadata: Metadata = { title: "Política de privacidad", alternates: { canonical: "/privacidad" } };

export default function Privacidad() {
  const t = TITULAR;
  return (
    <Legal titulo="Política de privacidad">
      <p>
        Chollesla se puede usar <strong>sin cuenta y sin dar ningún dato personal</strong>. Si creas una cuenta, tratamos
        los datos que se explican abajo.
      </p>

      <h2>Responsable</h2>
      <p>
        <Dato valor={t.nombre} /> (NIF <Dato valor={t.nif} />), contacto:{" "}
        {t.email ? <a href={`mailto:${t.email}`}>{t.email}</a> : <Dato valor={null} />}.
      </p>

      <h2>Qué datos se tratan</h2>
      <ul>
        <li>
          <strong>Datos técnicos de la conexión</strong> (dirección IP, navegador, página pedida y hora). Los trata
          Cloudflare, que aloja la web, para servirla y protegerla de ataques. Base legal: interés legítimo en que la web
          funcione y sea segura (art. 6.1.f del RGPD).
        </li>
        <li>
          <strong>Clics en «Ir al chollo»</strong>: se anota qué chollo, qué tienda y el día, sin la IP ni ningún
          identificador tuyo, para saber qué ofertas interesan. Son recuentos sin datos personales y se conservan para
          las estadísticas de la web. Los registros técnicos del servidor se borran automáticamente en pocos días.
        </li>
        <li>
          <strong>Fotos de producto</strong>: se cargan directamente desde los servidores de Amazon y Shopify, que
          reciben tu IP al mostrarlas, como en cualquier imagen enlazada.
        </li>
        <li>
          <strong>Si creas una cuenta</strong>: tu email (para entrar con un enlace y para las alertas), tu alias público, tus
          votos, guardados, alertas, reportes y los chollos que publicas. Base legal: la ejecución de las condiciones de uso
          que aceptas (art. 6.1.b del RGPD). Se conservan mientras tengas la cuenta; si pides borrarla, se eliminan, salvo
          lo que haya que guardar por ley.
        </li>
        <li>
          <strong>Emails de alertas</strong>: solo si creas alertas. Puedes borrarlas cuando quieras en la página de
          alertas.
        </li>
      </ul>
      <p>No usamos cookies publicitarias, analítica con cookies ni perfiles. No vendemos ni cedemos datos.</p>

      <h2>Al salir a una tienda</h2>
      <p>
        Al pulsar «Ir al chollo» pasas a la web de la tienda (Amazon, AliExpress, Temu, Jowua, Hansshow, Tesery u otras). Desde
        ese momento se aplica su política de privacidad y de cookies; el enlace de afiliado les indica que vienes de
        Chollesla.
      </p>

      <h2>Encargados y transferencias</h2>
      <ul>
        <li>
          Cloudflare, Inc. aloja la web. Es una empresa de EE. UU. adherida al Marco de Privacidad de Datos UE-EE. UU. y
          que ofrece cláusulas contractuales tipo de la Comisión Europea.
        </li>
        <li>Supabase guarda las cuentas y sus datos en servidores de la UE (Fráncfort, Alemania).</li>
        <li>
          Los emails (enlace para entrar y alertas) se envían a través de un proveedor de envío de correo con contrato de
          encargo y garantías del RGPD.
        </li>
      </ul>

      <h2>Tus derechos</h2>
      <p>
        Puedes pedir acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo al contacto de
        arriba. Si crees que no se han respetado, puedes reclamar ante la Agencia Española de Protección de Datos
        (aepd.es).
      </p>
      <p>
        Ver también: <Link href="/cookies">política de cookies</Link> y <Link href="/aviso-legal">aviso legal</Link>.
      </p>
    </Legal>
  );
}
