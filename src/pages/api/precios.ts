import type { APIRoute } from 'astro';
import { fetchPrecios } from '../../lib/precios';

export const GET: APIRoute = async ({ request, locals }) => {
  const env = (locals.runtime?.env as any);
  const cache = (caches as any).default;
  const cacheKey = new Request('https://cache.local/precios', request);

  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchPrecios(env?.COINGECKO_API_KEY);

    const response = Response.json(data, {
      headers: { 'Cache-Control': 'public, max-age=300' }
    });

    await cache.put(cacheKey, response.clone());
    return response;

  } catch (e) {
    console.error('[API /precios]', e);
    return Response.json({ error: 'No se pudo obtener precios' }, { status: 503 });
  }
};

