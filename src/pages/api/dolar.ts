import type { APIRoute } from 'astro';
import { obtenerDolar } from '../../lib/dolar';

export const GET: APIRoute = async ({ url, request }) => {
  const paisParam = url.searchParams.get('pais');

  const cfCache = (caches as any).default;
  const cacheKey = new Request(`https://cache.local/dolar?pais=${paisParam ?? 'all'}`, request);

  const cached = await cfCache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await obtenerDolar();
    const resultado = paisParam ? data.filter(p => p.codigo === paisParam) : data;

    const response = new Response(JSON.stringify({ ok: true, data: resultado }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=900' },
    });

    await cfCache.put(cacheKey, response.clone());
    return response;

  } catch (error) {
    console.error('[/api/dolar] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error al obtener precios del dólar' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
