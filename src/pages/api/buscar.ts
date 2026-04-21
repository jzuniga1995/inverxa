// src/pages/api/buscar.ts
export const prerender = false;
import type { APIRoute } from 'astro';
import { articulos, categorias, paises } from '../../db/schema';
import { eq, and, or, ilike, desc } from 'drizzle-orm';

export const GET: APIRoute = async ({ url, locals }) => {
  const q = url.searchParams.get('q')?.trim() ?? '';

  if (q.length < 2) {
    return new Response(JSON.stringify({ ok: true, data: [] }), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  }

  try {
    const db      = locals.db;
    const pattern = `%${q}%`;

    const resultados = await db
      .select({
        id:       articulos.id,
        titulo:   articulos.titulo,
        slug:     articulos.slug,
        resumen:  articulos.resumen,
        imagen:   articulos.imagen,
        creadoEn: articulos.creadoEn,
        categoria: { nombre: categorias.nombre, slug: categorias.slug },
      })
      .from(articulos)
      .leftJoin(categorias, eq(articulos.categoriaId, categorias.id))
      .leftJoin(paises, eq(articulos.paisId, paises.id))
      .where(
        and(
          eq(articulos.publicado, true),
          or(
            ilike(articulos.titulo,  pattern),
            ilike(articulos.resumen, pattern),
          )
        )
      )
      .orderBy(desc(articulos.creadoEn))
      .limit(8);

    return new Response(JSON.stringify({ ok: true, data: resultados }), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });
  } catch (error) {
    console.error('[/api/buscar] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error al buscar' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

