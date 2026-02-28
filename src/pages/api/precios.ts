// src/pages/api/precios.ts
import type { APIRoute } from 'astro';

// ── Caché en memoria del servidor ──────────────────────────────
// Una sola llamada a CoinGecko cada 5 min = 8,640/mes
// Aguanta tráfico ilimitado — todos los usuarios comparten la misma caché
let cache: { data: any; timestamp: number } = { data: null, timestamp: 0 };
const CACHE_TTL = 300_000; // 5 minutos

export const GET: APIRoute = async () => {
  const ahora = Date.now();

  // ¿Caché válida? → devuelve sin llamar a CoinGecko
  if (cache.data && ahora - cache.timestamp < CACHE_TTL) {
    return Response.json(cache.data, {
      headers: { 'X-Cache': 'HIT' },
    });
  }

  // Caché expirada → llama a CoinGecko
  try {
    const COINGECKO_API_KEY = import.meta.env.COINGECKO_API_KEY;

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

    // Incluye todos los campos necesarios para todos los componentes:
    // Header ticker → symbol, price, change24
    // Hero card     → id, symbol, name, price, change24
    // Home tabla    → id, symbol, name, image, price, change24, marketCap
    // Página cripto → todos los campos
    // Cripto slug   → filtra por id
    const data = raw.map((c: any) => ({
      id:        c.id,
      name:      c.name,
      symbol:    c.symbol.toUpperCase(),
      image:     c.image,
      price:     c.current_price,
      change24:  c.price_change_percentage_24h         ?? 0,
      change7:   c.price_change_percentage_7d_in_currency ?? 0,
      marketCap: c.market_cap,
      volume:    c.total_volume,
      rank:      c.market_cap_rank,
    }));

    cache = { data, timestamp: ahora };

    return Response.json(data, {
      headers: { 'X-Cache': 'MISS' },
    });

  } catch (e) {
    console.error('[API /precios]', e);

    // Si hay caché vieja aunque esté expirada, devuélvela
    // (mejor precio desactualizado que pantalla vacía)
    if (cache.data) {
      return Response.json(cache.data, {
        headers: { 'X-Cache': 'STALE' },
      });
    }

    return Response.json({ error: 'No se pudo obtener precios' }, { status: 503 });
  }
};

