// src/middleware.ts
import { defineMiddleware } from 'astro:middleware';
import { getDb } from './db/index';

export const onRequest = defineMiddleware((context, next) => {
  const dbUrl = context.locals.runtime?.env?.DATABASE_URL;

  if (!dbUrl) {
    throw new Error('DATABASE_URL no está definida en las variables de entorno.');
  }

  context.locals.db = getDb(dbUrl);
  return next();
});

