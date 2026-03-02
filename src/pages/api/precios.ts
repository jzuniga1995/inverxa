import type { APIRoute } from 'astro';
export const GET: APIRoute = async ({ locals, request }) => {
  const env = (locals.runtime?.env as any);
const cache = (caches as any).default;
  const cacheKey = new Request('https://cache.local/precios', request);

  // Leer del caché
  const cached = await cache.match(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d`,
      { headers: { 'Accept': 'application/json', 'x-cg-demo-api-key': env?.COINGECKO_API_KEY } }
    );
    if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
 const raw = await res.json() as any[];
    const data = raw.map((c: any) => ({
      id: c.id, name: c.name, symbol: c.symbol.toUpperCase(),
      image: c.image, price: c.current_price,
      change24: c.price_change_percentage_24h ?? 0,
      change7: c.price_change_percentage_7d_in_currency ?? 0,
      marketCap: c.market_cap, volume: c.total_volume, rank: c.market_cap_rank,
    }));

    const response = Response.json(data, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=300', // 5 minutos
      }
    });

    // Guardar en caché compartido de Cloudflare
    await cache.put(cacheKey, response.clone());
    return response;

  } catch (e) {
    console.error('[API /precios]', e);
    return Response.json({ error: 'No se pudo obtener precios' }, { status: 503 });
  }
};

