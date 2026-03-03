// src/cron/index.ts
import { fetchAcciones } from '../lib/acciones';
import { fetchPrecios   } from '../lib/precios';
import { obtenerForex   } from '../lib/forex';
import { fetchMetales   } from '../lib/metales';

const TOP_COINS = [
  'bitcoin', 'ethereum', 'tether', 'solana', 'xrp',
  'cardano', 'dogecoin', 'binancecoin', 'tron', 'avalanche-2'
];

export default {
  async scheduled(
    _event: ScheduledEvent,
    env: {
      FINNHUB_API_KEY:    string;
      COINGECKO_API_KEY?: string;
      INVERSA_KV:         KVNamespace;
    },
    _ctx: ExecutionContext
  ) {
    console.log('[CRON] Iniciando actualización de mercados...');

    // ── Listas generales (paralelo) ───────────────────────────
    const results = await Promise.allSettled([
      fetchAcciones(env.FINNHUB_API_KEY)
        .then(data =>
          env.INVERSA_KV.put('acciones', JSON.stringify(data), { expirationTtl: 3600 })
            .then(() => console.log(`[CRON] ✓ Acciones — ${data.length} registros`))
        ),
      fetchPrecios(env.COINGECKO_API_KEY)
        .then(data =>
          env.INVERSA_KV.put('cache:precios', JSON.stringify(data), { expirationTtl: 3600 })
            .then(() => console.log(`[CRON] ✓ Cripto — ${data.length} monedas`))
        ),
      obtenerForex()
        .then(data =>
          env.INVERSA_KV.put('cache:forex', JSON.stringify(data), { expirationTtl: 3600 })
            .then(() => console.log(`[CRON] ✓ Forex — ${data.length} pares`))
        ),
      fetchMetales()
        .then(data =>
          env.INVERSA_KV.put('cache:metales', JSON.stringify(data), { expirationTtl: 3600 })
            .then(() => console.log(`[CRON] ✓ Metales — ${data.length} metales`))
        ),
    ]);

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        const nombres = ['Acciones', 'Cripto', 'Forex', 'Metales'];
        console.error(`[CRON] ✗ ${nombres[i]} falló:`, r.reason);
      }
    });

    // ── Pre-calentar detalle de top coins ─────────────────────
    // Esto evita que [id].astro llame CoinGecko en cada visita
    console.log('[CRON] Pre-calentando top coins...');
    for (const coinId of TOP_COINS) {
      try {
        const res = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}?localization=true&tickers=false&market_data=true&community_data=false&developer_data=false`,
          {
            headers: {
              'Accept': 'application/json',
              ...(env.COINGECKO_API_KEY ? { 'x-cg-demo-api-key': env.COINGECKO_API_KEY } : {})
            }
          }
        );
        if (res.ok) {
          const coin = await res.json();
          await env.INVERSA_KV.put(`coin:${coinId}`, JSON.stringify(coin), { expirationTtl: 3600 });
          console.log(`[CRON] ✓ Coin detail — ${coinId}`);
        } else {
          console.warn(`[CRON] ✗ Coin ${coinId} — HTTP ${res.status}`);
        }
      } catch (e) {
        console.error(`[CRON] ✗ Coin ${coinId}:`, e);
      }
      // 2.1s entre calls para respetar el rate limit de 30 RPM
      await new Promise(r => setTimeout(r, 2100));
    }

    console.log('[CRON] Finalizado.');
  }
};

