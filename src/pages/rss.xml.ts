import rss from '@astrojs/rss';
import { getArticulos } from '../db/queries';

export const prerender = false;

export async function GET(context: any) {
  const db = context.locals.db;
  const articulos = await getArticulos(db, 50);

  return rss({
    title: 'Inversax — Cripto, Trading y Finanzas',
    description: 'Noticias de criptomonedas, trading, forex y bolsa en español para Latinoamérica.',
    site: 'https://inversax.com',
    items: articulos.map((a) => ({
      title: a.titulo,
      pubDate: a.creadoEn ? new Date(a.creadoEn) : new Date(),
      description: a.resumen ?? '',
      link: `/noticias/${a.slug}`,
      ...(a.imagen ? { customData: `<enclosure url="${a.imagen}" type="image/jpeg" />` } : {}),
    })),
  });
}
