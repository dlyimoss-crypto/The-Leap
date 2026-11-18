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

/**
 * Display price for a paid book (books.price_cents, always USD) in the
 * reader's locale, e.g. "$12.50" in English. Grouping is off so English
 * output matches the original `$${(cents / 100).toFixed(2)}`.
 */
export function formatBookPrice(locale: string, priceCents: number): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "USD",
    useGrouping: false,
  }).format(priceCents / 100);
}
