export interface PrecioData {
  id:        string;
  name:      string;
  symbol:    string;
  image:     string;
  price:     number;
  change24:  number;
  change7:   number;
  marketCap: number;
  volume:    number;
  rank:      number;
}

export async function fetchPrecios(apiKey?: string): Promise<PrecioData[]> {
  const res = await fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=7d`,
    { headers: { 
        'Accept': 'application/json',
        ...(apiKey ? { 'x-cg-demo-api-key': apiKey } : {})
    }}
  );
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  const raw = await res.json() as any[];
  return raw.map((c: any) => ({
    id:        c.id,
    name:      c.name,
    symbol:    c.symbol.toUpperCase(),
    image:     c.image,
    price:     c.current_price,
    change24:  c.price_change_percentage_24h            ?? 0,
    change7:   c.price_change_percentage_7d_in_currency ?? 0,
    marketCap: c.market_cap,
    volume:    c.total_volume,
    rank:      c.market_cap_rank,
  }));
}

