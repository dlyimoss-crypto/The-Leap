/**
 * Parses a "Price in USD" form field into books.price_cents. A free book is
 * stored as null — the reader page and the manuscript storage policy both
 * treat only null as free — so blank, zero and invalid input all map to null.
 */
export function parsePriceCents(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  const value = Number.parseFloat(trimmed);
  if (Number.isNaN(value) || value < 0) {
    return null;
  }
  const cents = Math.round(value * 100);
  return cents > 0 ? cents : null;
}
