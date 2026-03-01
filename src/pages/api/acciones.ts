// src/pages/api/acciones.ts
import type { APIRoute } from 'astro';

let cache: { data: AccionData[]; timestamp: number; } | null = null;
const CACHE_TTL = 1000 * 60 * 15; // 15 minutos

export interface AccionData {
  nombre: string; ticker: string; slug: string; sector: string;
  icono: string; color: string; tradingviewSimbolo: string;
  precio: number; cambio: number; cambioPct: number; alza: boolean;
}

const ACCIONES = [
  // ── Big Tech ──────────────────────────────────────────────────
  { ticker: 'AAPL',  nombre: 'Apple',             sector: 'Tecnología',      icono: 'Smartphone',      color: 'text-slate-400',  tradingviewSimbolo: 'NASDAQ:AAPL',  slug: 'aapl'  },
  { ticker: 'MSFT',  nombre: 'Microsoft',         sector: 'Tecnología',      icono: 'Monitor',         color: 'text-blue-400',   tradingviewSimbolo: 'NASDAQ:MSFT',  slug: 'msft'  },
  { ticker: 'GOOGL', nombre: 'Alphabet',          sector: 'Tecnología',      icono: 'Search',          color: 'text-green-400',  tradingviewSimbolo: 'NASDAQ:GOOGL', slug: 'googl' },
  { ticker: 'AMZN',  nombre: 'Amazon',            sector: 'Tecnología',      icono: 'ShoppingCart',    color: 'text-yellow-400', tradingviewSimbolo: 'NASDAQ:AMZN',  slug: 'amzn'  },
  { ticker: 'NVDA',  nombre: 'NVIDIA',            sector: 'Tecnología',      icono: 'Cpu',             color: 'text-green-500',  tradingviewSimbolo: 'NASDAQ:NVDA',  slug: 'nvda'  },
  { ticker: 'META',  nombre: 'Meta',              sector: 'Tecnología',      icono: 'Users',           color: 'text-blue-500',   tradingviewSimbolo: 'NASDAQ:META',  slug: 'meta'  },
  { ticker: 'TSLA',  nombre: 'Tesla',             sector: 'Automotriz',      icono: 'Zap',             color: 'text-red-400',    tradingviewSimbolo: 'NASDAQ:TSLA',  slug: 'tsla'  },
  { ticker: 'ORCL',  nombre: 'Oracle',            sector: 'Tecnología',      icono: 'Database',        color: 'text-red-500',    tradingviewSimbolo: 'NYSE:ORCL',    slug: 'orcl'  },
  { ticker: 'CRM',   nombre: 'Salesforce',        sector: 'Tecnología',      icono: 'Cloud',           color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:CRM',     slug: 'crm'   },
  { ticker: 'ADBE',  nombre: 'Adobe',             sector: 'Tecnología',      icono: 'Palette',         color: 'text-red-400',    tradingviewSimbolo: 'NASDAQ:ADBE',  slug: 'adbe'  },
  // ── Semiconductores ───────────────────────────────────────────
  { ticker: 'INTC',  nombre: 'Intel',             sector: 'Semiconductores', icono: 'Cpu',             color: 'text-blue-300',   tradingviewSimbolo: 'NASDAQ:INTC',  slug: 'intc'  },
  { ticker: 'AMD',   nombre: 'AMD',               sector: 'Semiconductores', icono: 'Cpu',             color: 'text-orange-400', tradingviewSimbolo: 'NASDAQ:AMD',   slug: 'amd'   },
  { ticker: 'TSM',   nombre: 'TSMC',              sector: 'Semiconductores', icono: 'Cpu',             color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:TSM',     slug: 'tsm'   },
  { ticker: 'AVGO',  nombre: 'Broadcom',          sector: 'Semiconductores', icono: 'Cpu',             color: 'text-orange-400', tradingviewSimbolo: 'NASDAQ:AVGO',  slug: 'avgo'  },
  { ticker: 'QCOM',  nombre: 'Qualcomm',          sector: 'Semiconductores', icono: 'Wifi',            color: 'text-blue-500',   tradingviewSimbolo: 'NASDAQ:QCOM',  slug: 'qcom'  },
  // ── Finanzas ──────────────────────────────────────────────────
  { ticker: 'JPM',   nombre: 'JPMorgan',          sector: 'Finanzas',        icono: 'Landmark',        color: 'text-blue-300',   tradingviewSimbolo: 'NYSE:JPM',     slug: 'jpm'   },
  { ticker: 'BAC',   nombre: 'Bank of America',   sector: 'Finanzas',        icono: 'Building2',       color: 'text-red-300',    tradingviewSimbolo: 'NYSE:BAC',     slug: 'bac'   },
  { ticker: 'GS',    nombre: 'Goldman Sachs',     sector: 'Finanzas',        icono: 'TrendingUp',      color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:GS',      slug: 'gs'    },
  { ticker: 'MS',    nombre: 'Morgan Stanley',    sector: 'Finanzas',        icono: 'BarChart2',       color: 'text-blue-300',   tradingviewSimbolo: 'NYSE:MS',      slug: 'ms'    },
  { ticker: 'V',     nombre: 'Visa',              sector: 'Finanzas',        icono: 'CreditCard',      color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:V',       slug: 'v'     },
  { ticker: 'MA',    nombre: 'Mastercard',        sector: 'Finanzas',        icono: 'CreditCard',      color: 'text-orange-500', tradingviewSimbolo: 'NYSE:MA',      slug: 'ma'    },
  { ticker: 'PYPL',  nombre: 'PayPal',            sector: 'Finanzas',        icono: 'Wallet',          color: 'text-blue-400',   tradingviewSimbolo: 'NASDAQ:PYPL',  slug: 'pypl'  },
  { ticker: 'BRK.B', nombre: 'Berkshire',         sector: 'Finanzas',        icono: 'Briefcase',       color: 'text-yellow-600', tradingviewSimbolo: 'NYSE:BRK.B',   slug: 'brkb'  },
  // ── Salud & Farmacéuticas ─────────────────────────────────────
  { ticker: 'JNJ',   nombre: 'Johnson & Johnson', sector: 'Salud',           icono: 'HeartPulse',      color: 'text-red-400',    tradingviewSimbolo: 'NYSE:JNJ',     slug: 'jnj'   },
  { ticker: 'UNH',   nombre: 'UnitedHealth',      sector: 'Salud',           icono: 'HeartPulse',      color: 'text-blue-500',   tradingviewSimbolo: 'NYSE:UNH',     slug: 'unh'   },
  { ticker: 'PFE',   nombre: 'Pfizer',            sector: 'Salud',           icono: 'Pill',            color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:PFE',     slug: 'pfe'   },
  { ticker: 'ABBV',  nombre: 'AbbVie',            sector: 'Salud',           icono: 'FlaskConical',    color: 'text-purple-400', tradingviewSimbolo: 'NYSE:ABBV',    slug: 'abbv'  },
  { ticker: 'MRK',   nombre: 'Merck',             sector: 'Salud',           icono: 'FlaskConical',    color: 'text-teal-400',   tradingviewSimbolo: 'NYSE:MRK',     slug: 'mrk'   },
  { ticker: 'LLY',   nombre: 'Eli Lilly',         sector: 'Salud',           icono: 'Pill',            color: 'text-red-300',    tradingviewSimbolo: 'NYSE:LLY',     slug: 'lly'   },
  // ── Energía ───────────────────────────────────────────────────
  { ticker: 'XOM',   nombre: 'ExxonMobil',        sector: 'Energía',         icono: 'Fuel',            color: 'text-orange-400', tradingviewSimbolo: 'NYSE:XOM',     slug: 'xom'   },
  { ticker: 'CVX',   nombre: 'Chevron',           sector: 'Energía',         icono: 'Fuel',            color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:CVX',     slug: 'cvx'   },
  // ── Consumo ───────────────────────────────────────────────────
  { ticker: 'KO',    nombre: 'Coca-Cola',         sector: 'Consumo',         icono: 'Coffee',          color: 'text-red-400',    tradingviewSimbolo: 'NYSE:KO',      slug: 'ko'    },
  { ticker: 'PEP',   nombre: 'PepsiCo',           sector: 'Consumo',         icono: 'Coffee',          color: 'text-blue-500',   tradingviewSimbolo: 'NASDAQ:PEP',   slug: 'pep'   },
  { ticker: 'MCD',   nombre: "McDonald's",        sector: 'Consumo',         icono: 'UtensilsCrossed', color: 'text-yellow-500', tradingviewSimbolo: 'NYSE:MCD',     slug: 'mcd'   },
  { ticker: 'WMT',   nombre: 'Walmart',           sector: 'Consumo',         icono: 'ShoppingCart',    color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:WMT',     slug: 'wmt'   },
  { ticker: 'COST',  nombre: 'Costco',            sector: 'Consumo',         icono: 'ShoppingBag',     color: 'text-red-400',    tradingviewSimbolo: 'NASDAQ:COST',  slug: 'cost'  },
  { ticker: 'NKE',   nombre: 'Nike',              sector: 'Consumo',         icono: 'Activity',        color: 'text-orange-400', tradingviewSimbolo: 'NYSE:NKE',     slug: 'nke'   },
  { ticker: 'SBUX',  nombre: 'Starbucks',         sector: 'Consumo',         icono: 'Coffee',          color: 'text-green-500',  tradingviewSimbolo: 'NASDAQ:SBUX',  slug: 'sbux'  },
  // ── Entretenimiento & Streaming ───────────────────────────────
  { ticker: 'NFLX',  nombre: 'Netflix',           sector: 'Entretenimiento', icono: 'Tv',              color: 'text-red-500',    tradingviewSimbolo: 'NASDAQ:NFLX',  slug: 'nflx'  },
  { ticker: 'DIS',   nombre: 'Disney',            sector: 'Entretenimiento', icono: 'Tv2',             color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:DIS',     slug: 'dis'   },
  { ticker: 'SPOT',  nombre: 'Spotify',           sector: 'Entretenimiento', icono: 'Music',           color: 'text-green-400',  tradingviewSimbolo: 'NYSE:SPOT',    slug: 'spot'  },
  // ── Transporte ────────────────────────────────────────────────
  { ticker: 'UBER',  nombre: 'Uber',              sector: 'Transporte',      icono: 'Car',             color: 'text-slate-400',  tradingviewSimbolo: 'NYSE:UBER',    slug: 'uber'  },
  { ticker: 'ABNB',  nombre: 'Airbnb',            sector: 'Transporte',      icono: 'Home',            color: 'text-rose-400',   tradingviewSimbolo: 'NASDAQ:ABNB',  slug: 'abnb'  },
  // ── Automotriz ────────────────────────────────────────────────
  { ticker: 'F',     nombre: 'Ford',              sector: 'Automotriz',      icono: 'Car',             color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:F',       slug: 'f'     },
  { ticker: 'GM',    nombre: 'General Motors',    sector: 'Automotriz',      icono: 'Car',             color: 'text-blue-300',   tradingviewSimbolo: 'NYSE:GM',      slug: 'gm'    },
  // ── Aeroespacial ──────────────────────────────────────────────
  { ticker: 'BA',    nombre: 'Boeing',            sector: 'Aeroespacial',    icono: 'Plane',           color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:BA',      slug: 'ba'    },
  // ── Telecom ───────────────────────────────────────────────────
  { ticker: 'T',     nombre: 'AT&T',              sector: 'Telecom',         icono: 'Phone',           color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:T',       slug: 'att'   },
  { ticker: 'VZ',    nombre: 'Verizon',           sector: 'Telecom',         icono: 'Phone',           color: 'text-red-400',    tradingviewSimbolo: 'NYSE:VZ',      slug: 'vz'    },
  // ── ETFs índice ───────────────────────────────────────────────
  { ticker: 'SPY',   nombre: 'S&P 500 ETF',       sector: 'ETF',             icono: 'BarChart2',       color: 'text-green-400',  tradingviewSimbolo: 'AMEX:SPY',     slug: 'spy'   },
  { ticker: 'QQQ',   nombre: 'Nasdaq ETF',        sector: 'ETF',             icono: 'Activity',        color: 'text-purple-400', tradingviewSimbolo: 'NASDAQ:QQQ',   slug: 'qqq'   },
];

interface FinnhubQuote {
  c: number; d: number; dp: number; h: number; l: number; o: number; pc: number;
}

async function fetchQuote(ticker: string, apiKey: string): Promise<FinnhubQuote> {
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`,
    { signal: AbortSignal.timeout(5000) }
  );
  if (!res.ok) throw new Error(`${res.status}`);
  return res.json();
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchAcciones(apiKey: string): Promise<AccionData[]> {
  const BATCH_SIZE = 10;
  const results: AccionData[] = [];

  for (let i = 0; i < ACCIONES.length; i += BATCH_SIZE) {
    const lote = ACCIONES.slice(i, i + BATCH_SIZE);
    const quotes = await Promise.all(
      lote.map(async (accion) => {
        try {
          const q = await fetchQuote(accion.ticker, apiKey);
          return {
            ...accion,
            precio:    parseFloat(q.c.toFixed(2)),
            cambio:    parseFloat(q.d.toFixed(2)),
            cambioPct: parseFloat(q.dp.toFixed(2)),
            alza:      q.dp >= 0,
          };
        } catch {
          return { ...accion, precio: 0, cambio: 0, cambioPct: 0, alza: true };
        }
      })
    );
    results.push(...quotes);
    if (i + BATCH_SIZE < ACCIONES.length) await sleep(200);
  }

  return results;
}

export const GET: APIRoute = async ({ url }) => {
  const apiKey = import.meta.env.FINNHUB_API_KEY;

  if (!apiKey) {
    return new Response(
      JSON.stringify({ ok: false, error: 'FINNHUB_API_KEY no configurada' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : null;
    const ahora = Date.now();

    if (cache && ahora - cache.timestamp < CACHE_TTL) {
      const data = limit ? cache.data.slice(0, limit) : cache.data;
      return new Response(JSON.stringify({ ok: true, data, cached: true }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=900' },
      });
    }

    const data = await fetchAcciones(apiKey);
    cache = { data, timestamp: ahora };
    const resultado = limit ? data.slice(0, limit) : data;

    return new Response(JSON.stringify({ ok: true, data: resultado, cached: false }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=900' },
    });

  } catch (error) {
    console.error('[/api/acciones] Error:', error);

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
      JSON.stringify({ ok: false, error: 'Error al obtener cotizaciones' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
