import { fetchAcciones } from '../lib/acciones';

const TOP_ACCIONES = [
  'aapl', 'nvda', 'tsla', 'msft', 'amzn',
  'meta', 'googl', 'meli', 'coin', 'pltr',
  'nflx', 'brkb',  'ko',  'spy',  'qqq',
  'ec',   'shop',  'lly', 'jpm',  'uber'
];

async function run(env: any) {
  console.log('[CRON-ACCIONES] Iniciando...');

  try {
    const data = await fetchAcciones(env.FINNHUB_API_KEY);

    if (!data || data.length === 0) {
      console.error('[CRON-ACCIONES] ❌ Sin datos de Finnhub');
      return;
    }

    await env.INVERSA_KV.put(
      'acciones',
      JSON.stringify(data),
      { expirationTtl: 7200 }
    );
    console.log(`[CRON-ACCIONES] ✓ Acciones — ${data.length} registros`);

    const topAccionesData: Record<string, any> = {};

    for (const slug of TOP_ACCIONES) {
      const found = data.find((a: any) => a.slug === slug);
      if (!found) {
        console.warn(`[CRON-ACCIONES] ⚠️ No encontrado: ${slug}`);
        continue;
      }
      topAccionesData[slug] = {
        accion: found,
        quote: {
          precio:     found.precio,
          apertura:   found.apertura,
          maximo:     found.maximo,
          minimo:     found.minimo,
          prevCierre: found.prevCierre,
          cambioPct:  found.cambioPct,
        }
      };
    }

    await env.INVERSA_KV.put(
      'cache:top-acciones',
      JSON.stringify(topAccionesData),
      { expirationTtl: 7200 }
    );

    console.log('[CRON-ACCIONES] ✓ Finalizado correctamente.');

  } catch (err) {
    console.error('[CRON-ACCIONES] ❌ Error fatal:', err);
  }
}

export default {
  async scheduled(_event: ScheduledEvent, env: any, ctx: ExecutionContext) {
    ctx.waitUntil(run(env)); // ← el cambio más importante
  }
};

