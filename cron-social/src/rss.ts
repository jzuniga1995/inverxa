export interface Article {
  title: string
  url: string
  description: string
  category: string
  imageUrl?: string
  pubDate: Date
}

export async function fetchRSS(rssUrl: string): Promise<Article[]> {
  const res = await fetch(rssUrl)
  const xml = await res.text()

  const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || []

  return items.map(item => {
    const get = (tag: string) =>
      item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`))?.[1] ||
      item.match(new RegExp(`<${tag}[^>]*>([^<]*)<\\/${tag}>`))?.[1] || ''

    const imageUrl =
      item.match(/url="([^"]+\.(?:jpg|png|webp))"/)?.[1] ||
      item.match(/<media:content[^>]+url="([^"]+)"/)?.[1]

    return {
      title: get('title').trim(),
      url: get('link').trim(),
      description: get('description').replace(/<[^>]+>/g, '').trim().slice(0, 200),
      category: get('category').trim(),
      imageUrl,
      pubDate: new Date(get('pubDate'))
    }
  }).filter(a => {
    // Solo artículos de las últimas 26 horas (margen del cron diario)
    const cutoff = new Date(Date.now() - 26 * 60 * 60 * 1000)
    return a.pubDate > cutoff && a.url && a.title
  })
}