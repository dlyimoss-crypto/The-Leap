/**
 * How many hours after the chosen hour a reminder may still go out. The
 * sender runs hourly; this absorbs a missed or late run without sending a
 * 7am reminder to someone who only switched reminders on at 9pm.
 */
const CATCH_UP_HOURS = 3;

function localDateAndHour(now: Date, timeZone: string) {
  let parts: Intl.DateTimeFormatPart[];
  try {
    parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      hourCycle: "h23",
    }).formatToParts(now);
  } catch {
    // An unrecognised time zone string — fall back to UTC rather than
    // never reminding this device.
    return localDateAndHour(now, "UTC");
  }
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")),
  };
}

/**
 * Returns the device's local date (YYYY-MM-DD) if a reminder is due right
 * now — to be stored as last_sent_on once sent — or null if it isn't.
 */
export function reminderDueOn(
  subscription: {
    remind_hour: number;
    time_zone: string;
    last_sent_on: string | null;
  },
  now: Date,
): string | null {
  const { date, hour } = localDateAndHour(now, subscription.time_zone);
  const inWindow =
    hour >= subscription.remind_hour &&
    hour < subscription.remind_hour + CATCH_UP_HOURS;

  return inWindow && subscription.last_sent_on !== date ? date : null;
}
