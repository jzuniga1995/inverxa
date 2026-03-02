// src/pages/api/metales.ts
import type { APIRoute } from 'astro';

// ─── TIPOS ───────────────────────────────────────────────────────
export interface MetalData {
  nombre:             string;
  simbolo:            string;
  icono:              string;
  color:              string;
  precio:             number;
  unidad:             string;
  tradingviewSimbolo: string;
  slug:               string;
}

// ─── METALES ─────────────────────────────────────────────────────
const METALES = [
  { nombre: 'Oro',      simbolo: 'xau', display: 'XAU', icono: 'CircleDollarSign', color: 'text-yellow-400', tradingviewSimbolo: 'OANDA:XAUUSD', slug: 'oro' },
  { nombre: 'Plata',    simbolo: 'xag', display: 'XAG', icono: 'Gem',              color: 'text-slate-400',  tradingviewSimbolo: 'OANDA:XAGUSD', slug: 'plata' },
  { nombre: 'Platino',  simbolo: 'xpt', display: 'XPT', icono: 'Hexagon',          color: 'text-sky-300',    tradingviewSimbolo: 'OANDA:XPTUSD', slug: 'platino' },
  { nombre: 'Paladio',  simbolo: 'xpd', display: 'XPD', icono: 'Cpu',              color: 'text-purple-400', tradingviewSimbolo: 'OANDA:XPDUSD', slug: 'paladio' },
];

// ─── FETCH ───────────────────────────────────────────────────────
async function fetchMetales(): Promise<MetalData[]> {
  const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Error al obtener metales: ${res.status}`);

const json = await res.json() as Record<string, any>;
  const tasasUSD: Record<string, number> = json['usd'];

  return METALES.map(({ nombre, simbolo, display, icono, color, tradingviewSimbolo, slug }) => {
    const tasaInvertida = tasasUSD[simbolo];
    const precio = tasaInvertida ? parseFloat((1 / tasaInvertida).toFixed(2)) : 0;
    return { nombre, simbolo: display, icono, color, precio, unidad: 'oz', tradingviewSimbolo, slug };
  });
}

// ─── HANDLER ─────────────────────────────────────────────────────
export const GET: APIRoute = async ({ url, request }) => {
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  // Caché separado por limit
const cfCache = (caches as any).default;
  const cacheKey = new Request(`https://cache.local/metales?limit=${limit ?? 'all'}`, request);

  const cached = await cfCache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await fetchMetales();
    const resultado = limit ? data.slice(0, limit) : data;

    const response = new Response(JSON.stringify({ ok: true, data: resultado, cached: false }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=21600', // 6 horas
      },
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
