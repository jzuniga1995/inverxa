// src/pages/api/newsletter.ts
export const prerender = false;

import type { APIRoute } from 'astro';
import { subscribers } from '../../db/schema';
import { eq } from 'drizzle-orm';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body.email !== 'string') {
      return json({ error: 'Email requerido' }, 400);
    }

    const email = body.email.trim().toLowerCase();
    const pais  = typeof body.pais === 'string' && body.pais.trim() ? body.pais.trim() : null;

    if (!EMAIL_RE.test(email)) {
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
