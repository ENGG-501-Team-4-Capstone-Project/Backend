const DATA_URL = /^data:image\/(?:jpeg|png|webp|gif);base64,([A-Za-z0-9+/]+={0,2})$/;

export function toDataUrl(image: string): string | null {
  const cleaned = image.replace(/\s+/g, '');
  const url = cleaned.startsWith('data:') ? cleaned : `data:image/jpeg;base64,${cleaned}`;
  const match = DATA_URL.exec(url);
  if (!match || (match[1] !== undefined && match[1].length % 4 !== 0)) return null;
  return url;
}
