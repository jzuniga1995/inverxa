// src/pages/api/newsletter.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { subscribers } from '../../db/schema';
import { eq } from 'drizzle-orm';

const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_MAX  = 254;  // RFC 5321 limit
const PAIS_MAX   = 10;
const BODY_MAX   = 1024; // 1 KB

// ── Rate limiting (in-memory, por IP) ────────────────────────
// En Cloudflare Workers cada instancia es independiente, pero
// aun así frena ráfagas rápidas desde la misma IP en la misma instancia.
const rateMap  = new Map<string, { count: number; resetAt: number }>();
const RATE_MAX = 3;           // intentos máximos
const RATE_WIN = 60_000;      // ventana de 60 s

function checkRate(ip: string): boolean {
  const now   = Date.now();

  // Limpiar entradas expiradas para no crecer indefinidamente
  if (rateMap.size > 500) {
    for (const [k, v] of rateMap) {
      if (now > v.resetAt) rateMap.delete(k);
    }
  }

  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WIN });
    return true;
  }
  if (entry.count >= RATE_MAX) return false;
  entry.count++;
  return true;
}

// ── Handler ───────────────────────────────────────────────────
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Tamaño del payload (header early-reject)
    const contentLength = Number(request.headers.get('content-length') ?? 0);
    if (contentLength > BODY_MAX) {
      return json({ error: 'Payload demasiado grande' }, 413);
    }

    // 2. Rate limiting por IP
    const ip = request.headers.get('cf-connecting-ip')
            ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            ?? 'unknown';
    if (!checkRate(ip)) {
      return json({ error: 'Demasiadas solicitudes. Intenta más tarde.' }, 429);
    }

    // 3. Leer body como texto (segunda barrera de tamaño)
    const raw = await request.text();
    if (raw.length > BODY_MAX) {
      return json({ error: 'Payload demasiado grande' }, 413);
    }

    let body: unknown;
    try { body = JSON.parse(raw); } catch { body = null; }

    if (!body || typeof (body as Record<string, unknown>).email !== 'string') {
      return json({ error: 'Email requerido' }, 400);
    }

    const b     = body as Record<string, unknown>;
    const email = (b.email as string).trim().toLowerCase();
    const pais  = typeof b.pais === 'string' && b.pais.trim()
                    ? b.pais.trim().slice(0, PAIS_MAX)
                    : null;

    // 4. Longitud + formato de email
    if (email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
      return json({ error: 'Email no válido' }, 400);
    }

    const db = locals.db;

    const existing = await db
      .select({ id: subscribers.id })
      .from(subscribers)
      .where(eq(subscribers.email, email))
      .limit(1);

    if (existing.length > 0) {
      return json({ error: 'Ya estás suscrito' }, 409);
    }

    await db.insert(subscribers).values({ email, pais });

    return json({ success: true }, 200);

  } catch (error) {
    console.error('[/api/newsletter]', error);
    return json({ error: 'Error interno' }, 500);
  }
};

function json(data: object, status: number) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
