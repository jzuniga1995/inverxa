// src/pages/api/forex.ts
import type { APIRoute } from 'astro';

export interface ForexData {
  par:                string;
  base:               string;
  cotizada:           string;
  simbolo:            string;
  banderaBase:        string;
  banderaCotizada:    string;
  precio:             number;
  tradingviewSimbolo: string;
  tvDisponible:       boolean;
}

const PARES = [
  { base: 'eur', cotizada: 'usd', par: 'EUR/USD', simbolo: '€',   banderaBase: 'EU', banderaCotizada: 'US', tradingviewSimbolo: 'FX:EURUSD',    tvDisponible: true  },
  { base: 'gbp', cotizada: 'usd', par: 'GBP/USD', simbolo: '£',   banderaBase: 'GB', banderaCotizada: 'US', tradingviewSimbolo: 'FX:GBPUSD',    tvDisponible: true  },
  { base: 'usd', cotizada: 'jpy', par: 'USD/JPY', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'JP', tradingviewSimbolo: 'FX:USDJPY',    tvDisponible: true  },
  { base: 'usd', cotizada: 'chf', par: 'USD/CHF', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'CH', tradingviewSimbolo: 'FX:USDCHF',    tvDisponible: true  },
  { base: 'usd', cotizada: 'cad', par: 'USD/CAD', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'CA', tradingviewSimbolo: 'FX:USDCAD',    tvDisponible: true  },
  { base: 'aud', cotizada: 'usd', par: 'AUD/USD', simbolo: 'A$',  banderaBase: 'AU', banderaCotizada: 'US', tradingviewSimbolo: 'FX:AUDUSD',    tvDisponible: true  },
  { base: 'nzd', cotizada: 'usd', par: 'NZD/USD', simbolo: 'NZ$', banderaBase: 'NZ', banderaCotizada: 'US', tradingviewSimbolo: 'FX:NZDUSD',    tvDisponible: true  },
  { base: 'usd', cotizada: 'cny', par: 'USD/CNY', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'CN', tradingviewSimbolo: 'FX:USDCNH',    tvDisponible: true  },
  { base: 'usd', cotizada: 'mxn', par: 'USD/MXN', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'MX', tradingviewSimbolo: 'FX:USDMXN',    tvDisponible: true  },
  { base: 'usd', cotizada: 'cop', par: 'USD/COP', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'CO', tradingviewSimbolo: 'FX:USDCOP',    tvDisponible: true  },
  { base: 'usd', cotizada: 'ars', par: 'USD/ARS', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'AR', tradingviewSimbolo: 'FX:USDARS',    tvDisponible: true  },
  { base: 'usd', cotizada: 'clp', par: 'USD/CLP', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'CL', tradingviewSimbolo: 'FX:USDCLP',    tvDisponible: true  },
  { base: 'usd', cotizada: 'pen', par: 'USD/PEN', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'PE', tradingviewSimbolo: 'FX:USDPEN',    tvDisponible: true  },
  { base: 'usd', cotizada: 'brl', par: 'USD/BRL', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'BR', tradingviewSimbolo: 'FX:USDBRL',    tvDisponible: true  },
  { base: 'usd', cotizada: 'uyu', par: 'USD/UYU', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'UY', tradingviewSimbolo: 'OANDA:USDUYU', tvDisponible: true  },
  { base: 'usd', cotizada: 'pyg', par: 'USD/PYG', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'PY', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'bob', par: 'USD/BOB', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'BO', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'ves', par: 'USD/VES', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'VE', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'crc', par: 'USD/CRC', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'CR', tradingviewSimbolo: 'OANDA:USDCRC', tvDisponible: true  },
  { base: 'usd', cotizada: 'gtq', par: 'USD/GTQ', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'GT', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'hnl', par: 'USD/HNL', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'HN', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'nio', par: 'USD/NIO', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'NI', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'pab', par: 'USD/PAB', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'PA', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'dop', par: 'USD/DOP', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'DO', tradingviewSimbolo: 'OANDA:USDDOP', tvDisponible: true  },
  { base: 'usd', cotizada: 'cup', par: 'USD/CUP', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'CU', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'jmd', par: 'USD/JMD', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'JM', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'ttd', par: 'USD/TTD', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'TT', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'bbd', par: 'USD/BBD', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'BB', tradingviewSimbolo: '',             tvDisponible: false },
  { base: 'usd', cotizada: 'htg', par: 'USD/HTG', simbolo: '$',   banderaBase: 'US', banderaCotizada: 'HT', tradingviewSimbolo: '',             tvDisponible: false },
];

async function fetchTasas(base: string): Promise<Record<string, number>> {
  const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.json`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`Error tasas ${base}: ${res.status}`);
  const json = await res.json();
  return json[base] as Record<string, number>;
}

async function obtenerForex(): Promise<ForexData[]> {
  const basesUnicas = [...new Set(PARES.map(p => p.base))];
  const tasasPorBase = await Promise.all(
    basesUnicas.map(async base => ({ base, tasas: await fetchTasas(base) }))
  );
  const mapaBaseTasas = Object.fromEntries(
    tasasPorBase.map(({ base, tasas }) => [base, tasas])
  );
  return PARES.map(({ base, cotizada, par, simbolo, banderaBase, banderaCotizada, tradingviewSimbolo, tvDisponible }) => ({
    par, base, cotizada, simbolo, banderaBase, banderaCotizada, tradingviewSimbolo, tvDisponible,
    precio: mapaBaseTasas[base]?.[cotizada] ?? 0,
  }));
}

export const GET: APIRoute = async ({ url, request }) => {
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam, 10) : null;

  const cfCache = caches.default;
  const cacheKey = new Request(`https://cache.local/forex?limit=${limit ?? 'all'}`, request);

  const cached = await cfCache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await obtenerForex();
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
    console.error('[/api/forex] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error al obtener cotizaciones forex' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
