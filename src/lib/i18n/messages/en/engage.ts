// ENGAGE tab (serve, give, invite), Ask PD (user + team inbox), Companion page.
// English is the source of truth: the type of every other language's
// `engage` messages is derived from this object, so add keys here first.
// Annotate function parameters (they can't be inferred). Function-valued
// messages may only be used in server components; client components get
// plain strings (see ../../format.ts for interpolate/plural helpers).

export const engage = {
  hub: {
    subtitle: "My life has a purpose beyond myself.",
    inviteTitle: "Invite a Friend",
    inviteDescription: "Help someone else take their first Leap.",
    serveTitle: "Serve & Missions",
    serveDescription: "Find ways to serve and get involved.",
    giveTitle: "Giving",
    giveDescription: "Support The Leap and the ministries it partners with.",
  },
  give: {
    heading: "Get Involved. Take Part. Make a Difference.",
    intro:
      "Your support helps The Leap help people take their next step with Christ. We welcome your partnership through giving, serving, praying and connecting others to the mission.",
    howCanIGive: "How can I give?",
    methods: {
      internationalBank: "International Bank Transfer",
      tanzanianBank: "Tanzanian Bank Transfer",
      mobilePesa: "Mobile Pesa",
      usTaxDeductible: "US Tax-Deductible Giving",
    },
    fullDetails: "For full giving details, visit our Give Page.",
    coreValues: {
      integrity: "Integrity",
      service: "Service",
      wisdom: "Wisdom",
      discipline: "Discipline",
      excellence: "Excellence",
    },
    together: "Together, we take the next step.",
  },
  invite: {
    title: "Invite a Friend",
    subtitle: "Multiply — help someone else take their next step.",
    card: {
      heading: "Take someone with you",
      /** {name}: the user's first name. */
      helpWithName:
        "{name}, help a friend or family member take their first Leap with Christ.",
      help: "Help a friend or family member take their first Leap with Christ.",
      shareMessage:
        "I've been using The Leap to grow in my walk with Christ, one day at a time. Take your first Leap too:",
      inviteCopied: "Invite copied",
      shareTheLeap: "Share The Leap",
    },
  },
  serve: {
    title: "Serve & Missions",
    subtitle: "Find ways to serve and get involved.",
    empty: "No opportunities listed yet — check back soon.",
    learnMore: "Learn more",
  },
  askPd: {
    title: "Ask PD",
    intro:
      "Reach Pastor Deniss and the Leap pastoral team directly. Real people, not AI. Send a private message or ask for a call, and we'll get back to you as soon as we can.",
    emergencyBefore: "Not for emergencies. If you're in danger, please",
    emergencyLink: "find immediate help",
    emergencyAfter: ".",
    tabs: {
      message: "Send a message",
      call: "Request a call",
    },
    errors: {
      empty: "Please write your message before sending.",
      contact: "Choose how we should reach you and add your number or username.",
      failed: "Something went wrong sending that. Please try again.",
    },
    contactMethodLabel: "How should we reach you?",
    contactMethods: {
      whatsapp: "WhatsApp",
      phone: "Phone call",
      video: "Video call",
    },
    contactDetailLabel: "Your number or username",
    contactDetailPlaceholder: "e.g. +255 7XX XXX XXX",
    preferredTimeLabel: "Best time to call (optional)",
    preferredTimePlaceholder: "e.g. Weekday evenings after 6pm, EAT",
    bodyLabelCall: "What would you like to talk about? (optional)",
    bodyLabelMessage: "Your message",
    bodyPlaceholderCall: "A sentence or two helps us prepare.",
    bodyPlaceholderMessage:
      "Share what's on your heart: a question, a decision, something you'd like prayer or guidance for.",
    shareCompanionLabel: "Share my Leap Companion conversation",
    shareCompanionHint:
      "So the team can see what you've been talking about. Only your most recent messages are shared, and only if you tick this.",
    submitCall: "Request a call",
    submitMessage: "Send to Pastor Deniss",
    privacyNote:
      "Private: only Pastor Deniss and the Leap pastoral team can read this.",
    yourConversations: "Your conversations",
    newReply: "New reply",
    conversationFallback: "Conversation",
    callRequestPrefix: "Call request · ",
    status: {
      user: {
        open: "Waiting for a reply",
        answered: "Replied",
        closed: "Closed",
      },
      team: {
        open: "Needs a reply",
        answered: "Answered",
        closed: "Closed",
      },
    },
    /** First message of a call request sent without a note (saved to the thread). */
    defaultCallMessage: "I'd like to talk with Pastor Deniss or the PD team.",
    thread: {
      yourCallRequest: "Your call request",
      yourMessage: "Your message",
      sentMessage:
        "Sent. Pastor Deniss or someone from the team will reply here. You'll see a dot on Ask PD when there's a reply.",
      sentCall:
        "Sent. Pastor Deniss or someone from the team will reply here or reach out to you directly. You'll see a dot on Ask PD when there's a reply.",
      closed: "This conversation is closed.",
      startNewOne: "Start a new one",
      anyTime: "any time.",
      followUpPlaceholder: "Add a follow-up…",
      callRequest: "Call request",
      you: "You",
      userFallback: "User",
      pastorDeniss: "Pastor Deniss",
      send: "Send",
      crisisBefore:
        "You don't have to go through this alone. A reply here can take time, so if you're in immediate danger or thinking about harming yourself, please get help now.",
      crisisLink: "Find crisis support in your country →",
      crisisAfter:
        "You can also contact a trusted person, a local church, a professional counselor, or emergency services.",
    },
    inbox: {
      title: "Ask PD inbox",
      subtitle: "Messages and call requests for Pastor Deniss and the team.",
      nothingHere: "Nothing here.",
      unread: "Unread",
      unnamedUser: "Unnamed user",
      youPrefix: "You: ",
    },
    inboxThread: {
      callRequest: "Call request",
      message: "Message",
      started: "started",
      reopen: "Reopen",
      markHandled: "Mark handled",
      markAsSeen: "Mark as seen",
      crisisWarning:
        "This conversation contains crisis language. Please respond promptly, and point them to immediate local help if they may be in danger.",
      sharedCompanion: (count: number) =>
        `Shared Leap Companion conversation (${count} messages)`,
      companionAi: "Leap Companion (AI)",
      replyTo: (name: string) => `Reply to ${name}…`,
      repliesNote:
        "Replies show your name to the user and send them a notification.",
    },
    /** Push notifications, in the recipient's language. */
    push: {
      newCallRequestTitle: "New call request",
      newMessageTitle: "New Ask PD message",
      newRequestBody: "Someone has reached out through Ask PD.",
      followUpTitle: "New Ask PD follow-up",
      followUpBody: "Someone replied in an Ask PD conversation.",
      repliedTitle: "Pastor Deniss replied",
      repliedBody: "You have a new reply in Ask PD.",
    },
  },
  companion: {
    title: "Leap Companion",
    aiBadge: "AI",
    askPd: "Ask PD",
    introBefore:
      "I'm an AI guide, not a pastor or mentor — here to help with Scripture questions, working through today's session, or when you're feeling stuck. Want a real person? Tap",
    introAfter: "to reach Pastor Deniss and the team.",
    clearConfirmTitle: "Clear this whole conversation?",
    clearConfirmBody:
      "This deletes all your Companion messages and can't be undone. Anything you've already shared through Ask PD stays with the team.",
    cancel: "Cancel",
    yesClear: "Yes, clear it",
    clearConversation: "Clear conversation",
    crisisBefore:
      "You don't have to go through this alone. If you're in immediate danger or thinking about harming yourself, please seek immediate help.",
    crisisLink: "Find crisis support in your country →",
    crisisAfter:
      "You can also contact a trusted person, local church, professional counselor, or emergency service.",
    emptyPrompt: "What would you like help with?",
    quickPrompts: {
      scripture: "Help me understand today's Scripture",
      nextStep: "What's my next step?",
      stuck: "I'm feeling stuck",
    },
    inputPlaceholder: "Ask the Companion…",
    send: "Send",
    /** Saved as the Companion's reply when the AI call fails. */
    errorReply:
      "Sorry, I'm having trouble responding right now — please try again in a moment.",
    /** Seed messages for /companion?intent=…, phrased as the user's own request. */
    intentMessages: {
      "new-believer":
        "I just prayed to receive Jesus. Where do I begin? I'm not sure yet whether I'm just beginning to follow Jesus, want to understand the Bible, want to learn how to pray, want to grow in my faith, or just have questions about Jesus — can you help me figure out where to start?",
      scripture: "Can you help me understand today's Scripture?",
      devotion: "Can you help me reflect on today's devotion?",
      "next-step": "What's my next step?",
      materials: "Can you recommend some Christian books or materials for me?",
    },
  },
};

export type EngageMessages = typeof engage;
