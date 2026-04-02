/**
 * Inserta transformaciones de Cloudinary en una URL de imagen.
 * Si la URL no es de Cloudinary, la devuelve sin cambios.
 * Si ya tiene transformaciones, no las duplica.
 *
 * Uso:
 *   getCloudinaryUrl(url, 800)  →  .../image/upload/w_800,q_auto,f_auto/v.../file.jpg
 */
export function getCloudinaryUrl(
  url: string | null | undefined,
  width: number,
): string | null {
  if (!url) return null;
  if (!url.includes('/image/upload/')) return url;

  // Si el segmento después de /image/upload/ ya contiene "_" → ya tiene transforms
  const afterUpload = url.split('/image/upload/')[1] ?? '';
  const firstSegment = afterUpload.split('/')[0];
  if (firstSegment.includes('_')) return url;

  return url.replace('/image/upload/', `/image/upload/w_${width},q_auto,f_auto/`);
}
