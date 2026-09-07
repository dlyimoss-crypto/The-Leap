// The square image on the "Journey Complete" card rotates by weekday. Each
// weekday has its own pool of images — add a file under
// public/images/journey-complete/ and append its path to that weekday's
// array to grow the pool. With N images in a weekday's pool, a given photo
// reappears every N occurrences of that weekday (e.g. 3 images per weekday
// means this Tuesday's photo comes back around in 3 weeks), rather than
// showing the exact same picture every single week.
const JOURNEY_COMPLETE_IMAGE_POOLS: Record<number, string[]> = {
  0: ["/images/journey-complete/sunday-1.jpg"],
  1: ["/images/journey-complete/monday-1.jpg"],
  2: ["/images/journey-complete/tuesday-1.jpg"],
  3: ["/images/journey-complete/wednesday-1.jpg"],
  4: ["/images/journey-complete/thursday-1.jpg"],
  5: ["/images/journey-complete/friday-1.jpg"],
  6: ["/images/journey-complete/saturday-1.jpg"],
};

const FALLBACK_IMAGE = "/images/journey-trail.jpg";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function getJourneyCompleteImage(date: Date = new Date()): string {
  const pool = JOURNEY_COMPLETE_IMAGE_POOLS[date.getDay()];
  if (!pool || pool.length === 0) {
    return FALLBACK_IMAGE;
  }

  const weekIndex = Math.floor(date.getTime() / WEEK_MS);
  return pool[weekIndex % pool.length];
}
