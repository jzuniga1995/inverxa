import type { APIRoute } from 'astro';
import { fetchMetales } from '../../lib/metales';

export const GET: APIRoute = async ({ url, request }) => {
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  const cfCache = (caches as any).default;
  const cacheKey = new Request(`https://cache.local/metales?limit=${limit ?? 'all'}`, request);

  const cached = await cfCache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchMetales();
    const resultado = limit ? data.slice(0, limit) : data;

    const response = new Response(JSON.stringify({ ok: true, data: resultado }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=21600' },
    });

    await cfCache.put(cacheKey, response.clone());
    return response;

  } catch (error) {
    console.error('[/api/metales] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error al obtener precios de metales' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

