import { getDb } from '../db/index';
import { getArticulos } from '../db/queries';

interface Env {
  INVERSA_KV: KVNamespace;
  DATABASE_URL: string;
}

async function run(env: Env) {
  console.log('[CRON-NOTICIAS] Iniciando...');

  const db       = getDb(env.DATABASE_URL);
  const articulos = await getArticulos(db, 500);

  await env.INVERSA_KV.put(
    'cache:noticias',
    JSON.stringify(articulos),
    { expirationTtl: 7200 },
  );

  console.log(`[CRON-NOTICIAS] ✓ ${articulos.length} artículos guardados en KV`);
  console.log('[CRON-NOTICIAS] Finalizado.');
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(run(env));
  },
};
