// src/lib/acciones.ts

export interface AccionData {
  nombre: string;
  ticker: string;
  slug: string;
  sector: string;
  icono: string;
  color: string;
  tradingviewSimbolo: string;
  precio: number;
  cambio: number;
  cambioPct: number;
  alza: boolean;
  apertura: number;
  maximo: number;
  minimo: number;
  prevCierre: number;
}

interface FinnhubQuote {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
}

// src/lib/acciones.ts

export const ACCIONES = [

  // ── 🔥 Tecnología — las más buscadas y volátiles ──
  { ticker: 'AAPL',  nombre: 'Apple',         sector: 'Tecnología',  icono: 'Smartphone', color: 'text-slate-400',  tradingviewSimbolo: 'NASDAQ:AAPL',  slug: 'aapl'  },
  { ticker: 'NVDA',  nombre: 'NVIDIA',         sector: 'Tecnología',  icono: 'Cpu',        color: 'text-green-500',  tradingviewSimbolo: 'NASDAQ:NVDA',  slug: 'nvda'  },
  { ticker: 'MSFT',  nombre: 'Microsoft',      sector: 'Tecnología',  icono: 'Monitor',    color: 'text-blue-400',   tradingviewSimbolo: 'NASDAQ:MSFT',  slug: 'msft'  },
  { ticker: 'META',  nombre: 'Meta Platforms', sector: 'Tecnología',  icono: 'Chat',       color: 'text-blue-600',   tradingviewSimbolo: 'NASDAQ:META',  slug: 'meta'  },
  { ticker: 'GOOGL', nombre: 'Alphabet',       sector: 'Tecnología',  icono: 'Globe',      color: 'text-purple-500', tradingviewSimbolo: 'NASDAQ:GOOGL', slug: 'googl' },
  { ticker: 'AMD',   nombre: 'AMD',            sector: 'Tecnología',  icono: 'Cpu',        color: 'text-red-500',    tradingviewSimbolo: 'NASDAQ:AMD',   slug: 'amd'   },
  { ticker: 'PLTR',  nombre: 'Palantir',       sector: 'Tecnología',  icono: 'Database',   color: 'text-gray-500',   tradingviewSimbolo: 'NYSE:PLTR',    slug: 'pltr'  },
  { ticker: 'CRWD',  nombre: 'CrowdStrike',    sector: 'Tecnología',  icono: 'Shield',     color: 'text-red-500',    tradingviewSimbolo: 'NASDAQ:CRWD',  slug: 'crwd'  },

  // ── ⚡ Alta volatilidad — favoritos de traders activos ──
  { ticker: 'TSLA',  nombre: 'Tesla',          sector: 'Automotriz',  icono: 'Zap',        color: 'text-red-400',    tradingviewSimbolo: 'NASDAQ:TSLA',  slug: 'tsla'  },
  { ticker: 'AMZN',  nombre: 'Amazon',         sector: 'Consumo',     icono: 'Cart',       color: 'text-orange-400', tradingviewSimbolo: 'NASDAQ:AMZN',  slug: 'amzn'  },
  { ticker: 'NFLX',  nombre: 'Netflix',        sector: 'Entretenimiento', icono: 'Play',   color: 'text-red-600',    tradingviewSimbolo: 'NASDAQ:NFLX',  slug: 'nflx'  },
  { ticker: 'COIN',  nombre: 'Coinbase',       sector: 'Finanzas',    icono: 'CreditCard', color: 'text-blue-500',   tradingviewSimbolo: 'NASDAQ:COIN',  slug: 'coin'  },
  { ticker: 'HOOD',  nombre: 'Robinhood',      sector: 'Finanzas',    icono: 'TrendingUp', color: 'text-green-400',  tradingviewSimbolo: 'NASDAQ:HOOD',  slug: 'hood'  },
  { ticker: 'SHOP',  nombre: 'Shopify',        sector: 'Tecnología',  icono: 'Cart',       color: 'text-green-500',  tradingviewSimbolo: 'NYSE:SHOP',    slug: 'shop'  },

  // ── 💰 ETFs — clave para tu contenido educativo ──
  { ticker: 'SPY',   nombre: 'S&P 500 ETF',    sector: 'ETF',         icono: 'TrendingUp', color: 'text-blue-500',   tradingviewSimbolo: 'AMEX:SPY',     slug: 'spy'   },
  { ticker: 'QQQ',   nombre: 'Nasdaq 100 ETF', sector: 'ETF',         icono: 'TrendingUp', color: 'text-purple-500', tradingviewSimbolo: 'NASDAQ:QQQ',   slug: 'qqq'   },
  { ticker: 'GLD',   nombre: 'Gold ETF',       sector: 'ETF',         icono: 'TrendingUp', color: 'text-yellow-400', tradingviewSimbolo: 'AMEX:GLD',     slug: 'gld'   },

  // ── 🌎 LATAM — identidad de tu audiencia ──
  { ticker: 'MELI',  nombre: 'Mercado Libre',  sector: 'Tecnología',  icono: 'Cart',       color: 'text-yellow-400', tradingviewSimbolo: 'NASDAQ:MELI',  slug: 'meli'  },
  { ticker: 'EC',    nombre: 'Ecopetrol',      sector: 'Energía',     icono: 'Zap',        color: 'text-yellow-600', tradingviewSimbolo: 'NYSE:EC',      slug: 'ec'    },
  { ticker: 'PBR',   nombre: 'Petrobras',      sector: 'Energía',     icono: 'Zap',        color: 'text-green-600',  tradingviewSimbolo: 'NYSE:PBR',     slug: 'pbr'   },
  { ticker: 'VALE',  nombre: 'Vale',           sector: 'Minería',     icono: 'Gear',       color: 'text-blue-500',   tradingviewSimbolo: 'NYSE:VALE',    slug: 'vale'  },
  { ticker: 'GLOB',  nombre: 'Globant',        sector: 'Tecnología',  icono: 'Globe',      color: 'text-orange-500', tradingviewSimbolo: 'NYSE:GLOB',    slug: 'glob'  },
  { ticker: 'AMX',   nombre: 'América Móvil',  sector: 'Telecom',     icono: 'Signal',     color: 'text-yellow-500', tradingviewSimbolo: 'NYSE:AMX',     slug: 'amx'   },

  // ── 🏦 Finanzas — para contenido macro y dividendos ──
  { ticker: 'V',     nombre: 'Visa',           sector: 'Finanzas',    icono: 'CreditCard', color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:V',       slug: 'v'     },
  { ticker: 'JPM',   nombre: 'JP Morgan',      sector: 'Finanzas',    icono: 'Bank',       color: 'text-blue-500',   tradingviewSimbolo: 'NYSE:JPM',     slug: 'jpm'   },
  { ticker: 'GS',    nombre: 'Goldman Sachs',  sector: 'Finanzas',    icono: 'Bank',       color: 'text-gray-600',   tradingviewSimbolo: 'NYSE:GS',      slug: 'gs'    },
  { ticker: 'BRK-B', nombre: 'Berkshire',      sector: 'Finanzas',    icono: 'Briefcase',  color: 'text-yellow-600', tradingviewSimbolo: 'NYSE:BRK.B',   slug: 'brkb'  },
  { ticker: 'PYPL',  nombre: 'PayPal',         sector: 'Finanzas',    icono: 'CreditCard', color: 'text-blue-400',   tradingviewSimbolo: 'NASDAQ:PYPL',  slug: 'pypl'  },

  // ── 🏥 Salud — dividendos y estabilidad ──
  { ticker: 'LLY',   nombre: 'Eli Lilly',      sector: 'Salud',       icono: 'Heart',      color: 'text-red-400',    tradingviewSimbolo: 'NYSE:LLY',     slug: 'lly'   },
  { ticker: 'JNJ',   nombre: 'Johnson & Johnson', sector: 'Salud',    icono: 'Heart',      color: 'text-red-500',    tradingviewSimbolo: 'NYSE:JNJ',     slug: 'jnj'   },
  { ticker: 'PFE',   nombre: 'Pfizer',         sector: 'Salud',       icono: 'Heart',      color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:PFE',     slug: 'pfe'   },

  // ── 🛒 Consumo — marcas que tu audiencia conoce ──
  { ticker: 'KO',    nombre: 'Coca-Cola',      sector: 'Consumo',     icono: 'Drink',      color: 'text-red-500',    tradingviewSimbolo: 'NYSE:KO',      slug: 'ko'    },
  { ticker: 'MCD',   nombre: 'McDonalds',      sector: 'Consumo',     icono: 'Burger',     color: 'text-yellow-400', tradingviewSimbolo: 'NYSE:MCD',     slug: 'mcd'   },
  { ticker: 'DIS',   nombre: 'Disney',         sector: 'Entretenimiento', icono: 'Castle', color: 'text-blue-500',   tradingviewSimbolo: 'NYSE:DIS',     slug: 'dis'   },
  { ticker: 'SBUX',  nombre: 'Starbucks',      sector: 'Consumo',     icono: 'Cup',        color: 'text-green-600',  tradingviewSimbolo: 'NASDAQ:SBUX',  slug: 'sbux'  },
  { ticker: 'NKE',   nombre: 'Nike',           sector: 'Consumo',     icono: 'Shoe',       color: 'text-red-500',    tradingviewSimbolo: 'NYSE:NKE',     slug: 'nke'   },
  { ticker: 'UBER',  nombre: 'Uber',           sector: 'Transporte',  icono: 'Car',        color: 'text-black',      tradingviewSimbolo: 'NYSE:UBER',    slug: 'uber'  },

  // ── ⚡ Energía — siempre relevante en LATAM ──
  { ticker: 'XOM',   nombre: 'Exxon Mobil',    sector: 'Energía',     icono: 'Zap',        color: 'text-red-600',    tradingviewSimbolo: 'NYSE:XOM',     slug: 'xom'   },
  { ticker: 'CVX',   nombre: 'Chevron',        sector: 'Energía',     icono: 'Zap',        color: 'text-blue-500',   tradingviewSimbolo: 'NYSE:CVX',     slug: 'cvx'   },

  // ── 🚀 Industria — para cobertura macro ──
  { ticker: 'BA',    nombre: 'Boeing',         sector: 'Aeroespacial', icono: 'Plane',     color: 'text-gray-500',   tradingviewSimbolo: 'NYSE:BA',      slug: 'ba'    },
  { ticker: 'CAT',   nombre: 'Caterpillar',    sector: 'Industria',   icono: 'Gear',       color: 'text-orange-500', tradingviewSimbolo: 'NYSE:CAT',     slug: 'cat'   },
];

// ==============================
// CONFIG
// ==============================

const BATCH_SIZE             = 5;    // ← era 3
const DELAY_BETWEEN_BATCHES  = 2000; // ← era 12000
const MAX_REINTENTOS         = 3;
const DELAY_BASE_REINTENTO   = 2000; // ← era 5000
const TIMEOUT_POR_REQUEST    = 10000;

// ==============================
// HELPERS
// ==============================

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

function accionVacia(accion: typeof ACCIONES[0]): AccionData {
  return { ...accion, precio: -1, cambio: 0, cambioPct: 0, alza: false, apertura: 0, maximo: 0, minimo: 0, prevCierre: 0 };
}

function mapQuote(accion: typeof ACCIONES[0], q: FinnhubQuote): AccionData {
  return {
    ...accion,
    precio:     Number(q.c.toFixed(2)),
    cambio:     Number(q.d?.toFixed(2)  ?? 0),
    cambioPct:  Number(q.dp?.toFixed(2) ?? 0),
    alza:       (q.dp ?? 0) >= 0,
    apertura:   Number(q.o?.toFixed(2)  ?? 0),
    maximo:     Number(q.h?.toFixed(2)  ?? 0),
    minimo:     Number(q.l?.toFixed(2)  ?? 0),
    prevCierre: Number(q.pc?.toFixed(2) ?? 0),
  };
}

async function fetchQuoteConBackoff(
  ticker: string,
  apiKey: string,
  intento = 1
): Promise<FinnhubQuote> {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`,
      { signal: AbortSignal.timeout(TIMEOUT_POR_REQUEST) }
    );

    if (res.status === 429) {
      if (intento >= MAX_REINTENTOS) throw new Error(`429 tras ${MAX_REINTENTOS} intentos`);
      const espera = DELAY_BASE_REINTENTO * Math.pow(2, intento);
      console.warn(`⏳ 429 en ${ticker} — esperando ${espera / 1000}s (intento ${intento}/${MAX_REINTENTOS})`);
      await delay(espera);
      return fetchQuoteConBackoff(ticker, apiKey, intento + 1);
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json() as FinnhubQuote;
    if (!data.c) throw new Error('Precio vacío');

    return data;

  } catch (err) {
    if (intento >= MAX_REINTENTOS) throw err;
    const espera = DELAY_BASE_REINTENTO * intento;
    console.warn(`⚠️ Error en ${ticker} — reintentando en ${espera / 1000}s (intento ${intento}/${MAX_REINTENTOS})`);
    await delay(espera);
    return fetchQuoteConBackoff(ticker, apiKey, intento + 1);
  }
}

// ==============================
// FETCH PRINCIPAL
// ==============================

export async function fetchAcciones(apiKey: string): Promise<AccionData[]> {
  const results: AccionData[] = [];

  console.log(`[ACCIONES] Iniciando fetch de ${ACCIONES.length} acciones en lotes de ${BATCH_SIZE}`);

  for (let i = 0; i < ACCIONES.length; i += BATCH_SIZE) {
    const lote = ACCIONES.slice(i, i + BATCH_SIZE);
    const numLote = Math.floor(i / BATCH_SIZE) + 1;
    const totalLotes = Math.ceil(ACCIONES.length / BATCH_SIZE);

    console.log(`[ACCIONES] Lote ${numLote}/${totalLotes}: ${lote.map(a => a.ticker).join(', ')}`);

    for (const accion of lote) {
      try {
        const q = await fetchQuoteConBackoff(accion.ticker, apiKey);
        results.push(mapQuote(accion, q));
        console.log(`✓ ${accion.ticker}: $${q.c}`);
      } catch (err) {
        console.error(`❌ ${accion.ticker} falló definitivamente:`, err);
        results.push(accionVacia(accion));
      }
      await delay(500); // ← era 1500
    }

    if (i + BATCH_SIZE < ACCIONES.length) {
      console.log(`[ACCIONES] Esperando ${DELAY_BETWEEN_BATCHES / 1000}s antes del siguiente lote...`);
      await delay(DELAY_BETWEEN_BATCHES);
    }
  }

  const exitosos = results.filter(r => r.precio > 0).length;
  console.log(`[ACCIONES] Finalizado — ${exitosos}/${ACCIONES.length} acciones obtenidas correctamente`);

  return results;
}


