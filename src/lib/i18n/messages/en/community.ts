// Prayer Room, Community feed/posts, announcements.
// English is the source of truth: the type of every other language's
// `community` messages is derived from this object, so add keys here first.
// Annotate function parameters (they can't be inferred). Function-valued
// messages may only be used in server components; client components get
// plain strings (see ../../format.ts for interpolate/plural helpers).

export const community = {
  // Shown after a post, comment or prayer request trips crisis detection.
  // Rendered as: intro + " " + link (to findahelpline.com) + " " + outro.
  crisisBanner: {
    intro:
      "You don't have to go through this alone. If you're in immediate danger or thinking about harming yourself, please seek immediate help.",
    findSupportLink: "Find crisis support in your country →",
    outro:
      "You can also contact a trusted person, local church, professional counselor, or emergency service.",
  },
  // Compact relative times on post and prayer-request cards.
  timeAgo: {
    justNow: "just now",
    minutes: (n: number) => `${n}m ago`,
    hours: (n: number) => `${n}h ago`,
    days: (n: number) => `${n}d ago`,
  },
  // Author name when a member has no display name.
  communityMember: "A member of the community",
  report: "Report",

  prayerRoom: {
    heading: "Prayer Room",
    tabs: {
      requests: "Requests",
      testimonies: "Testimonies",
      mine: "Mine",
    },
    emptyRequests: "No prayer requests yet — be the first.",
    emptyTestimonies: "No testimonies yet.",
    emptyMine: "You haven't posted a prayer request yet.",
  },
  prayerComposer: {
    placeholder: "Share a prayer request…",
    public: "Public",
    private: "Private",
    identified: "Identified",
    anonymous: "Anonymous",
    submitAriaLabel: "Post prayer request",
  },
  prayerMovement: {
    eyebrow: "Let's pray for 5 minutes",
    daysLeft: { one: "{count} day left", other: "{count} days left" },
    learnMore: "Learn more",
    prayedCount: "{count} prayed",
    prayed: "Prayed",
    iHavePrayed: "I have prayed",
  },
  prayerRequest: {
    anonymous: "Anonymous",
    hiddenName: "hidden name",
    // Badge on your own non-open requests (Mine tab).
    status: {
      open: "open",
      answered: "answered",
      hidden: "hidden",
      removed: "removed",
    },
    testimony: "Testimony",
    prayed: "Prayed",
    pray: "Pray",
    testimonyPlaceholder: "How was this answered? (optional)",
    markAnswered: "Mark answered",
  },

  communityPage: {
    heading: "Community",
    empty: "No posts yet — be the first to share.",
  },
  composer: {
    todaysQuestion: "Today's question",
    submitAriaLabel: "Post",
    // Rotating placeholder (one per day) when there's no dated prompt.
    placeholderPrompts: [
      "Share what's on your mind…",
      "What's the Scripture that inspires you the most, and why?",
      "What has God been doing in your life this week?",
      "What's a prayer request you'd like this community to hold with you?",
      "What's one small thing you're grateful for today?",
      "Who could use some encouragement from you today?",
      "What's a truth you're holding onto right now?",
      "What's a lesson your faith has taught you recently?",
      "What verse has carried you through a hard season?",
      "How did you see God show up this week?",
      "What's a small win worth celebrating today?",
      "What's something you're learning to trust Him with?",
      "What would you say to someone who's struggling right now?",
      "What's a prayer that's been answered lately?",
    ],
  },
  postCard: {
    block: "Block",
  },
  postDetail: {
    backToCommunity: "Community",
    noComments: "No comments yet.",
    commentPlaceholder: "Add a comment…",
    post: "Post",
  },

  announcement: {
    noLongerRunning: "This announcement is no longer running.",
    backToHome: "Back to Home",
    learnMore: "Learn more",
  },
};

export type CommunityMessages = typeof community;
