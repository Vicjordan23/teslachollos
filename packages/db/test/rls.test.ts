import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, describe, expect, it } from "vitest";

const aqui = dirname(fileURLToPath(import.meta.url));
const migraciones = join(aqui, "..", "..", "..", "supabase", "migrations");

const ANA = "00000000-0000-0000-0000-00000000000a";
const BEA = "00000000-0000-0000-0000-00000000000b";
const ADMIN = "00000000-0000-0000-0000-0000000000ad";

let db: PGlite;

/** Ejecuta como un rol de Supabase (anon / authenticated) con un usuario concreto. */
async function como<T>(rol: "anon" | "authenticated", usuario: string | null, fn: () => Promise<T>): Promise<T> {
  await db.exec(`set role ${rol}; select set_config('request.jwt.claim.sub', '${usuario ?? ""}', false);`);
  try {
    return await fn();
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`);
  }
}

beforeAll(async () => {
  db = new PGlite();
  await db.exec(readFileSync(join(aqui, "prelude-supabase.sql"), "utf8"));
  for (const f of readdirSync(migraciones).sort()) await db.exec(readFileSync(join(migraciones, f), "utf8"));

  // Datos de prueba como superusuario (equivale al servidor con service_role).
  await db.exec(`
    insert into auth.users (id) values ('${ANA}'), ('${BEA}'), ('${ADMIN}');
    insert into public.perfiles (id, alias, rol) values ('${ANA}', 'ana', 'usuario'), ('${BEA}', 'bea', 'usuario'), ('${ADMIN}', 'vic', 'admin');
    insert into public.chollos (slug, tipo, autor, tienda, titulo, enlace_original, enlace, precio_tienda, precio_final, estado) values
      ('publicado', 'oficial', '${ADMIN}', 'amazon', 'Protector de pantalla', 'https://amazon.es/dp/B0GY6GB73J', 'https://www.amazon.es/dp/B0GY6GB73J?tag=teslaaccesorios-21', 4199, 4199, 'publicado'),
      ('pendiente-de-ana', 'comunidad', '${ANA}', 'hansshow', 'Soporte de pantalla', 'https://hansshow.com/products/x', 'https://hansshow.com/products/x?bg_ref=nBeGMuizu9', 11495, 9196, 'pendiente'),
      ('retirado', 'comunidad', '${BEA}', null, 'Chollo retirado por spam', 'https://ejemplo.com/x', 'https://ejemplo.com/x', 1000, 1000, 'retirado');
  `);
}, 60_000); // arrancar Postgres en WebAssembly tarda varios segundos

const idDe = async (slug: string) =>
  (await db.query<{ id: number }>(`select id from public.chollos where slug = $1`, [slug])).rows[0]!.id;

describe("lectura pública", () => {
  it("sin cuenta solo se ven los chollos publicados", async () => {
    const r = await como("anon", null, () => db.query<{ slug: string }>(`select slug from public.chollos order by slug`));
    expect(r.rows.map((x) => x.slug)).toEqual(["publicado"]);
  });

  it("el autor ve también su chollo pendiente, pero no el retirado de otra persona", async () => {
    const r = await como("authenticated", ANA, () => db.query<{ slug: string }>(`select slug from public.chollos order by slug`));
    expect(r.rows.map((x) => x.slug)).toEqual(["pendiente-de-ana", "publicado"]);
  });

  it("el admin lo ve todo", async () => {
    const r = await como("authenticated", ADMIN, () => db.query(`select 1 from public.chollos`));
    expect(r.rows).toHaveLength(3);
  });
});

describe("chollos: solo el servidor escribe", () => {
  it("un usuario no puede insertar un chollo (ni colar su afiliado)", async () => {
    await expect(
      como("authenticated", ANA, () =>
        db.query(
          `insert into public.chollos (slug, tipo, autor, titulo, enlace_original, enlace, precio_tienda, precio_final, estado)
           values ('trampa', 'comunidad', '${ANA}', 'Mi chollo', 'https://amazon.es/dp/X', 'https://amazon.es/dp/X?tag=ana-21', 100, 100, 'publicado')`,
        ),
      ),
    ).rejects.toThrow(/permission denied/);
  });

  it("un usuario no puede cambiar el estado ni el enlace de su chollo", async () => {
    await expect(
      como("authenticated", ANA, () => db.query(`update public.chollos set estado = 'publicado' where slug = 'pendiente-de-ana'`)),
    ).rejects.toThrow(/permission denied/);
  });
});

describe("votos (temperatura)", () => {
  it("un usuario vota una vez por chollo y la vista suma la temperatura", async () => {
    const id = await idDe("publicado");
    await como("authenticated", ANA, () => db.query(`insert into public.votos (chollo_id, usuario_id, valor) values ($1, $2, 1)`, [id, ANA]));
    await como("authenticated", BEA, () => db.query(`insert into public.votos (chollo_id, usuario_id, valor) values ($1, $2, -1)`, [id, BEA]));
    await como("authenticated", ADMIN, () => db.query(`insert into public.votos (chollo_id, usuario_id, valor) values ($1, $2, 1)`, [id, ADMIN]));
    await expect(
      como("authenticated", ANA, () => db.query(`insert into public.votos (chollo_id, usuario_id, valor) values ($1, $2, 1)`, [id, ANA])),
    ).rejects.toThrow(/duplicate key/);

    const r = await como("anon", null, () =>
      db.query<{ temperatura: number }>(`select temperatura from public.chollos_publicos where slug = 'publicado'`),
    );
    expect(r.rows[0]!.temperatura).toBe(1);
  });

  it("no se puede votar en nombre de otra persona, ni con valores distintos de ±1, ni sin cuenta", async () => {
    const id = await idDe("publicado");
    await expect(
      como("authenticated", ANA, () => db.query(`insert into public.votos (chollo_id, usuario_id, valor) values ($1, $2, 1)`, [id, "00000000-0000-0000-0000-0000000000ff"])),
    ).rejects.toThrow(/row-level security|violates/);
    await expect(
      como("authenticated", BEA, () => db.query(`update public.votos set valor = 5 where usuario_id = $1`, [BEA])),
    ).rejects.toThrow(/check constraint/);
    await expect(
      como("anon", null, () => db.query(`insert into public.votos (chollo_id, usuario_id, valor) values ($1, $2, 1)`, [id, ANA])),
    ).rejects.toThrow(/permission denied/);
  });

  it("no se puede votar un chollo pendiente", async () => {
    const id = await idDe("pendiente-de-ana");
    await expect(
      como("authenticated", BEA, () => db.query(`insert into public.votos (chollo_id, usuario_id, valor) values ($1, $2, 1)`, [id, BEA])),
    ).rejects.toThrow(/row-level security/);
  });
});

describe("perfiles", () => {
  it("nadie puede hacerse admin desde el cliente", async () => {
    await expect(
      como("authenticated", ANA, () => db.query(`update public.perfiles set rol = 'admin' where id = $1`, [ANA])),
    ).rejects.toThrow(/permission denied/);
  });

  it("cada uno cambia solo su alias", async () => {
    await como("authenticated", ANA, () => db.query(`update public.perfiles set alias = 'ana_tesla' where id = $1`, [ANA]));
    const otro = await como("authenticated", ANA, () => db.query(`update public.perfiles set alias = 'pirata' where id = $1`, [BEA]));
    expect(otro.affectedRows).toBe(0);
    const r = await db.query<{ alias: string }>(`select alias from public.perfiles order by alias`);
    expect(r.rows.map((x) => x.alias)).toEqual(["ana_tesla", "bea", "vic"]);
  });
});

describe("guardados, alertas y reportes son privados", () => {
  it("cada usuario solo ve lo suyo", async () => {
    const id = await idDe("publicado");
    await como("authenticated", ANA, async () => {
      await db.query(`insert into public.guardados (chollo_id, usuario_id) values ($1, $2)`, [id, ANA]);
      await db.query(`insert into public.alertas (usuario_id, palabra) values ($1, 'alfombrillas')`, [ANA]);
      await db.query(`insert into public.reportes (chollo_id, usuario_id, motivo) values ($1, $2, 'precio')`, [id, ANA]);
    });
    const deBea = await como("authenticated", BEA, async () => ({
      guardados: (await db.query(`select 1 from public.guardados`)).rows.length,
      alertas: (await db.query(`select 1 from public.alertas`)).rows.length,
      reportes: (await db.query(`select 1 from public.reportes`)).rows.length,
    }));
    expect(deBea).toEqual({ guardados: 0, alertas: 0, reportes: 0 });
    const reportesAdmin = await como("authenticated", ADMIN, () => db.query(`select 1 from public.reportes`));
    expect(reportesAdmin.rows).toHaveLength(1);
  });

  it("sin cuenta no se ven alertas ni reportes", async () => {
    await expect(como("anon", null, () => db.query(`select 1 from public.alertas`))).rejects.toThrow(/permission denied/);
    await expect(como("anon", null, () => db.query(`select 1 from public.reportes`))).rejects.toThrow(/permission denied/);
  });
});
