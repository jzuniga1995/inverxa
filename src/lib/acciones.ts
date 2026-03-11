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

export const ACCIONES = [
  { ticker: 'AAPL',  nombre: 'Apple',             sector: 'Tecnología',      icono: 'Smartphone', color: 'text-slate-400',  tradingviewSimbolo: 'NASDAQ:AAPL',  slug: 'aapl'  },
  { ticker: 'MSFT',  nombre: 'Microsoft',          sector: 'Tecnología',      icono: 'Monitor',    color: 'text-blue-400',   tradingviewSimbolo: 'NASDAQ:MSFT',  slug: 'msft'  },
  { ticker: 'NVDA',  nombre: 'NVIDIA',             sector: 'Tecnología',      icono: 'Cpu',        color: 'text-green-500',  tradingviewSimbolo: 'NASDAQ:NVDA',  slug: 'nvda'  },
  { ticker: 'TSLA',  nombre: 'Tesla',              sector: 'Automotriz',      icono: 'Zap',        color: 'text-red-400',    tradingviewSimbolo: 'NASDAQ:TSLA',  slug: 'tsla'  },
  { ticker: 'GOOGL', nombre: 'Alphabet',           sector: 'Tecnología',      icono: 'Globe',      color: 'text-purple-500', tradingviewSimbolo: 'NASDAQ:GOOGL', slug: 'googl' },
  { ticker: 'AMZN',  nombre: 'Amazon',             sector: 'Consumo',         icono: 'Cart',       color: 'text-orange-400', tradingviewSimbolo: 'NASDAQ:AMZN',  slug: 'amzn'  },
  { ticker: 'META',  nombre: 'Meta Platforms',     sector: 'Tecnología',      icono: 'Chat',       color: 'text-blue-600',   tradingviewSimbolo: 'NASDAQ:META',  slug: 'meta'  },
  { ticker: 'NFLX',  nombre: 'Netflix',            sector: 'Entretenimiento', icono: 'Play',       color: 'text-red-600',    tradingviewSimbolo: 'NASDAQ:NFLX',  slug: 'nflx'  },
  { ticker: 'AMD',   nombre: 'AMD',                sector: 'Tecnología',      icono: 'Cpu',        color: 'text-red-500',    tradingviewSimbolo: 'NASDAQ:AMD',   slug: 'amd'   },
  { ticker: 'ADBE',  nombre: 'Adobe',              sector: 'Tecnología',      icono: 'Design',     color: 'text-red-400',    tradingviewSimbolo: 'NASDAQ:ADBE',  slug: 'adbe'  },
  { ticker: 'CRM',   nombre: 'Salesforce',         sector: 'Tecnología',      icono: 'Cloud',      color: 'text-blue-500',   tradingviewSimbolo: 'NYSE:CRM',     slug: 'crm'   },
  { ticker: 'ORCL',  nombre: 'Oracle',             sector: 'Tecnología',      icono: 'Database',   color: 'text-red-600',    tradingviewSimbolo: 'NYSE:ORCL',    slug: 'orcl'  },
  { ticker: 'UBER',  nombre: 'Uber',               sector: 'Transporte',      icono: 'Car',        color: 'text-black',      tradingviewSimbolo: 'NYSE:UBER',    slug: 'uber'  },
  { ticker: 'KO',    nombre: 'Coca-Cola',          sector: 'Consumo',         icono: 'Drink',      color: 'text-red-500',    tradingviewSimbolo: 'NYSE:KO',      slug: 'ko'    },
  { ticker: 'MCD',   nombre: 'McDonalds',          sector: 'Consumo',         icono: 'Burger',     color: 'text-yellow-400', tradingviewSimbolo: 'NYSE:MCD',     slug: 'mcd'   },
  { ticker: 'V',     nombre: 'Visa',               sector: 'Finanzas',        icono: 'CreditCard', color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:V',       slug: 'v'     },
  { ticker: 'MA',    nombre: 'Mastercard',         sector: 'Finanzas',        icono: 'CreditCard', color: 'text-red-400',    tradingviewSimbolo: 'NYSE:MA',      slug: 'ma'    },
  { ticker: 'JPM',   nombre: 'JP Morgan',          sector: 'Finanzas',        icono: 'Bank',       color: 'text-blue-500',   tradingviewSimbolo: 'NYSE:JPM',     slug: 'jpm'   },
  { ticker: 'BAC',   nombre: 'Bank of America',    sector: 'Finanzas',        icono: 'Bank',       color: 'text-blue-400',   tradingviewSimbolo: 'NYSE:BAC',     slug: 'bac'   },
  { ticker: 'GS',    nombre: 'Goldman Sachs',      sector: 'Finanzas',        icono: 'Bank',       color: 'text-gray-600',   tradingviewSimbolo: 'NYSE:GS',      slug: 'gs'    },
  { ticker: 'WMT',   nombre: 'Walmart',            sector: 'Consumo',         icono: 'Store',      color: 'text-green-500',  tradingviewSimbolo: 'NYSE:WMT',     slug: 'wmt'   },
  { ticker: 'HD',    nombre: 'Home Depot',         sector: 'Consumo',         icono: 'House',      color: 'text-orange-500', tradingviewSimbolo: 'NYSE:HD',      slug: 'hd'    },
  { ticker: 'DIS',   nombre: 'Disney',             sector: 'Entretenimiento', icono: 'Castle',     color: 'text-blue-500',   tradingviewSimbolo: 'NYSE:DIS',     slug: 'dis'   },
  { ticker: 'NKE',   nombre: 'Nike',               sector: 'Consumo',         icono: 'Shoe',       color: 'text-red-500',    tradingviewSimbolo: 'NYSE:NKE',     slug: 'nke'   },
  { ticker: 'BA',    nombre: 'Boeing',             sector: 'Aeroespacial',    icono: 'Plane',      color: 'text-gray-500',   tradingviewSimbolo: 'NYSE:BA',      slug: 'ba'    },
  { ticker: 'CAT',   nombre: 'Caterpillar',        sector: 'Industria',       icono: 'Gear',       color: 'text-orange-500', tradingviewSimbolo: 'NYSE:CAT',     slug: 'cat'   },
  { ticker: 'IBM',   nombre: 'IBM',                sector: 'Tecnología',      icono: 'Cpu',        color: 'text-gray-600',   tradingviewSimbolo: 'NYSE:IBM',     slug: 'ibm'   },
  { ticker: 'QCOM',  nombre: 'Qualcomm',           sector: 'Tecnología',      icono: 'Chip',       color: 'text-purple-500', tradingviewSimbolo: 'NASDAQ:QCOM',  slug: 'qcom'  },
  { ticker: 'CSCO',  nombre: 'Cisco',              sector: 'Tecnología',      icono: 'Network',    color: 'text-blue-500',   tradingviewSimbolo: 'NASDAQ:CSCO',  slug: 'csco'  },
  { ticker: 'INTC',  nombre: 'Intel',              sector: 'Tecnología',      icono: 'Cpu',        color: 'text-gray-500',   tradingviewSimbolo: 'NASDAQ:INTC',  slug: 'intc'  },
  { ticker: 'PYPL',  nombre: 'PayPal',             sector: 'Finanzas',        icono: 'CreditCard', color: 'text-blue-400',   tradingviewSimbolo: 'NASDAQ:PYPL',  slug: 'pypl'  },
  { ticker: 'MS',    nombre: 'Morgan Stanley',     sector: 'Finanzas',        icono: 'Bank',       color: 'text-blue-600',   tradingviewSimbolo: 'NYSE:MS',      slug: 'ms'    },
  { ticker: 'TXN',   nombre: 'Texas Instruments',  sector: 'Tecnología',      icono: 'Chip',       color: 'text-green-400',  tradingviewSimbolo: 'NASDAQ:TXN',   slug: 'txn'   },
  { ticker: 'VZ',    nombre: 'Verizon',            sector: 'Telecom',         icono: 'Signal',     color: 'text-red-500',    tradingviewSimbolo: 'NYSE:VZ',      slug: 'vz'    },
  { ticker: 'PEP',   nombre: 'PepsiCo',            sector: 'Consumo',         icono: 'Drink',      color: 'text-blue-500',   tradingviewSimbolo: 'NASDAQ:PEP',   slug: 'pep'   },
  { ticker: 'SBUX',  nombre: 'Starbucks',          sector: 'Consumo',         icono: 'Cup',        color: 'text-green-600',  tradingviewSimbolo: 'NASDAQ:SBUX',  slug: 'sbux'  },
  { ticker: 'DE',    nombre: 'Deere',              sector: 'Industria',       icono: 'Tractor',    color: 'text-green-500',  tradingviewSimbolo: 'NYSE:DE',      slug: 'de'    },
  { ticker: 'ADP',   nombre: 'ADP',                sector: 'Tecnología',      icono: 'Calculator', color: 'text-red-400',    tradingviewSimbolo: 'NASDAQ:ADP',   slug: 'adp'   },
  { ticker: 'SAP',   nombre: 'SAP',                sector: 'Tecnología',      icono: 'Cloud',      color: 'text-green-500',  tradingviewSimbolo: 'NYSE:SAP',     slug: 'sap'   },
  { ticker: 'BRK-B', nombre: 'Berkshire Hathaway', sector: 'Finanzas',        icono: 'Briefcase',  color: 'text-yellow-600', tradingviewSimbolo: 'NYSE:BRK.B',   slug: 'brkb'  },
];

// ==============================
// CONFIG
// ==============================

const BATCH_SIZE             = 3;    // lotes más pequeños = menos presión
const DELAY_BETWEEN_BATCHES  = 12000; // 12s entre lotes → ~15 req/min, muy por debajo del límite
const MAX_REINTENTOS         = 3;    // intentos máximos por ticker
const DELAY_BASE_REINTENTO   = 5000; // delay base para backoff exponencial
const TIMEOUT_POR_REQUEST    = 10000; // 10s timeout por request

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

// Fetch con backoff exponencial — reintenta automáticamente ante 429 o error de red
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

    // Rate limit: espera y reintenta con backoff exponencial
    if (res.status === 429) {
      if (intento >= MAX_REINTENTOS) throw new Error(`429 tras ${MAX_REINTENTOS} intentos`);
      const espera = DELAY_BASE_REINTENTO * Math.pow(2, intento); // 5s, 10s, 20s
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

    // Error de red o timeout: reintenta con backoff
    const espera = DELAY_BASE_REINTENTO * intento; // 5s, 10s
    console.warn(`⚠️ Error en ${ticker} — reintentando en ${espera / 1000}s (intento ${intento}/${MAX_REINTENTOS})`);
    await delay(espera);
    return fetchQuoteConBackoff(ticker, apiKey, intento + 1);
  }
}

// ==============================
// FETCH PRINCIPAL — secuencial por lotes
// ==============================

export async function fetchAcciones(apiKey: string): Promise<AccionData[]> {
  const results: AccionData[] = [];

  console.log(`[ACCIONES] Iniciando fetch de ${ACCIONES.length} acciones en lotes de ${BATCH_SIZE}`);

  for (let i = 0; i < ACCIONES.length; i += BATCH_SIZE) {
    const lote = ACCIONES.slice(i, i + BATCH_SIZE);
    const numLote = Math.floor(i / BATCH_SIZE) + 1;
    const totalLotes = Math.ceil(ACCIONES.length / BATCH_SIZE);

    console.log(`[ACCIONES] Lote ${numLote}/${totalLotes}: ${lote.map(a => a.ticker).join(', ')}`);

    // Procesa el lote — cada ticker con su propio backoff
    for (const accion of lote) {
      try {
        const q = await fetchQuoteConBackoff(accion.ticker, apiKey);
        results.push(mapQuote(accion, q));
        console.log(`✓ ${accion.ticker}: $${q.c}`);
      } catch (err) {
        console.error(`❌ ${accion.ticker} falló definitivamente:`, err);
        results.push(accionVacia(accion)); // nunca corta el proceso
      }

      // Delay entre requests individuales dentro del lote (evita ráfagas)
      await delay(1500);
    }

    // Delay entre lotes (no aplica en el último)
    if (i + BATCH_SIZE < ACCIONES.length) {
      console.log(`[ACCIONES] Esperando ${DELAY_BETWEEN_BATCHES / 1000}s antes del siguiente lote...`);
      await delay(DELAY_BETWEEN_BATCHES);
    }
  }

  const exitosos = results.filter(r => r.precio > 0).length;
  console.log(`[ACCIONES] Finalizado — ${exitosos}/${ACCIONES.length} acciones obtenidas correctamente`);

  return results;
}
