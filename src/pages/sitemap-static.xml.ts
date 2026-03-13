// src/pages/sitemap-static.xml.ts
import type { APIRoute } from 'astro';
import { getCategorias, getPaises } from '../db/queries';

const SITE = 'https://inversax.com';

function url(path: string, lastmod?: Date, priority = 0.5, changefreq = 'weekly') {
  return `
  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${(lastmod ?? new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

const CRYPTO_IDS = [
  'bitcoin','ethereum','binancecoin','solana','ripple',
  'cardano','dogecoin','tron','avalanche-2','chainlink',
  'polkadot','litecoin','bitcoin-cash','stellar','monero',
  'cosmos','uniswap','aave','filecoin','vechain',
  'hedera-hashgraph','fantom','tezos','near','algorand',
  'internet-computer','flow','eos','decentraland','sandbox',
  'axie-infinity','the-graph','gala','chiliz','basic-attention-token',
  'enjincoin','stepn','aptos','arbitrum','optimism',
  'sui','sei-network','injective-protocol','render-token','helium',
  'livepeer','ocean-protocol','fetch-ai','singularitynet','band-protocol',
  'curve-dao-token','compound','maker','synthetix-network-token','yearn-finance',
  'balancer','1inch','loopring','dydx','pancakeswap-token',
  'shiba-inu','pepe','floki','bonk','dogwifcoin',
  'worldcoin-wld','blur','immutable-x','ronin','axelar',
  'stacks','kaspa','celestia','mantle','pyth-network',
  'jupiter-exchange-solana','jito-governance-token','wormhole','ethena','pendle',
  'bitcoin-sv','dash','zcash','iota','ontology',
  'waves','neo','qtum','icon','zilliqa',
  'nervos-network','harmony','celo','ankr','storj',
  'request-network','civic','moonbeam','numeraire','orbs',
];

const FOREX_PARES = [
  'eur-usd','gbp-usd','usd-jpy','usd-mxn','usd-ars','usd-cop',
  'usd-clp','usd-brl','usd-pen','usd-uyu','usd-pyg','usd-bob',
  'usd-crc','usd-gtq','usd-hnl','usd-nio','usd-dop','aud-usd',
  'usd-cad','usd-chf','usd-cny','usd-inr','usd-krw','usd-sgd',
];

const METALES_SLUGS = ['oro','plata','platino','paladio'];

const ACCIONES_SLUGS = [
  // Tecnología
  'aapl', 'nvda', 'msft', 'meta', 'googl',
  'amd', 'pltr', 'crwd', 'shop',
  // Alta volatilidad
  'tsla', 'amzn', 'nflx', 'coin', 'hood',
  // ETFs
  'spy', 'qqq', 'gld',
  // LATAM
  'meli', 'ec', 'pbr', 'vale', 'glob', 'amx',
  // Finanzas
  'v', 'jpm', 'gs', 'brkb', 'pypl',
  // Salud
  'lly', 'jnj', 'pfe',
  // Consumo
  'ko', 'mcd', 'dis', 'sbux', 'nke', 'uber',
  // Energía
  'xom', 'cvx',
  // Industria
  'ba', 'cat',
];

// Deben coincidir exactamente con los códigos del paisesConfig en [codigo].astro
const DOLAR_PAISES = [
  'ar', // Argentina
  've', // Venezuela
  'mx', // México
  'co', // Colombia
  'cl', // Chile
  'pe', // Perú
  'uy', // Uruguay
  'py', // Paraguay
  'bo', // Bolivia
  'ec', // Ecuador
  'hn', // Honduras
  'gt', // Guatemala
  'cr', // Costa Rica
  'pa', // Panamá
  'do', // República Dominicana
  'sv', // El Salvador
  'ni', // Nicaragua
  'cu', // Cuba
];

export const GET: APIRoute = async ({ locals }) => {
  const db = locals.db;

  const [categorias, paises] = await Promise.all([
    getCategorias(db),
    getPaises(db),
  ]);

  const paisesLocales = paises.filter(p => p.codigo !== 'global');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- ── Páginas estáticas ── -->
  ${url('/',             new Date(), 1.0, 'daily')}
  ${url('/noticias',     new Date(), 0.9, 'daily')}
  ${url('/herramientas', new Date(), 0.7, 'weekly')}
  ${url('/autor/jose-zuniga', new Date(), 0.6, 'monthly')}
  ${url('/acerca',       new Date(), 0.4, 'monthly')}
  ${url('/contacto',     new Date(), 0.4, 'monthly')}
  ${url('/legal',        new Date(), 0.3, 'monthly')}

  <!-- ── Herramientas (índices) ── -->
  ${url('/herramientas/cripto',   new Date(), 0.8, 'daily')}
  ${url('/herramientas/forex',    new Date(), 0.8, 'daily')}
  ${url('/herramientas/metales',  new Date(), 0.7, 'daily')}
  ${url('/herramientas/acciones', new Date(), 0.8, 'daily')}
  ${url('/herramientas/dolar',    new Date(), 0.8, 'daily')}

  <!-- ── Dólar: páginas por país ── -->
  ${DOLAR_PAISES.map(codigo =>
    url(`/herramientas/dolar/${codigo}`, new Date(), 0.7, 'daily')
  ).join('')}

  <!-- ── Cripto: páginas individuales ── -->
  ${CRYPTO_IDS.map(id =>
    url(`/herramientas/cripto/${id}`, new Date(), 0.6, 'daily')
  ).join('')}

  <!-- ── Forex: páginas individuales ── -->
  ${FOREX_PARES.map(par =>
    url(`/herramientas/forex/${par}`, new Date(), 0.6, 'daily')
  ).join('')}

  <!-- ── Metales: páginas individuales ── -->
  ${METALES_SLUGS.map(slug =>
    url(`/herramientas/metales/${slug}`, new Date(), 0.6, 'daily')
  ).join('')}

  <!-- ── Acciones: páginas individuales ── -->
  ${ACCIONES_SLUGS.map(slug =>
    url(`/herramientas/acciones/${slug}`, new Date(), 0.6, 'daily')
  ).join('')}

  <!-- ── Categorías de noticias ── -->
  ${categorias.map(cat =>
    url(`/${cat.slug}`, new Date(), 0.6, 'weekly')
  ).join('')}

  <!-- ── Países ── -->
  ${paisesLocales.map(p =>
    url(`/pais/${p.codigo}`, new Date(), 0.5, 'weekly')
  ).join('')}

</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
