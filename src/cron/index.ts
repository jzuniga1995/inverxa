// src/cron/index.ts
import { fetchPrecios } from '../lib/precios';
import { obtenerForex } from '../lib/forex';
import { fetchMetales } from '../lib/metales';

const TOP_COINS: string[] = [
  'bitcoin', 'ethereum', 'tether', 'solana', 'xrp',
  'cardano', 'dogecoin', 'binancecoin', 'tron', 'litecoin'
];

export default {
  async scheduled(
    _event: ScheduledEvent,
    env: {
      COINGECKO_API_KEY?: string;
      INVERSA_KV:         KVNamespace;
    },
    _ctx: ExecutionContext
  ) {
    console.log('[CRON] Iniciando actualización de mercados...');

    const results = await Promise.allSettled([
      fetchPrecios(env.COINGECKO_API_KEY)
        .then(data =>
          env.INVERSA_KV.put('cache:precios', JSON.stringify(data), { expirationTtl: 7200 })
            .then(() => console.log(`[CRON] ✓ Cripto — ${data.length} monedas`))
        ),
      obtenerForex()
        .then(data =>
          env.INVERSA_KV.put('cache:forex', JSON.stringify(data), { expirationTtl: 7200 })
            .then(() => console.log(`[CRON] ✓ Forex — ${data.length} pares`))
        ),
      fetchMetales()
        .then(data =>
          env.INVERSA_KV.put('cache:metales', JSON.stringify(data), { expirationTtl: 7200 })
            .then(() => console.log(`[CRON] ✓ Metales — ${data.length} metales`))
        ),
    ]);

    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        const nombres = ['Cripto', 'Forex', 'Metales'];
        console.error(`[CRON] ✗ ${nombres[i]} falló:`, r.reason);
      }
    });

    // Pre-calentar top coins
    console.log('[CRON] Pre-calentando top coins...');
    const topCoinsData: Record<string, any> = {};

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
          topCoinsData[coinId] = await res.json();
          console.log(`[CRON] ✓ Coin — ${coinId}`);
        } else {
          console.warn(`[CRON] ✗ Coin ${coinId} — HTTP ${res.status}`);
        }
      } catch (e) {
        console.error(`[CRON] ✗ Coin ${coinId}:`, e);
      }
      await new Promise(r => setTimeout(r, 2100));
    }

    await env.INVERSA_KV.put('cache:top-coins', JSON.stringify(topCoinsData), { expirationTtl: 7200 });
    console.log(`[CRON] ✓ Top coins guardado — ${Object.keys(topCoinsData).length} monedas`);

    console.log('[CRON] Finalizado.');
  }
};

