export const prerender = false;
import type { APIRoute } from 'astro';
import { obtenerDolar } from '../../lib/dolar';

export const GET: APIRoute = async ({ url, locals }) => {
  const env = (locals.runtime?.env as any);
  const KV  = env?.INVERSA_KV as KVNamespace | undefined;

  const paisParam = url.searchParams.get('pais');
  const cacheKey  = `cache:dolar`;

  // 1. KV hit → instantáneo
  const cached = await KV?.get(cacheKey, 'json') as any[] | null;
  if (cached && cached.length > 0) {
    const resultado = paisParam ? cached.filter(p => p.codigo === paisParam) : cached;
    return new Response(JSON.stringify({ ok: true, data: resultado, cached: true }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=900' },
    });
  }

  // 2. KV vacío → llamar lib + guardar en KV 15 min
  try {
    const data = await obtenerDolar();
    await KV?.put(cacheKey, JSON.stringify(data), { expirationTtl: 900 });
    const resultado = paisParam ? data.filter(p => p.codigo === paisParam) : data;
    return new Response(JSON.stringify({ ok: true, data: resultado, cached: false }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=900' },
    });
  } catch (error) {
    console.error('[/api/dolar] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error al obtener precios del dólar' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
