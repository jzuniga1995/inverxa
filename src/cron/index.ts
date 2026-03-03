// src/cron/index.ts
import { fetchAcciones } from '../lib/acciones';
import { fetchPrecios   } from '../lib/precios';
import { obtenerForex   } from '../lib/forex';
import { fetchMetales   } from '../lib/metales';

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

    const results = await Promise.allSettled([

      // ── Acciones (Finnhub) ───────────────────────────────────
      fetchAcciones(env.FINNHUB_API_KEY)
        .then(data =>
          env.INVERSA_KV.put('acciones', JSON.stringify(data), { expirationTtl: 3600 })
            .then(() => console.log(`[CRON] ✓ Acciones — ${data.length} registros`))
        ),

      // ── Cripto (CoinGecko) ───────────────────────────────────
      fetchPrecios(env.COINGECKO_API_KEY)
        .then(data =>
          env.INVERSA_KV.put('cache:precios', JSON.stringify(data), { expirationTtl: 3600 })
            .then(() => console.log(`[CRON] ✓ Cripto — ${data.length} monedas`))
        ),

      // ── Forex (fawazahmed0) ──────────────────────────────────
      obtenerForex()
        .then(data =>
          env.INVERSA_KV.put('cache:forex', JSON.stringify(data), { expirationTtl: 3600 })
            .then(() => console.log(`[CRON] ✓ Forex — ${data.length} pares`))
        ),

      // ── Metales (fawazahmed0) ────────────────────────────────
      fetchMetales()
        .then(data =>
          env.INVERSA_KV.put('cache:metales', JSON.stringify(data), { expirationTtl: 3600 })
            .then(() => console.log(`[CRON] ✓ Metales — ${data.length} metales`))
        ),

    ]);

    // Resumen de errores — si uno falla los demás siguen igual
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        const nombres = ['Acciones', 'Cripto', 'Forex', 'Metales'];
        console.error(`[CRON] ✗ ${nombres[i]} falló:`, r.reason);
      }
    });

    console.log('[CRON] Finalizado.');
  }
};

