// src/pages/api/noticias.ts
import type { APIRoute } from 'astro';
import { articulos, categorias, paises } from '../../db/schema';
import { eq, desc, and } from 'drizzle-orm';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const db = locals.db;

    const offset        = parseInt(url.searchParams.get('offset')    ?? '0');
    const limit         = parseInt(url.searchParams.get('limit')     ?? '10');
    const categoriaSlug = url.searchParams.get('categoria') ?? null;

    const conditions = [eq(articulos.publicado, true)];
    if (categoriaSlug) {
      conditions.push(eq(categorias.slug, categoriaSlug));
    }

    const data = await db
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
      .leftJoin(paises,     eq(articulos.paisId,      paises.id))
      .where(and(...conditions))
      .orderBy(desc(articulos.creadoEn))
      .limit(limit + 1)
      .offset(offset);

    const hayMas    = data.length > limit;
    const resultado = data.slice(0, limit).filter(
      a => !a.pais || a.pais.codigo === 'global'
    );

    return new Response(JSON.stringify({ ok: true, data: resultado, hayMas }), {
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('[/api/noticias]', error);
    return new Response(JSON.stringify({ ok: false, error: 'Error al obtener noticias' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};