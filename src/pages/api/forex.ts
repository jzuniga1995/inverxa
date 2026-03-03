import type { APIRoute } from 'astro';
import { obtenerForex } from '../../lib/forex';
import type { ForexData } from '../../lib/forex';

export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals.runtime?.env as any);
  const KV  = env?.INVERSA_KV as KVNamespace | undefined;

  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  // 1. KV hit → respuesta instantánea
  const cached = await KV?.get('cache:forex', 'json') as ForexData[] | null;
  if (cached && cached.length > 0) {
    const data = limit ? cached.slice(0, limit) : cached;
    return new Response(JSON.stringify({ ok: true, data, cached: true }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
    });
  }

  // 2. KV vacío → llamar lib directamente + guardar en KV para próximas visitas
  try {
    const data = await obtenerForex();
    await KV?.put('cache:forex', JSON.stringify(data), { expirationTtl: 3600 });
    const resultado = limit ? data.slice(0, limit) : data;
    return new Response(JSON.stringify({ ok: true, data: resultado, cached: false }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=3600' },
    });
  } catch (error) {
    console.error('[/api/forex] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error al obtener cotizaciones forex' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

