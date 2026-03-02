// src/pages/api/dolar.ts
import type { APIRoute } from 'astro';

export interface DolarVariante {
  nombre:     string;
  compra:     number | null;
  venta:      number;
  esParalelo: boolean;
}

export interface DolarPais {
  pais:      string;
  codigo:    string;
  bandera:   string;
  moneda:    string;
  simbolo:   string;
  variantes: DolarVariante[];
}

const PAISES_FOREX = [
  { pais: 'México',     codigo: 'mx', bandera: 'mx', moneda: 'Peso Mexicano',   simbolo: 'MXN', cotizada: 'mxn' },
  { pais: 'Colombia',   codigo: 'co', bandera: 'co', moneda: 'Peso Colombiano', simbolo: 'COP', cotizada: 'cop' },
  { pais: 'Chile',      codigo: 'cl', bandera: 'cl', moneda: 'Peso Chileno',    simbolo: 'CLP', cotizada: 'clp' },
  { pais: 'Perú',       codigo: 'pe', bandera: 'pe', moneda: 'Sol Peruano',     simbolo: 'PEN', cotizada: 'pen' },
  { pais: 'Brasil',     codigo: 'br', bandera: 'br', moneda: 'Real Brasileño',  simbolo: 'BRL', cotizada: 'brl' },
  { pais: 'Uruguay',    codigo: 'uy', bandera: 'uy', moneda: 'Peso Uruguayo',   simbolo: 'UYU', cotizada: 'uyu' },
  { pais: 'Paraguay',   codigo: 'py', bandera: 'py', moneda: 'Guaraní',         simbolo: 'PYG', cotizada: 'pyg' },
  { pais: 'Bolivia',    codigo: 'bo', bandera: 'bo', moneda: 'Boliviano',       simbolo: 'BOB', cotizada: 'bob' },
  { pais: 'Costa Rica', codigo: 'cr', bandera: 'cr', moneda: 'Colón',           simbolo: 'CRC', cotizada: 'crc' },
  { pais: 'Guatemala',  codigo: 'gt', bandera: 'gt', moneda: 'Quetzal',         simbolo: 'GTQ', cotizada: 'gtq' },
  { pais: 'Honduras',   codigo: 'hn', bandera: 'hn', moneda: 'Lempira',         simbolo: 'HNL', cotizada: 'hnl' },
  { pais: 'Nicaragua',  codigo: 'ni', bandera: 'ni', moneda: 'Córdoba',         simbolo: 'NIO', cotizada: 'nio' },
  { pais: 'Rep. Dom.',  codigo: 'do', bandera: 'do', moneda: 'Peso Dominicano', simbolo: 'DOP', cotizada: 'dop' },
];

async function fetchForexUSD(): Promise<Record<string, number>> {
  const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`forex error: ${res.status}`);
  const json = await res.json() as Record<string, any>;
  return json['usd'] as Record<string, number>;
}

async function fetchArgentina(): Promise<DolarPais | null> {
  try {
    const res = await fetch('https://api.bluelytics.com.ar/v2/latest', {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`bluelytics ${res.status}`);
    const bl = await res.json() as any;
    return {
      pais: 'Argentina', codigo: 'ar', bandera: 'ar', moneda: 'Peso Argentino', simbolo: 'ARS',
      variantes: [
        { nombre: 'Oficial', compra: bl.oficial.value_buy, venta: bl.oficial.value_sell, esParalelo: false },
        { nombre: 'Blue',    compra: bl.blue.value_buy,    venta: bl.blue.value_sell,    esParalelo: true  },
      ],
    };
  } catch (e) {
    console.error('[dolar/ar]', e);
    return null;
  }
}

async function fetchVenezuela(tasas: Record<string, number> | null): Promise<DolarPais | null> {
  try {
    const ves = tasas?.['ves'];
    if (!ves || ves <= 0) return null;
    return {
      pais: 'Venezuela', codigo: 've', bandera: 've', moneda: 'Bolívar Soberano', simbolo: 'VES',
      variantes: [{ nombre: 'BCV (Oficial)', compra: null, venta: parseFloat(ves.toFixed(2)), esParalelo: false }],
    };
  } catch (e) {
    console.error('[dolar/ve]', e);
    return null;
  }
}

async function obtenerDolar(): Promise<DolarPais[]> {
  const [tasas, argentina] = await Promise.all([
    fetchForexUSD().catch(() => null),
    fetchArgentina(),
  ]);
  const venezuela = await fetchVenezuela(tasas);
  const resultado: DolarPais[] = [];

  if (argentina) resultado.push(argentina);
  if (venezuela) resultado.push(venezuela);

  if (tasas) {
    for (const p of PAISES_FOREX) {
      const tasa = tasas[p.cotizada];
      if (!tasa || tasa <= 0) continue;
      resultado.push({
        pais: p.pais, codigo: p.codigo, bandera: p.bandera, moneda: p.moneda, simbolo: p.simbolo,
        variantes: [{ nombre: 'Oficial', compra: null, venta: parseFloat(tasa.toFixed(4)), esParalelo: false }],
      });
    }
  }
  return resultado;
}

// ─── HANDLER ─────────────────────────────────────────────────────
export const GET: APIRoute = async ({ url, request }) => {
  const paisParam = url.searchParams.get('pais');

 const cfCache = (caches as any).default;
  const cacheKey = new Request(`https://cache.local/dolar?pais=${paisParam ?? 'all'}`, request);

  const cached = await cfCache.match(cacheKey);
  if (cached) return cached;

  try {
    const data = await obtenerDolar();
    const resultado = paisParam ? data.filter(p => p.codigo === paisParam) : data;

    const response = new Response(JSON.stringify({ ok: true, data: resultado, cached: false }), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=900', // 15 minutos
      },
    });

    await cfCache.put(cacheKey, response.clone());
    return response;

  } catch (error) {
    console.error('[/api/dolar] Error:', error);
    return new Response(
      JSON.stringify({ ok: false, error: 'Error al obtener precios del dólar' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

