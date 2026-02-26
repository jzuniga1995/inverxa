// src/db/index.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

// import.meta.env es de Astro, process.env funciona en tsx y en Astro
const DATABASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.DATABASE_URL)
    ? import.meta.env.DATABASE_URL
    : process.env.DATABASE_URL;

if (!DATABASE_URL) throw new Error('DATABASE_URL no está definida en .env');

const sql = neon(DATABASE_URL);

export const db = drizzle(sql, { schema });

