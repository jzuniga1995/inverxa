// src/pages/api/buscar.ts
// Búsqueda en memoria sobre cache:noticias (KV). Neon no interviene en runtime.
export const prerender = false;
import type { APIRoute } from 'astro';

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
    const KV   = (locals.runtime?.env as any)?.INVERSA_KV as KVNamespace | undefined;
    const todos = (await KV?.get('cache:noticias', 'json') as any[] | null) ?? [];

    const qLower = q.toLowerCase();
    const data = todos
      .filter((a: any) =>
        a.titulo?.toLowerCase().includes(qLower) ||
        a.resumen?.toLowerCase().includes(qLower)
      )
      .slice(0, 8)
      .map((a: any) => ({
        id:       a.id,
        titulo:   a.titulo,
        slug:     a.slug,
        resumen:  a.resumen,
        imagen:   a.imagen,
        creadoEn: a.creadoEn,
        categoria: a.categoria,
      }));

    return new Response(JSON.stringify({ ok: true, data }), {
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
