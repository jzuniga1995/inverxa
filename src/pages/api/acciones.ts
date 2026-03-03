import type { APIRoute } from 'astro';
import { fetchAcciones } from '../../lib/acciones';
import type { AccionData } from '../../lib/acciones';

export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals.runtime?.env as any);
  const KV: KVNamespace = env?.INVERSA_KV;

  if (!env?.FINNHUB_API_KEY) {
    return new Response(
      JSON.stringify({ ok: false, error: 'FINNHUB_API_KEY no configurada' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  const cached = await KV?.get('acciones', 'json') as AccionData[] | null;
  if (cached) {
    const data = limit ? cached.slice(0, limit) : cached;
    return new Response(JSON.stringify({ ok: true, data, cached: true }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
    });
  }

  try {
    const data = await fetchAcciones(env.FINNHUB_API_KEY);
    await KV?.put('acciones', JSON.stringify(data), { expirationTtl: 7200 });
    const resultado = limit ? data.slice(0, limit) : data;
    return new Response(JSON.stringify({ ok: true, data: resultado, cached: false }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (error) {
    console.error('[/api/acciones] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error al obtener cotizaciones' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};