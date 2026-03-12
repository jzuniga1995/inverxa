import { fetchRSS } from './rss'
import { getUnpostedArticles, markAsPosted } from './db'
import { postToX } from './x'
import { postToThreads } from './threads'

interface Env {
  DATABASE_URL: string
  X_API_KEY: string
  X_API_SECRET: string
  X_ACCESS_TOKEN: string
  X_ACCESS_SECRET: string
  THREADS_ACCESS_TOKEN: string
  THREADS_USER_ID: string
}

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(run(env))
  },

  // Para testear manualmente con GET /
  async fetch(_req: Request, env: Env) {
    await run(env)
    return new Response('OK')
  }
}

async function run(env: Env) {
  console.log('[Social] Iniciando cron...')

  // 1. Leer RSS
  const articles = await fetchRSS('https://inversax.com/rss.xml')
  console.log(`[Social] ${articles.length} artículos recientes en RSS`)

  if (articles.length === 0) {
    console.log('[Social] No hay artículos nuevos, terminando.')
    return
  }

  // 2. Filtrar no publicados
  const allUrls = articles.map(a => a.url)
  const unpostedUrls = await getUnpostedArticles(env.DATABASE_URL, allUrls)
  const toPost = articles.filter(a => 
    unpostedUrls.includes(a.url.replace(/\/$/, ''))
  )

  console.log(`[Social] ${toPost.length} artículos por publicar`)

  // 3. Publicar uno por uno
  for (const article of toPost) {
    const results = await Promise.allSettled([
      postToX(env, article),
      postToThreads(env, article)
    ])

    const platforms: string[] = []
    if ((results[0] as PromiseFulfilledResult<boolean>)?.value) platforms.push('x')
    if ((results[1] as PromiseFulfilledResult<boolean>)?.value) platforms.push('threads')

    if (platforms.length > 0) {
      await markAsPosted(env.DATABASE_URL, article.url, platforms)
      console.log(`[Social] Publicado en: ${platforms.join(', ')} — ${article.title}`)
    }

    // Delay entre artículos
    await new Promise(r => setTimeout(r, 5000))
  }

  console.log('[Social] Cron completado')
}