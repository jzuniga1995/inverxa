// src/pages/api/precios.ts
import type { APIRoute } from 'astro';

let cache: { data: any; timestamp: number } = { data: null, timestamp: 0 };
const CACHE_TTL = 300_000;

export const GET: APIRoute = async ({ locals }) => {
  const ahora = Date.now();

  if (cache.data && ahora - cache.timestamp < CACHE_TTL) {
    return Response.json(cache.data, { headers: { 'X-Cache': 'HIT' } });
  }

  try {
    // ← ÚNICO CAMBIO
    const COINGECKO_API_KEY = (locals.runtime?.env as any)?.COINGECKO_API_KEY;

    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d`,
      {
        headers: {
          'Accept': 'application/json',
          'x-cg-demo-api-key': COINGECKO_API_KEY,
        },
      }
    );

    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);

    const raw = await res.json();

    const data = raw.map((c: any) => ({
      id:        c.id,
      name:      c.name,
      symbol:    c.symbol.toUpperCase(),
      image:     c.image,
      price:     c.current_price,
      change24:  c.price_change_percentage_24h            ?? 0,
      change7:   c.price_change_percentage_7d_in_currency ?? 0,
      marketCap: c.market_cap,
      volume:    c.total_volume,
      rank:      c.market_cap_rank,
    }));

    cache = { data, timestamp: ahora };

    return Response.json(data, { headers: { 'X-Cache': 'MISS' } });

  } catch (e) {
    console.error('[API /precios]', e);

    if (cache.data) {
      return Response.json(cache.data, { headers: { 'X-Cache': 'STALE' } });
    }

    return Response.json({ error: 'No se pudo obtener precios' }, { status: 503 });
  }
};