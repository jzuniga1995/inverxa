// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema:    './src/db/schema.ts',
  out:       './drizzle',          // carpeta donde se guardan las migraciones
  dialect:   'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});