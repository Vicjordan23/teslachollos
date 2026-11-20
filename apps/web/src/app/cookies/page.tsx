import type { Metadata } from "next";
import Link from "next/link";
import { Legal } from "@/components/Legal";

export const metadata: Metadata = { title: "Política de cookies", alternates: { canonical: "/cookies" } };

export default function Cookies() {
  return (
    <Legal titulo="Política de cookies">
      <p>
        <strong>Chollesla no instala cookies</strong> ni guarda nada en tu navegador para seguirte. Por eso no te
        mostramos ningún aviso de cookies.
      </p>
      <p>
        Si entras en tu cuenta, el navegador guarda tu sesión en su almacenamiento local (localStorage) para que no tengas
        que entrar en cada visita. Es estrictamente necesario para el servicio que pides y desaparece al cerrar sesión.
      </p>
      <p>
        Cloudflare, que aloja la web, puede usar cookies técnicas de seguridad (por ejemplo, para frenar bots) cuando
        detecta tráfico sospechoso. Son necesarias para el servicio y están exentas de consentimiento (art. 22.2 de la
        LSSI).
      </p>
      <p>
        Cuando pulsas «Ir al chollo», la tienda puede instalar sus propias cookies, incluidas las del programa de
        afiliados. Las gestiona la tienda con su propia política.
      </p>
      <p>
        Si algún día añadimos cookies que no sean técnicas (analítica o publicidad), actualizaremos
        esta página y, si hace falta, te pediremos permiso antes. Más información en la{" "}
        <Link href="/privacidad">política de privacidad</Link>.
      </p>
    </Legal>
  );
}
