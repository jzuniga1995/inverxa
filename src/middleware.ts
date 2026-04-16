import { defineMiddleware } from 'astro:middleware';
import { getDb } from './db/index';

const RUTAS_PROTEGIDAS = ['/api/noticias', '/api/buscar'];

export const onRequest = defineMiddleware((context, next) => {
  const dbUrl = context.locals.runtime?.env?.DATABASE_URL;

  if (!dbUrl) {
    throw new Error('DATABASE_URL no está definida en las variables de entorno.');
  }

  // Lazy: solo crea la instancia de Neon cuando alguna página accede a locals.db.
  // Páginas que nunca acceden (herramientas solo-KV) no despiertan la DB.
  let _db: ReturnType<typeof getDb> | undefined;
  Object.defineProperty(context.locals, 'db', {
    get() { return (_db ??= getDb(dbUrl)); },
    configurable: true,
    enumerable: true,
  });

  // Proteger rutas específicas
  const esRutaProtegida = RUTAS_PROTEGIDAS.some(r =>
    context.url.pathname.startsWith(r)
  );

  if (esRutaProtegida) {
    const origin  = context.request.headers.get('origin')  ?? '';
    const referer = context.request.headers.get('referer') ?? '';

    const esPropio =
      origin.includes('inversax.com')  ||
      referer.includes('inversax.com') ||
      origin.includes('localhost')     ||
      referer.includes('localhost');

    if (!esPropio) {
      return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  return next();
});

