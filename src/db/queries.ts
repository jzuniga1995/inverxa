// src/db/queries.ts
import { articulos, categorias, paises } from './schema';
import { eq, desc, and } from 'drizzle-orm';
import type { getDb } from './index';

type Db = ReturnType<typeof getDb>;

export async function getArticulos(db: Db, limit = 20) {
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
    .limit(limit);
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

export async function getCategorias(db: Db) {
  return db.select().from(categorias).orderBy(categorias.nombre);
}

export async function getPaises(db: Db) {
  return db.select().from(paises).orderBy(paises.nombre);
}

