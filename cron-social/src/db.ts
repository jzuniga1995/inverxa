import { neon } from '@neondatabase/serverless'

export async function getUnpostedArticles(
  databaseUrl: string,
  urls: string[]
): Promise<string[]> {
  const sql = neon(databaseUrl)

  const posted = await sql`
    SELECT article_url FROM social_posts
    WHERE article_url = ANY(${urls})
  `
  const postedSet = new Set(posted.map((r: any) => r.article_url))
  return urls.filter(url => !postedSet.has(url))
}

export async function markAsPosted(
  databaseUrl: string,
  articleUrl: string,
  platforms: string[]
): Promise<void> {
  const sql = neon(databaseUrl)
  await sql`
    INSERT INTO social_posts (article_url, posted_to)
    VALUES (${articleUrl}, ${platforms})
    ON CONFLICT (article_url)
    DO UPDATE SET posted_to = social_posts.posted_to || ${platforms}
  `
}