
export async function parseJson<T = any>(res: Response): Promise<T> {
  return res.json() as Promise<T>;
}

