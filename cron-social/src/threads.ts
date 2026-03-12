interface ThreadsEnv {
  THREADS_ACCESS_TOKEN: string
  THREADS_USER_ID: string
}

function categoryToHashtags(category: string): string {
  const map: Record<string, string> = {
    'Criptomonedas': '#Cripto #Bitcoin',
    'Trading': '#Trading #Forex',
    'Forex': '#Forex #Divisas',
    'Economía': '#Economía #LATAM',
    'Bolsa': '#Bolsa #Acciones',
    'Fintech': '#Fintech',
    'Inversiones': '#Inversiones',
    'Finanzas Personales': '#FinanzasPersonales',
  }
  return map[category] || '#Inversax #Finanzas'
}

function formatThreadsPost(article: any): string {
  const hashtags = categoryToHashtags(article.category)
  return `${article.title}\n\n${article.description}\n\n🔗 ${article.url}\n\n${hashtags}`
}

export async function postToThreads(env: ThreadsEnv, article: any): Promise<boolean> {
  const baseUrl = `https://graph.threads.net/v1.0/${env.THREADS_USER_ID}`

  // Paso 1: crear media container
  const containerRes = await fetch(`${baseUrl}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      media_type: article.imageUrl ? 'IMAGE' : 'TEXT',
      text: formatThreadsPost(article),
      ...(article.imageUrl && { image_url: article.imageUrl }),
      access_token: env.THREADS_ACCESS_TOKEN,
    })
  })

  if (!containerRes.ok) {
    console.error('[Threads] Container error:', await containerRes.text())
    return false
  }

  const { id: containerId } = await containerRes.json() as any

  // Esperar que el container procese
  await new Promise(r => setTimeout(r, 3000))

  // Paso 2: publicar el container
  const publishRes = await fetch(`${baseUrl}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: containerId,
      access_token: env.THREADS_ACCESS_TOKEN,
    })
  })

  if (!publishRes.ok) {
    console.error('[Threads] Publish error:', await publishRes.text())
    return false
  }

  console.log('[Threads] Publicado:', article.title)
  return true
}