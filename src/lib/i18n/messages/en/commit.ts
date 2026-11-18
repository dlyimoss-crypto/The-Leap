// COMMIT tab: commitments, journeys list, journey + day pages, CONNECT tab and churches.
// English is the source of truth: the type of every other language's
// `commit` messages is derived from this object, so add keys here first.
// Annotate function parameters (they can't be inferred). Function-valued
// messages may only be used in server components; client components get
// plain strings (see ../../format.ts for interpolate/plural helpers).

export const commit = {
  commitPage: {
    backToHome: "Home",
    heading: "Commit",
    subheading: "I choose the way of Christ.",
    journeyCardTitle: "Journey",
    journeyCardDescription: "Continue your journey or browse a new one.",
    thisWeeksCommitment: "This week's commitment",
    weekOfProgress: (weekOf: string, done: number, total: number) =>
      `Week of ${weekOf} — ${done} of ${total} kept`,
    markAsKept: "Mark as kept",
    checkAllToMarkAsKept: (total: number) =>
      `Check all ${total} to mark as kept`,
    intro: "Three practices, every week — small enough to actually keep.",
    commitToThisWeek: "Commit to this week",
    keptCommitments: "Kept commitments",
    weekOf: (weekOf: string) => `Week of ${weekOf}`,
  },
  // Keyed by the commitment column each checkbox toggles.
  commitmentItems: {
    scripture_done: {
      label: "Study 5 paragraphs of the Bible",
      detail: "Every day this week",
    },
    prayer_done: {
      label: "Pray for 5–15 minutes",
      detail: "Every day this week",
    },
    witness_done: {
      label: "Share the gospel",
      detail: "At least once this week",
    },
  },
  journeyChooser: {
    backToCommit: "Commit",
    heading: "Journey",
    subheading: "A structured, multi-day path with Christ.",
    continueTitle: "Continue Your Journey",
    continueDescription: "Pick up where you left off.",
    browseTitle: "Browse Journeys",
    browseDescription: "Explore other formation journeys you can start.",
  },
  browseJourneys: {
    backToJourney: "Journey",
    heading: "Browse Journeys",
    intro:
      "Every formation journey has its own path — start whichever one speaks to where you are.",
    durationLabel: (days: number) => `${days}-day journey`,
    completedReview: "Completed — Review",
    percentContinue: (pct: number) => `${pct}% complete — Continue`,
    start: "Start",
    empty: "No journeys are available yet — check back soon.",
  },
  journeyOverview: {
    durationLabel: (days: number) => `${days}-day formation journey`,
    startJourney: "Start journey",
  },
  journeyDay: {
    dayOf: (day: number, total: number) => `Day ${day} of ${total}`,
    gatedHeading: "Welcome back tomorrow",
    gatedBody:
      "Take today to pray and sit with what you've just read — the next step opens when you return tomorrow.",
    backToHome: "Back to Home",
    continue: "Continue",
    continueTo: (topic: string) => `Continue: ${topic}`,
  },
  // The Formation Loop's step labels.
  formationLoop: {
    scripture: "Scripture",
    message: "Message",
    explore: "Explore",
    reflect: "Reflect",
    pray: "Pray",
    nextStep: "Next Step",
    engage: "Engage",
  },
  connectPage: {
    backToHome: "Home",
    heading: "Connect",
    subheading: "I belong.",
    prayerRoomTitle: "Prayer Room",
    prayerRoomDescription: "Pray, support, and be prayed for.",
    churchesTitle: "Churches",
    churchesDescription: "Find a local church and connect with its community.",
    askPdTitle: "Ask PD",
    askPdDescription: "Message Pastor Deniss and the team, or request a call.",
    companionTitle: "Leap Companion",
    companionDescription: "Ask for help, prayer, or your next step.",
  },
  churches: {
    backToChurches: "Back to Churches",
    backToConnect: "Connect",
    notFound: "This church listing couldn't be found.",
    leadPastor: (name: string) => `Lead Pastor: ${name}`,
    service: (time: string) => `Service: ${time}`,
    members: (n: number) => `~${n} members`,
    heading: "Churches",
    intro: "Find a local church and connect with its community.",
    empty: "No churches listed yet — check back soon.",
    serviceTimeNotListed: "Service time not listed",
  },
  hubCard: {
    comingSoon: "Coming soon",
  },
};

export type CommitMessages = typeof commit;
