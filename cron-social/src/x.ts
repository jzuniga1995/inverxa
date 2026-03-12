interface XEnv {
  X_API_KEY: string
  X_API_SECRET: string
  X_ACCESS_TOKEN: string
  X_ACCESS_SECRET: string
}

function percentEncode(str: string): string {
  return encodeURIComponent(str)
    .replace(/!/g, '%21').replace(/'/g, '%27')
    .replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/\*/g, '%2A')
}

async function hmacSha1(key: string, data: string): Promise<string> {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw', enc.encode(key), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(data))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

async function buildOAuthHeader(
  env: XEnv,
  method: string,
  url: string
): Promise<string> {
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: env.X_API_KEY,
    oauth_nonce: crypto.randomUUID().replace(/-/g, ''),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_token: env.X_ACCESS_TOKEN,
    oauth_version: '1.0',
  }

  const sortedParams = Object.keys(oauthParams)
    .sort()
    .map(k => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
    .join('&')

  const baseString = [
    method.toUpperCase(),
    percentEncode(url),
    percentEncode(sortedParams)
  ].join('&')

  const signingKey = `${percentEncode(env.X_API_SECRET)}&${percentEncode(env.X_ACCESS_SECRET)}`
  oauthParams['oauth_signature'] = await hmacSha1(signingKey, baseString)

  const header = Object.entries(oauthParams)
    .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
    .join(', ')

  return `OAuth ${header}`
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

function formatTweet(article: { title: string; url: string; category: string }): string {
  const hashtags = categoryToHashtags(article.category)
  return `${article.title}\n\n${article.url}\n\n${hashtags}`
}

export async function postToX(env: XEnv, article: any): Promise<boolean> {
  const url = 'https://api.twitter.com/2/tweets'
  const text = formatTweet(article)

  const authHeader = await buildOAuthHeader(env, 'POST', url)

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text })
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('[X] Error:', res.status, err)
    return false
  }

  console.log('[X] Publicado:', article.title)
  return true
}