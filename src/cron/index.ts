// src/cron/index.ts
import { fetchAcciones } from '../lib/acciones';
import { fetchPrecios   } from '../lib/precios';
import { obtenerForex   } from '../lib/forex';
import { fetchMetales   } from '../lib/metales';

const TOP_COINS: string[] = [
  'bitcoin', 'ethereum', 'tether', 'solana', 'xrp',
  'cardano', 'dogecoin', 'binancecoin', 'tron', 'litecoin'
];

const TOP_ACCIONES: string[] = [
  'aapl', 'nvda', 'tsla', 'msft', 'amzn',
  'meta', 'googl', 'spy',  'qqq',  'amd',
  'jpm',  'v',    'nflx', 'brk.b','lly'
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

    // ── 1. Listas generales (paralelo) ────────────────────────
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

    // ── 2. Pre-calentar detalle de top coins ──────────────────
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
          console.log(`[CRON] ✓ Coin — ${coinId}`);
        } else {
          console.warn(`[CRON] ✗ Coin ${coinId} — HTTP ${res.status}`);
        }
      } catch (e) {
        console.error(`[CRON] ✗ Coin ${coinId}:`, e);
      }
      // 2.1s entre calls — respeta el límite de 30 RPM de CoinGecko Demo
      await new Promise(r => setTimeout(r, 2100));
    }

    // ── 3. Pre-calentar detalle de top acciones ───────────────
    console.log('[CRON] Pre-calentando top acciones...');

    // Leer la lista una sola vez — no llamar KV 15 veces
    const listaAcciones = await env.INVERSA_KV.get('acciones', 'json') as any[] | null;

    if (!listaAcciones || listaAcciones.length === 0) {
      console.warn('[CRON] Lista de acciones vacía, saltando pre-calentamiento');
    } else {
      for (const slugAccion of TOP_ACCIONES) {
        try {
          const found = listaAcciones.find((a: any) => a.slug === slugAccion) ?? null;
          if (!found) {
            console.warn(`[CRON] ✗ Accion ${slugAccion} no encontrada en lista`);
            continue;
          }

          const qRes = await fetch(
            `https://finnhub.io/api/v1/quote?symbol=${found.ticker}&token=${env.FINNHUB_API_KEY}`
          );
          if (qRes.ok) {
            const qData = await qRes.json() as any;
            const quote = {
              precio:     qData.c,
              apertura:   qData.o,
              maximo:     qData.h,
              minimo:     qData.l,
              prevCierre: qData.pc,
              cambioPct:  qData.pc > 0 ? ((qData.c - qData.pc) / qData.pc) * 100 : 0,
            };
            await env.INVERSA_KV.put(
              `accion:${slugAccion}`,
              JSON.stringify({ accion: found, quote }),
              { expirationTtl: 3600 }
            );
            console.log(`[CRON] ✓ Accion — ${slugAccion}`);
          } else {
            console.warn(`[CRON] ✗ Accion ${slugAccion} — HTTP ${qRes.status}`);
          }
        } catch (e) {
          console.error(`[CRON] ✗ Accion ${slugAccion}:`, e);
        }
        // 500ms entre calls — respeta el límite de 60 RPM de Finnhub
        await new Promise(r => setTimeout(r, 500));
      }
    }

    console.log('[CRON] Finalizado.');
  }
};
