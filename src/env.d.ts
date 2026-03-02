// src/env.d.ts
type DrizzleDb = ReturnType<typeof import('./db/index').getDb>;

declare namespace App {
  interface Locals {
    db: DrizzleDb;
    runtime: {
      env: {
        DATABASE_URL: string;
        FINNHUB_API_KEY: string;
        COINGECKO_API_KEY: string;
      };
    };
  }
}

