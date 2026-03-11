// src/pages/sitemap-noticias.xml.ts
import type { APIRoute } from 'astro';
import { getArticulos } from '../db/queries';

const SITE = 'https://inversax.com';
const POR_ARCHIVO = 1000;

export const GET: APIRoute = async ({ locals, url }) => {
  const db = locals.db;
  const page = Number(url.searchParams.get('page') ?? '1');

  const todos = await getArticulos(db, 99999);
  const inicio = (page - 1) * POR_ARCHIVO;
  const articulos = todos.slice(inicio, inicio + POR_ARCHIVO);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- ── Artículos destacados ── -->
  ${articulos.filter(a => a.destacado).map(a => `
  <url>
    <loc>${SITE}/noticias/${a.slug}</loc>
    <lastmod>${(a.creadoEn ?? new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}

  <!-- ── Artículos normales ── -->
  ${articulos.filter(a => !a.destacado).map(a => `
  <url>
    <loc>${SITE}/noticias/${a.slug}</loc>
    <lastmod>${(a.creadoEn ?? new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
