// src/pages/api/dolar.ts
import type { APIRoute } from 'astro';

let cache: { data: DolarPais[]; timestamp: number } | null = null;
const CACHE_TTL = 1000 * 60 * 15; // 15 minutos

// ─── TIPOS ───────────────────────────────────────────────────────
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

// ─── PAÍSES LATAM (tipo oficial desde forex API) ──────────────────
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

// ─── FETCH FOREX ─────────────────────────────────────────────────
async function fetchForexUSD(): Promise<Record<string, number>> {
  const url = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
  const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
  if (!res.ok) throw new Error(`forex error: ${res.status}`);
  const json = await res.json();
  return json['usd'] as Record<string, number>;
}

// ─── FETCH ARGENTINA (bluelytics — oficial + blue) ───────────────
async function fetchArgentina(): Promise<DolarPais | null> {
  try {
    const res = await fetch('https://api.bluelytics.com.ar/v2/latest', {
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) throw new Error(`bluelytics ${res.status}`);
    const bl = await res.json();

    const variantes: DolarVariante[] = [
      { nombre: 'Oficial', compra: bl.oficial.value_buy,  venta: bl.oficial.value_sell, esParalelo: false },
      { nombre: 'Blue',    compra: bl.blue.value_buy,     venta: bl.blue.value_sell,    esParalelo: true  },
    ];

    return { pais: 'Argentina', codigo: 'ar', bandera: 'ar', moneda: 'Peso Argentino', simbolo: 'ARS', variantes };
  } catch (e) {
    console.error('[dolar/ar]', e);
    return null;
  }
}

// ─── FETCH VENEZUELA (fawazahmed0 — BCV oficial) ─────────────────
// dolarapi.com no siempre es accesible desde servidores externos,
// usamos la misma fuente que el resto de LATAM
async function fetchVenezuela(tasas: Record<string, number> | null): Promise<DolarPais | null> {
  try {
    const ves = tasas?.['ves'];
    if (!ves || ves <= 0) return null;

    return {
      pais:    'Venezuela',
      codigo:  've',
      bandera: 've',
      moneda:  'Bolívar Soberano',
      simbolo: 'VES',
      variantes: [{
        nombre:     'BCV (Oficial)',
        compra:     null,
        venta:      parseFloat(ves.toFixed(2)),
        esParalelo: false,
      }],
    };
  } catch (e) {
    console.error('[dolar/ve]', e);
    return null;
  }
}

// ─── CONSTRUIR TODOS LOS PAÍSES ───────────────────────────────────
async function obtenerDolar(): Promise<DolarPais[]> {
  const [tasas, argentina] = await Promise.all([
    fetchForexUSD().catch(() => null),
    fetchArgentina(),
  ]);

  const venezuela = await fetchVenezuela(tasas);

  const resultado: DolarPais[] = [];

  // Argentina primero (más buscada)
  if (argentina) resultado.push(argentina);

  // Venezuela segundo
  if (venezuela) resultado.push(venezuela);

  // Resto LATAM desde forex
  if (tasas) {
    for (const p of PAISES_FOREX) {
      const tasa = tasas[p.cotizada];
      if (!tasa || tasa <= 0) continue;
      resultado.push({
        pais:     p.pais,
        codigo:   p.codigo,
        bandera:  p.bandera,
        moneda:   p.moneda,
        simbolo:  p.simbolo,
        variantes: [{
          nombre:     'Oficial',
          compra:     null,
          venta:      parseFloat(tasa.toFixed(4)),
          esParalelo: false,
        }],
      });
    }
  }

  return resultado;
}

// ─── HANDLER ─────────────────────────────────────────────────────
export const GET: APIRoute = async ({ url }) => {
  try {
    const paisParam = url.searchParams.get('pais'); // ?pais=ar → filtrar por país
    const ahora     = Date.now();

    if (cache && ahora - cache.timestamp < CACHE_TTL) {
      const data = paisParam ? cache.data.filter(p => p.codigo === paisParam) : cache.data;
      return new Response(JSON.stringify({ ok: true, data, cached: true }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=900' },
      });
    }

    const data = await obtenerDolar();
    cache = { data, timestamp: ahora };
    const resultado = paisParam ? data.filter(p => p.codigo === paisParam) : data;

    return new Response(JSON.stringify({ ok: true, data: resultado, cached: false }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=900' },
    });

  } catch (error) {
    console.error('[/api/dolar] Error:', error);
    if (cache) {
      const paisParam = url.searchParams.get('pais');
      const data = paisParam ? cache.data.filter(p => p.codigo === paisParam) : cache.data;
      return new Response(JSON.stringify({ ok: true, data, cached: true, stale: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(
      JSON.stringify({ ok: false, error: 'Error al obtener precios del dólar' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
