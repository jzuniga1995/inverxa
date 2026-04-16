import { neon } from '@neondatabase/serverless'

export async function getUnpostedArticles(
  sql: any,
  urls: string[]
): Promise<string[]> {
  const normalizedUrls = urls.map(u => u.replace(/\/$/, ''))
  const urlsWithSlash = normalizedUrls.map(u => u + '/')

  const posted = await sql`
    SELECT article_url FROM social_posts
    WHERE article_url = ANY(${normalizedUrls})
    OR article_url = ANY(${urlsWithSlash})
  `
  const postedSet = new Set(
    posted.map((r: any) => r.article_url.replace(/\/$/, ''))
  )
  return normalizedUrls.filter(url => !postedSet.has(url))
}

export async function markAsPosted(
  sql: any,
  articleUrl: string,
  platforms: string[]
): Promise<void> {
  const normalizedUrl = articleUrl.replace(/\/$/, '')
  await sql`
    INSERT INTO social_posts (article_url, posted_to)
    VALUES (${normalizedUrl}, ${platforms})
    ON CONFLICT (article_url)
    DO UPDATE SET posted_to = social_posts.posted_to || ${platforms}
  `
}