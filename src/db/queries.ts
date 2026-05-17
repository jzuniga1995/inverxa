// src/db/queries.ts
import { articulos, categorias, paises } from './schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import type { getDb } from './index';

type Db = ReturnType<typeof getDb>;

// Module-level cache: in Cloudflare Workers, module scope persists within
// the same isolation instance, so repeated requests to the same worker
// instance skip the DB round-trip for rarely-changing tables.
const _cache = new Map<string, { data: unknown; expiresAt: number }>();
const STATIC_TTL = 5 * 60 * 1000; // 5 minutes

async function cached<T>(key: string, fn: () => Promise<T>): Promise<T> {
  const now = Date.now();
  const hit = _cache.get(key);
  if (hit && hit.expiresAt > now) return hit.data as T;
  const data = await fn();
  _cache.set(key, { data, expiresAt: now + STATIC_TTL });
  return data;
}

export async function getArticulos(db: Db, limit = 20, offset = 0) {
  return db
    .select({
      id:        articulos.id,
      titulo:    articulos.titulo,
      slug:      articulos.slug,
      resumen:   articulos.resumen,
      imagen:    articulos.imagen,
      destacado: articulos.destacado,
      creadoEn:  articulos.creadoEn,
      categoria: { nombre: categorias.nombre, slug: categorias.slug },
      pais:      { nombre: paises.nombre, codigo: paises.codigo },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(eq(articulos.publicado, true))
    .orderBy(desc(articulos.creadoEn))
    .limit(limit)
    .offset(offset);
}

export async function getArticuloPorSlug(db: Db, slug: string) {
  const resultado = await db
    .select({
      id:            articulos.id,
      titulo:        articulos.titulo,
      slug:          articulos.slug,
      resumen:       articulos.resumen,
      contenido:     articulos.contenido,
      imagen:        articulos.imagen,
      destacado:     articulos.destacado,
      creadoEn:      articulos.creadoEn,
      actualizadoEn: articulos.actualizadoEn,
      categoria: { nombre: categorias.nombre, slug: categorias.slug },
      pais:      { nombre: paises.nombre, codigo: paises.codigo },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(and(eq(articulos.slug, slug), eq(articulos.publicado, true)))
    .limit(1);

  return resultado[0] ?? null;
}

export async function getArticulosPorCategoria(db: Db, categoriaSlug: string, limit = 20) {
  return db
    .select({
      id:        articulos.id,
      titulo:    articulos.titulo,
      slug:      articulos.slug,
      resumen:   articulos.resumen,
      imagen:    articulos.imagen,
      destacado: articulos.destacado,
      creadoEn:  articulos.creadoEn,
      categoria: { nombre: categorias.nombre, slug: categorias.slug },
      pais:      { nombre: paises.nombre, codigo: paises.codigo },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(and(eq(categorias.slug, categoriaSlug), eq(articulos.publicado, true)))
    .orderBy(desc(articulos.creadoEn))
    .limit(limit);
}

export async function getArticulosPorPais(db: Db, paisCodigo: string, limit = 20) {
  return db
    .select({
      id:        articulos.id,
      titulo:    articulos.titulo,
      slug:      articulos.slug,
      resumen:   articulos.resumen,
      imagen:    articulos.imagen,
      destacado: articulos.destacado,
      creadoEn:  articulos.creadoEn,
      categoria: { nombre: categorias.nombre, slug: categorias.slug },
      pais:      { nombre: paises.nombre, codigo: paises.codigo },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(and(eq(paises.codigo, paisCodigo), eq(articulos.publicado, true)))
    .orderBy(desc(articulos.creadoEn))
    .limit(limit);
}

export async function getArticulosDestacados(db: Db, limit = 5) {
  return db
    .select({
      id:        articulos.id,
      titulo:    articulos.titulo,
      slug:      articulos.slug,
      resumen:   articulos.resumen,
      imagen:    articulos.imagen,
      creadoEn:  articulos.creadoEn,
      categoria: { nombre: categorias.nombre, slug: categorias.slug },
      pais:      { nombre: paises.nombre, codigo: paises.codigo },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(and(eq(articulos.destacado, true), eq(articulos.publicado, true)))
    .orderBy(desc(articulos.creadoEn))
    .limit(limit);
}

export async function getArticulosPorCategorias(
  db: Db,
  slugs: string[],
  limitPorCategoria = 4,
): Promise<Record<string, Awaited<ReturnType<typeof getArticulosPorCategoria>>>> {
  if (slugs.length === 0) return {};

  const rows = await db
    .select({
      id:        articulos.id,
      titulo:    articulos.titulo,
      slug:      articulos.slug,
      resumen:   articulos.resumen,
      imagen:    articulos.imagen,
      destacado: articulos.destacado,
      creadoEn:  articulos.creadoEn,
      categoria: { nombre: categorias.nombre, slug: categorias.slug },
      pais:      { nombre: paises.nombre, codigo: paises.codigo },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(and(inArray(categorias.slug, slugs), eq(articulos.publicado, true)))
    .orderBy(desc(articulos.creadoEn))
    .limit(limitPorCategoria * slugs.length * 3);

  const agrupado: Record<string, typeof rows> = {};
  for (const row of rows) {
    const catSlug = row.categoria?.slug;
    if (!catSlug) continue;
    if (!agrupado[catSlug]) agrupado[catSlug] = [];
    if (agrupado[catSlug].length < limitPorCategoria) {
      agrupado[catSlug].push(row);
    }
  }
  return agrupado;
}

export async function getCategorias(db: Db) {
  return cached('categorias', () => db.select().from(categorias).orderBy(categorias.nombre));
}

export async function getPaises(db: Db) {
  return cached('paises', () => db.select().from(paises).orderBy(paises.nombre));
}

