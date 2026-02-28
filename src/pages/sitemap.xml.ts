// src/pages/sitemap.xml.ts
import type { APIRoute } from 'astro';
import { getArticulos, getCategorias, getPaises } from '../db/queries';

const SITE = 'https://inversax.com';

function url(path: string, lastmod?: Date, priority = 0.5, changefreq = 'weekly') {
  return `
  <url>
    <loc>${SITE}${path}</loc>
    <lastmod>${(lastmod ?? new Date()).toISOString().split('T')[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = async () => {
  const [articulos, categorias, paises] = await Promise.all([
    getArticulos(1000),
    getCategorias(),
    getPaises(),
  ]);

  const paisesLocales = paises.filter(p => p.codigo !== 'global');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <!-- Páginas estáticas -->
  ${url('/',             new Date(), 1.0, 'daily')}
  ${url('/noticias',     new Date(), 0.8, 'daily')}
  ${url('/paises',       new Date(), 0.6, 'monthly')}
  ${url('/herramientas', new Date(), 0.5, 'monthly')}

  <!-- Herramientas disponibles -->
  ${url('/herramientas/cripto', new Date(), 0.7, 'daily')}

  <!-- Categorías -->
  ${categorias.map(cat =>
    url(`/${cat.slug}`, new Date(), 0.6, 'weekly')
  ).join('')}

  <!-- Países -->
  ${paisesLocales.map(p =>
    url(`/pais/${p.codigo}`, new Date(), 0.5, 'weekly')
  ).join('')}

  <!-- Artículos destacados -->
  ${articulos.filter(a => a.destacado).map(a =>
    url(`/noticias/${a.slug}`, a.creadoEn ?? new Date(), 0.9, 'daily')
  ).join('')}

  <!-- Artículos normales -->
  ${articulos.filter(a => !a.destacado).map(a =>
    url(`/noticias/${a.slug}`, a.creadoEn ?? new Date(), 0.7, 'weekly')
  ).join('')}

</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
