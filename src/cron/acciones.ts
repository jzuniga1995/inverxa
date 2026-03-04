import { fetchAcciones } from '../lib/acciones';

const TOP_ACCIONES = [
  'aapl', 'nvda', 'tsla', 'msft', 'amzn',
  'meta', 'googl', 'spy',  'qqq',  'amd',
  'jpm',  'v',    'nflx', 'brkb', 'lly'
];

export default {
  async scheduled(_event: ScheduledEvent, env: any, _ctx: ExecutionContext) {
    console.log('[CRON-ACCIONES] Iniciando...');

    const data = await fetchAcciones(env.FINNHUB_API_KEY);
    await env.INVERSA_KV.put('acciones', JSON.stringify(data), { expirationTtl: 7200 });
    console.log(`[CRON-ACCIONES] ✓ Acciones — ${data.length} registros`);

    // Pre-calentar top acciones — sin calls extra a Finnhub
    const topAccionesData: Record<string, any> = {};
    for (const slug of TOP_ACCIONES) {
      const found = data.find((a: any) => a.slug === slug);
      if (!found) continue;
      topAccionesData[slug] = {
        accion: found,
        quote: {
          precio:    found.precio,
          apertura:  0,
          maximo:    0,
          minimo:    0,
          prevCierre: 0,
          cambioPct: found.cambioPct,
        }
      };
    }

    await env.INVERSA_KV.put('cache:top-acciones', JSON.stringify(topAccionesData), { expirationTtl: 7200 });
    console.log('[CRON-ACCIONES] Finalizado.');
  }
};

