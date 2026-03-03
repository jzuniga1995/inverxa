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

const METALES = [
  { nombre: 'Oro',     simbolo: 'xau', display: 'XAU', icono: 'CircleDollarSign', color: 'text-yellow-400', tradingviewSimbolo: 'OANDA:XAUUSD', slug: 'oro'     },
  { nombre: 'Plata',   simbolo: 'xag', display: 'XAG', icono: 'Gem',              color: 'text-slate-400',  tradingviewSimbolo: 'OANDA:XAGUSD', slug: 'plata'   },
  { nombre: 'Platino', simbolo: 'xpt', display: 'XPT', icono: 'Hexagon',          color: 'text-sky-300',    tradingviewSimbolo: 'OANDA:XPTUSD', slug: 'platino' },
  { nombre: 'Paladio', simbolo: 'xpd', display: 'XPD', icono: 'Cpu',              color: 'text-purple-400', tradingviewSimbolo: 'OANDA:XPDUSD', slug: 'paladio' },
];

export async function fetchMetales(): Promise<MetalData[]> {
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

