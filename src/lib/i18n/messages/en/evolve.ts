// EVOLVE hub, Daily Devotion (incl. reminders + push copy), Scripture.
// English is the source of truth: the type of every other language's
// `evolve` messages is derived from this object, so add keys here first.
// Annotate function parameters (they can't be inferred). Function-valued
// messages may only be used in server components; client components get
// plain strings (see ../../format.ts for interpolate/plural helpers).
//
// Bible text, book names, references and Bible translation names are
// content, not interface: they never go in here.

export const evolve = {
  hub: {
    tagline: "I am becoming.",
    scriptureTitle: "Scripture",
    scriptureDescription: "Read, search, study and save God's Word.",
    devotionTitle: "Daily Devotion",
    devotionDescription: "Pause, reflect and encounter God in today's thought.",
    booksTitle: "Books & Literature",
    booksDescription:
      "Go deeper through books, teachings and curated resources.",
  },
  devotion: {
    heading: "Daily Devotion",
    subheading: "Pause, reflect and encounter God in today's thought.",
    lockedHeading: "You've already picked one from the archive today",
    lockedBody:
      "You can read one past devotion a day — this one unlocks again tomorrow. Today's devotion is still open below.",
    backToToday: "Back to today's devotion",
    reflection: "Reflection",
    prayer: "Prayer",
    practice: "Practice",
    empty: "No devotion has been published yet — check back soon.",
    pastDevotions: "Past Devotions",
    tomorrow: "Tomorrow",
  },
  reminder: {
    heading: "Daily reminder",
    timeAriaLabel: "Reminder time",
    needsInstall:
      "To get a daily reminder on iPhone, add The Leap to your Home Screen first: tap the Share button, then “Add to Home Screen”, and open The Leap from there.",
    unsupported: "This browser doesn't support notifications.",
    denied:
      "Notifications are blocked for The Leap. Allow them in your browser's site settings to get a daily reminder.",
    offIntro:
      "Get a gentle nudge each day when you haven't read the devotion yet.",
    turnOn: "Remind me daily",
    everyDayAt: "Every day at",
    turnOff: "Turn off",
    failed: "Something went wrong saving your reminder. Please try again.",
  },
  /** Push notification sent by the reminder cron, in the recipient's language. */
  reminderPush: {
    title: "Today's devotion is ready",
  },
  scripture: {
    heading: "Scripture",
    subheading: "Read, search, study and save God's Word.",
    tabs: {
      bible: "Bible",
      plans: "Plans",
      favorites: "Favorites",
    },
    plansTitle: "Reading Plans",
    plansDescription: "Guided reading plans are coming soon.",
    favoritesEmpty: "Save a passage from the Bible tab to see it here.",
    remove: "Remove",
  },
  bible: {
    comingSoonSuffix: " · Coming soon",
    searchPlaceholder: "John 3:16, or words to find…",
    search: "Search",
    attribution:
      "Scripture from the Berean Standard Bible (BSB), public domain.",
    oldTestament: "Old Testament",
    newTestament: "New Testament",
    allBooks: "All books",
    verseNotInBsb:
      "This verse is not included in the BSB, which follows the oldest manuscripts.",
    /** {reference} is a Bible reference, e.g. "John 3". */
    readChapter: "Read {reference}",
    noMatches: "No verses match “{q}”.",
    /** Plural forms on {count}; {q} is the search text. */
    versesContaining: {
      one: "{count} verse containing “{q}”",
      other: "{count} verses containing “{q}”",
    },
    showingFirst:
      "Showing the first {shown} of {total} verses containing “{q}”",
    notFound: "Couldn't find “{reference}” in the Bible.",
    saved: "Saved",
    save: "Save",
  },
};

export type EvolveMessages = typeof evolve;
