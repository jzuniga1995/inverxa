export const prerender = false;
import type { APIRoute } from 'astro';
import { fetchPrecios } from '../../lib/precios';

export const GET: APIRoute = async ({ locals }) => {
  const env = (locals.runtime?.env as any);
  const KV  = env?.INVERSA_KV as KVNamespace | undefined;

  // 1. KV hit → instantáneo
  const cached = await KV?.get('cache:precios', 'json') as any[] | null;
  if (cached && cached.length > 0) {
    return Response.json(cached, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  }

  // 2. KV vacío → llamar lib + guardar en KV
  try {
    const data = await fetchPrecios(env?.COINGECKO_API_KEY);
    await KV?.put('cache:precios', JSON.stringify(data), { expirationTtl: 3600 });
    return Response.json(data, {
      headers: { 'Cache-Control': 'public, max-age=300' },
    });
  } catch (e) {
    console.error('[API /precios]', e);
    return Response.json({ error: 'No se pudo obtener precios' }, { status: 503 });
  }
};
