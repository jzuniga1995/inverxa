// src/pages/api/metales.ts
import type { APIRoute } from 'astro';

// ─── CACHÉ EN MEMORIA ────────────────────────────────────────────
let cache: {
  data: MetalData[];
  timestamp: number;
} | null = null;

const CACHE_TTL = 1000 * 60 * 60 * 6; // 6 horas

// ─── TIPOS ───────────────────────────────────────────────────────
export interface MetalData {
  nombre:             string;  // "Oro"
  simbolo:            string;  // "XAU"
  icono:              string;  // nombre componente Lucide
  color:              string;  // clase Tailwind
  precio:             number;  // USD por onza troy
  unidad:             string;  // "oz"
  tradingviewSimbolo: string;  // "OANDA:XAUUSD"
  slug:               string;  // "oro" → /herramientas/metales/oro
}

// ─── METALES ─────────────────────────────────────────────────────
// La API devuelve cuántas onzas vale 1 USD → invertimos: precio = 1 / valor
const METALES = [
  {
    nombre: 'Oro',
    simbolo: 'xau', display: 'XAU',
    icono: 'CircleDollarSign', color: 'text-yellow-400',
    tradingviewSimbolo: 'OANDA:XAUUSD',
    slug: 'oro',
  },
  {
    nombre: 'Plata',
    simbolo: 'xag', display: 'XAG',
    icono: 'Gem', color: 'text-slate-400',
    tradingviewSimbolo: 'OANDA:XAGUSD',
    slug: 'plata',
  },
  {
    nombre: 'Platino',
    simbolo: 'xpt', display: 'XPT',
    icono: 'Hexagon', color: 'text-sky-300',
    tradingviewSimbolo: 'OANDA:XPTUSD',
    slug: 'platino',
  },
  {
    nombre: 'Paladio',
    simbolo: 'xpd', display: 'XPD',
    icono: 'Cpu', color: 'text-purple-400',
    tradingviewSimbolo: 'OANDA:XPDUSD',
    slug: 'paladio',
  },
];

// ─── FETCH ───────────────────────────────────────────────────────
async function fetchMetales(): Promise<MetalData[]> {
  const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Error al obtener metales: ${res.status}`);

  const json = await res.json();
  const tasasUSD: Record<string, number> = json['usd'];

  return METALES.map(({ nombre, simbolo, display, icono, color, tradingviewSimbolo, slug }) => {
    const tasaInvertida = tasasUSD[simbolo];
    const precio = tasaInvertida ? parseFloat((1 / tasaInvertida).toFixed(2)) : 0;
    return { nombre, simbolo: display, icono, color, precio, unidad: 'oz', tradingviewSimbolo, slug };
  });
}

// ─── HANDLER ─────────────────────────────────────────────────────
export const GET: APIRoute = async ({ url }) => {
  try {
    // ?limit=6 → home preview | sin parámetro → todos
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : null;

    const ahora = Date.now();

    if (cache && ahora - cache.timestamp < CACHE_TTL) {
      const data = limit ? cache.data.slice(0, limit) : cache.data;
      return new Response(JSON.stringify({ ok: true, data, cached: true }), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=21600',
        },
      });
    }

    const data = await fetchMetales();
    cache = { data, timestamp: ahora };

    const resultado = limit ? data.slice(0, limit) : data;

    return new Response(JSON.stringify({ ok: true, data: resultado, cached: false }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=21600',
      },
    });

  } catch (error) {
    console.error('[/api/metales] Error:', error);

    if (cache) {
      const limitParam = url.searchParams.get('limit');
      const limit = limitParam ? parseInt(limitParam, 10) : null;
      const data = limit ? cache.data.slice(0, limit) : cache.data;
      return new Response(
        JSON.stringify({ ok: true, data, cached: true, stale: true }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'Error al obtener precios de metales' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
