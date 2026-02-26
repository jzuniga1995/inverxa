// src/db/queries.ts
import { db } from './index';
import { articulos, categorias, paises } from './schema';
import { eq, desc, and, like } from 'drizzle-orm';

// ─── ARTÍCULOS ────────────────────────────────────────────────

// Todos los artículos publicados (para la home y listados)
export async function getArticulos(limit = 20) {
  return db
    .select({
      id:         articulos.id,
      titulo:     articulos.titulo,
      slug:       articulos.slug,
      resumen:    articulos.resumen,
      imagen:     articulos.imagen,
      destacado:  articulos.destacado,
      creadoEn:   articulos.creadoEn,
      categoria: {
        nombre: categorias.nombre,
        slug:   categorias.slug,
      },
      pais: {
        nombre: paises.nombre,
        codigo: paises.codigo,
      },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(eq(articulos.publicado, true))
    .orderBy(desc(articulos.creadoEn))
    .limit(limit);
}

// Un artículo por slug (para la página individual)
export async function getArticuloPorSlug(slug: string) {
  const resultado = await db
    .select({
      id:          articulos.id,
      titulo:      articulos.titulo,
      slug:        articulos.slug,
      resumen:     articulos.resumen,
      contenido:   articulos.contenido,
      imagen:      articulos.imagen,
      destacado:   articulos.destacado,
      creadoEn:    articulos.creadoEn,
      actualizadoEn: articulos.actualizadoEn,
      categoria: {
        nombre: categorias.nombre,
        slug:   categorias.slug,
      },
      pais: {
        nombre: paises.nombre,
        codigo: paises.codigo,
      },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(and(eq(articulos.slug, slug), eq(articulos.publicado, true)))
    .limit(1);

  return resultado[0] ?? null;
}

// Artículos por categoría
export async function getArticulosPorCategoria(categoriaSlug: string, limit = 20) {
  return db
    .select({
      id:        articulos.id,
      titulo:    articulos.titulo,
      slug:      articulos.slug,
      resumen:   articulos.resumen,
      imagen:    articulos.imagen,
      destacado: articulos.destacado,
      creadoEn:  articulos.creadoEn,
      categoria: {
        nombre: categorias.nombre,
        slug:   categorias.slug,
      },
      pais: {
        nombre: paises.nombre,
        codigo: paises.codigo,
      },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(and(eq(categorias.slug, categoriaSlug), eq(articulos.publicado, true)))
    .orderBy(desc(articulos.creadoEn))
    .limit(limit);
}

// Artículos por país
export async function getArticulosPorPais(paisCodigo: string, limit = 20) {
  return db
    .select({
      id:        articulos.id,
      titulo:    articulos.titulo,
      slug:      articulos.slug,
      resumen:   articulos.resumen,
      imagen:    articulos.imagen,
      destacado: articulos.destacado,
      creadoEn:  articulos.creadoEn,
      categoria: {
        nombre: categorias.nombre,
        slug:   categorias.slug,
      },
      pais: {
        nombre: paises.nombre,
        codigo: paises.codigo,
      },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(and(eq(paises.codigo, paisCodigo), eq(articulos.publicado, true)))
    .orderBy(desc(articulos.creadoEn))
    .limit(limit);
}

// Artículos destacados (para el hero de la home)
export async function getArticulosDestacados(limit = 5) {
  return db
    .select({
      id:        articulos.id,
      titulo:    articulos.titulo,
      slug:      articulos.slug,
      resumen:   articulos.resumen,
      imagen:    articulos.imagen,
      creadoEn:  articulos.creadoEn,
      categoria: {
        nombre: categorias.nombre,
        slug:   categorias.slug,
      },
      pais: {
        nombre: paises.nombre,
        codigo: paises.codigo,
      },
    })
    .from(articulos)
    .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
    .leftJoin(paises, eq(articulos.paisId, paises.id))
    .where(and(eq(articulos.destacado, true), eq(articulos.publicado, true)))
    .orderBy(desc(articulos.creadoEn))
    .limit(limit);
}

// ─── CATEGORÍAS Y PAÍSES ──────────────────────────────────────

export async function getCategorias() {
  return db.select().from(categorias).orderBy(categorias.nombre);
}

export async function getPaises() {
  return db.select().from(paises).orderBy(paises.nombre);
}

