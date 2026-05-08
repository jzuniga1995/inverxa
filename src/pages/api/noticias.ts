// src/pages/api/noticias.ts
// Lee desde KV (cache:noticias). Neon solo lo toca el cron inversa-cron-noticias.
export const prerender = false;
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const KV = (locals.runtime?.env as any)?.INVERSA_KV as KVNamespace | undefined;

    const offset        = Math.max(0, parseInt(url.searchParams.get('offset') ?? '0', 10));
    const limit         = Math.max(1, Math.min(50, parseInt(url.searchParams.get('limit') ?? '10', 10)));
    const categoriaSlug = url.searchParams.get('categoria') ?? null;

    const todos = (await KV?.get('cache:noticias', 'json') as any[] | null) ?? [];

    const filtrados = categoriaSlug
      ? todos.filter((a: any) => a.categoria?.slug === categoriaSlug)
      : todos;

    const pagina = filtrados.slice(offset, offset + limit + 1);
    const hayMas = pagina.length > limit;
    const data   = pagina.slice(0, limit);

    return new Response(JSON.stringify({ ok: true, data, hayMas }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=300, s-maxage=300',
      },
    });

  } catch (error) {
    console.error('[/api/noticias]', error);
    return new Response(JSON.stringify({ ok: false, error: 'Error al obtener noticias' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
