// ==============================
// TIPOS
// ==============================

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
}

interface FinnhubQuote {
  c: number;  // current price
  d: number;  // change
  dp: number; // percent change
  h: number;
  l: number;
  o: number;
  pc: number;
}

// ==============================
// LISTA BASE (ejemplo reducido)
// Usa tu lista completa aquí
// ==============================

// ==============================
// LISTA COMPLETA DE 50 ACCIONES
// ==============================
export const ACCIONES = [
  { ticker: 'AAPL', nombre: 'Apple', sector: 'Tecnología', icono: 'Smartphone', color: 'text-slate-400', tradingviewSimbolo: 'NASDAQ:AAPL', slug: 'aapl' },
  { ticker: 'MSFT', nombre: 'Microsoft', sector: 'Tecnología', icono: 'Monitor', color: 'text-blue-400', tradingviewSimbolo: 'NASDAQ:MSFT', slug: 'msft' },
  { ticker: 'NVDA', nombre: 'NVIDIA', sector: 'Tecnología', icono: 'Cpu', color: 'text-green-500', tradingviewSimbolo: 'NASDAQ:NVDA', slug: 'nvda' },
  { ticker: 'TSLA', nombre: 'Tesla', sector: 'Automotriz', icono: 'Zap', color: 'text-red-400', tradingviewSimbolo: 'NASDAQ:TSLA', slug: 'tsla' },
  { ticker: 'BRK-B', nombre: 'Berkshire Hathaway', sector: 'Finanzas', icono: 'Briefcase', color: 'text-yellow-600', tradingviewSimbolo: 'NYSE:BRK.B', slug: 'brkb' },
  { ticker: 'GOOGL', nombre: 'Alphabet', sector: 'Tecnología', icono: 'Globe', color: 'text-purple-500', tradingviewSimbolo: 'NASDAQ:GOOGL', slug: 'googl' },
  { ticker: 'AMZN', nombre: 'Amazon', sector: 'Consumo', icono: 'Cart', color: 'text-orange-400', tradingviewSimbolo: 'NASDAQ:AMZN', slug: 'amzn' },
  { ticker: 'META', nombre: 'Meta Platforms', sector: 'Tecnología', icono: 'Chat', color: 'text-blue-600', tradingviewSimbolo: 'NASDAQ:META', slug: 'meta' },
  { ticker: 'NFLX', nombre: 'Netflix', sector: 'Entretenimiento', icono: 'Play', color: 'text-red-600', tradingviewSimbolo: 'NASDAQ:NFLX', slug: 'nflx' },
  { ticker: 'INTC', nombre: 'Intel', sector: 'Tecnología', icono: 'Cpu', color: 'text-gray-500', tradingviewSimbolo: 'NASDAQ:INTC', slug: 'intc' },
  { ticker: 'AMD', nombre: 'AMD', sector: 'Tecnología', icono: 'Cpu', color: 'text-red-500', tradingviewSimbolo: 'NASDAQ:AMD', slug: 'amd' },
  { ticker: 'PYPL', nombre: 'PayPal', sector: 'Finanzas', icono: 'CreditCard', color: 'text-blue-400', tradingviewSimbolo: 'NASDAQ:PYPL', slug: 'pypl' },
  { ticker: 'ADBE', nombre: 'Adobe', sector: 'Tecnología', icono: 'Design', color: 'text-red-400', tradingviewSimbolo: 'NASDAQ:ADBE', slug: 'adbe' },
  { ticker: 'CRM', nombre: 'Salesforce', sector: 'Tecnología', icono: 'Cloud', color: 'text-blue-500', tradingviewSimbolo: 'NYSE:CRM', slug: 'crm' },
  { ticker: 'ORCL', nombre: 'Oracle', sector: 'Tecnología', icono: 'Database', color: 'text-red-600', tradingviewSimbolo: 'NYSE:ORCL', slug: 'orcl' },
  { ticker: 'UBER', nombre: 'Uber', sector: 'Transporte', icono: 'Car', color: 'text-black', tradingviewSimbolo: 'NYSE:UBER', slug: 'uber' },
  { ticker: 'LYFT', nombre: 'Lyft', sector: 'Transporte', icono: 'Car', color: 'text-pink-400', tradingviewSimbolo: 'NASDAQ:LYFT', slug: 'lyft' },
  { ticker: 'KO', nombre: 'Coca-Cola', sector: 'Consumo', icono: 'Drink', color: 'text-red-500', tradingviewSimbolo: 'NYSE:KO', slug: 'ko' },
  { ticker: 'PEP', nombre: 'PepsiCo', sector: 'Consumo', icono: 'Drink', color: 'text-blue-500', tradingviewSimbolo: 'NASDAQ:PEP', slug: 'pep' },
  { ticker: 'MCD', nombre: 'McDonalds', sector: 'Consumo', icono: 'Burger', color: 'text-yellow-400', tradingviewSimbolo: 'NYSE:MCD', slug: 'mcd' },
  { ticker: 'SBUX', nombre: 'Starbucks', sector: 'Consumo', icono: 'Cup', color: 'text-green-600', tradingviewSimbolo: 'NASDAQ:SBUX', slug: 'sbux' },
  { ticker: 'V', nombre: 'Visa', sector: 'Finanzas', icono: 'CreditCard', color: 'text-blue-400', tradingviewSimbolo: 'NYSE:V', slug: 'v' },
  { ticker: 'MA', nombre: 'Mastercard', sector: 'Finanzas', icono: 'CreditCard', color: 'text-red-400', tradingviewSimbolo: 'NYSE:MA', slug: 'ma' },
  { ticker: 'JPM', nombre: 'JP Morgan', sector: 'Finanzas', icono: 'Bank', color: 'text-blue-500', tradingviewSimbolo: 'NYSE:JPM', slug: 'jpm' },
  { ticker: 'BAC', nombre: 'Bank of America', sector: 'Finanzas', icono: 'Bank', color: 'text-blue-400', tradingviewSimbolo: 'NYSE:BAC', slug: 'bac' },
  { ticker: 'C', nombre: 'Citigroup', sector: 'Finanzas', icono: 'Bank', color: 'text-red-600', tradingviewSimbolo: 'NYSE:C', slug: 'c' },
  { ticker: 'WMT', nombre: 'Walmart', sector: 'Consumo', icono: 'Store', color: 'text-green-500', tradingviewSimbolo: 'NYSE:WMT', slug: 'wmt' },
  { ticker: 'TGT', nombre: 'Target', sector: 'Consumo', icono: 'Store', color: 'text-red-400', tradingviewSimbolo: 'NYSE:TGT', slug: 'tgt' },
  { ticker: 'HD', nombre: 'Home Depot', sector: 'Consumo', icono: 'House', color: 'text-orange-500', tradingviewSimbolo: 'NYSE:HD', slug: 'hd' },
  { ticker: 'LOW', nombre: 'Lowe’s', sector: 'Consumo', icono: 'House', color: 'text-blue-400', tradingviewSimbolo: 'NYSE:LOW', slug: 'low' },
  { ticker: 'DIS', nombre: 'Disney', sector: 'Entretenimiento', icono: 'Castle', color: 'text-blue-500', tradingviewSimbolo: 'NYSE:DIS', slug: 'dis' },
  { ticker: 'CMCSA', nombre: 'Comcast', sector: 'Entretenimiento', icono: 'Tv', color: 'text-gray-500', tradingviewSimbolo: 'NASDAQ:CMCSA', slug: 'cmcsa' },
  { ticker: 'VZ', nombre: 'Verizon', sector: 'Telecom', icono: 'Signal', color: 'text-red-500', tradingviewSimbolo: 'NYSE:VZ', slug: 'vz' },
  { ticker: 'T', nombre: 'AT&T', sector: 'Telecom', icono: 'Signal', color: 'text-blue-400', tradingviewSimbolo: 'NYSE:T', slug: 't' },
  { ticker: 'NKE', nombre: 'Nike', sector: 'Consumo', icono: 'Shoe', color: 'text-red-500', tradingviewSimbolo: 'NYSE:NKE', slug: 'nke' },
  { ticker: 'SNE', nombre: 'Sony', sector: 'Tecnología', icono: 'Tv', color: 'text-purple-500', tradingviewSimbolo: 'NYSE:SNE', slug: 'sne' },
  { ticker: 'BA', nombre: 'Boeing', sector: 'Aeroespacial', icono: 'Plane', color: 'text-gray-500', tradingviewSimbolo: 'NYSE:BA', slug: 'ba' },
  { ticker: 'CAT', nombre: 'Caterpillar', sector: 'Industria', icono: 'Gear', color: 'text-orange-500', tradingviewSimbolo: 'NYSE:CAT', slug: 'cat' },
  { ticker: 'DE', nombre: 'Deere', sector: 'Industria', icono: 'Tractor', color: 'text-green-500', tradingviewSimbolo: 'NYSE:DE', slug: 'de' },
  { ticker: 'GS', nombre: 'Goldman Sachs', sector: 'Finanzas', icono: 'Bank', color: 'text-gray-600', tradingviewSimbolo: 'NYSE:GS', slug: 'gs' },
  { ticker: 'MS', nombre: 'Morgan Stanley', sector: 'Finanzas', icono: 'Bank', color: 'text-blue-600', tradingviewSimbolo: 'NYSE:MS', slug: 'ms' },
  { ticker: 'IBM', nombre: 'IBM', sector: 'Tecnología', icono: 'Cpu', color: 'text-gray-600', tradingviewSimbolo: 'NYSE:IBM', slug: 'ibm' },
  { ticker: 'QCOM', nombre: 'Qualcomm', sector: 'Tecnología', icono: 'Chip', color: 'text-purple-500', tradingviewSimbolo: 'NASDAQ:QCOM', slug: 'qcom' },
  { ticker: 'TXN', nombre: 'Texas Instruments', sector: 'Tecnología', icono: 'Chip', color: 'text-green-400', tradingviewSimbolo: 'NASDAQ:TXN', slug: 'txn' },
  { ticker: 'AMD', nombre: 'AMD', sector: 'Tecnología', icono: 'Cpu', color: 'text-red-500', tradingviewSimbolo: 'NASDAQ:AMD', slug: 'amd2' },
  { ticker: 'INTU', nombre: 'Intuit', sector: 'Tecnología', icono: 'Calculator', color: 'text-blue-400', tradingviewSimbolo: 'NASDAQ:INTU', slug: 'intu' },
  { ticker: 'CSCO', nombre: 'Cisco', sector: 'Tecnología', icono: 'Network', color: 'text-blue-500', tradingviewSimbolo: 'NASDAQ:CSCO', slug: 'csco' },
  { ticker: 'VMW', nombre: 'VMware', sector: 'Tecnología', icono: 'Cloud', color: 'text-gray-500', tradingviewSimbolo: 'NYSE:VMW', slug: 'vmw' },
  { ticker: 'SAP', nombre: 'SAP', sector: 'Tecnología', icono: 'Cloud', color: 'text-green-500', tradingviewSimbolo: 'NYSE:SAP', slug: 'sap' },
  { ticker: 'ADP', nombre: 'ADP', sector: 'Tecnología', icono: 'Calculator', color: 'text-red-400', tradingviewSimbolo: 'NASDAQ:ADP', slug: 'adp' }
];

// ==============================
// FETCH INDIVIDUAL
// ==============================

async function fetchQuote(ticker: string, apiKey: string): Promise<FinnhubQuote> {
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`,
    { signal: AbortSignal.timeout(8000) }
  );

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json() as Promise<FinnhubQuote>;
}

// ==============================
// FETCH OPTIMIZADO EN LOTES
// ==============================

export async function fetchAcciones(apiKey: string): Promise<AccionData[]> {

  const results: AccionData[] = [];

  const BATCH_SIZE = 10;               // requests paralelos
  const DELAY_BETWEEN_BATCHES = 1200;  // pausa entre lotes

  for (let i = 0; i < ACCIONES.length; i += BATCH_SIZE) {

    const batch = ACCIONES.slice(i, i + BATCH_SIZE);

    const promises = batch.map(async (accion) => {

      try {
        const q = await fetchQuote(accion.ticker, apiKey);

        // Validación por si Finnhub devuelve datos vacíos
        if (q.c == null) {
          throw new Error("Sin precio");
        }

        return {
          ...accion,
          precio: Number(q.c.toFixed(2)),
          cambio: Number(q.d?.toFixed(2) ?? 0),
          cambioPct: Number(q.dp?.toFixed(2) ?? 0),
          alza: (q.dp ?? 0) >= 0,
        };

      } catch (err) {

        console.error(`❌ Error con ${accion.ticker}:`, err);

        return {
          ...accion,
          precio: -1,   // mejor que 0 para detectar fallo
          cambio: 0,
          cambioPct: 0,
          alza: false
        };
      }

    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);

    // Espera entre lotes para evitar rate limit
    if (i + BATCH_SIZE < ACCIONES.length) {
      await new Promise(res => setTimeout(res, DELAY_BETWEEN_BATCHES));
    }
  }

  return results;
}

