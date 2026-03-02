// src/cron/index.ts
import { fetchAcciones } from '../pages/api/acciones';

export default {
  async scheduled(
    _event: ScheduledEvent,
    env: { FINNHUB_API_KEY: string; INVERSA_KV: KVNamespace },
    _ctx: ExecutionContext
  ) {
    console.log('[CRON] Actualizando acciones...');
    try {
      const data = await fetchAcciones(env.FINNHUB_API_KEY);
      await env.INVERSA_KV.put('acciones', JSON.stringify(data), { expirationTtl: 7200 });
      console.log(`[CRON] OK — ${data.length} acciones guardadas`);
    } catch (err) {
      console.error('[CRON] Error:', err);
    }
  }
};

