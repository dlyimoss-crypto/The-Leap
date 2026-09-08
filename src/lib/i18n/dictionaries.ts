// UI-chrome dictionaries — English + Swahili. Deliberately not called
// "translations": src/lib/content/translations.ts already owns that word
// for Bible translations (WEB/KJV/ASV).

export type Locale = "en" | "sw";

export type Dictionary = {
  nav: {
    home: string;
    connect: string;
    commit: string;
    evolve: string;
    engage: string;
    admin: string;
  };
  companion: {
    menuHeading: string;
    close: string;
    openAriaLabel: string;
    button: string;
    intents: Record<string, string>;
  };
  profile: {
    backToHome: string;
    heading: string;
    subheading: string;
    displayNameLabel: string;
    save: string;
    language: string;
    english: string;
    swahili: string;
    changePhoto: string;
    cancel: string;
    savePhoto: string;
    saving: string;
    zoom: string;
  };
  signIn: {
    back: string;
    welcomeBack: string;
    createAccount: string;
    newHere: string;
    alreadyHaveAccount: string;
    name: string;
    email: string;
    password: string;
    signInButton: string;
    createAccountButton: string;
  };
  dashboard: {
    goodMorning: string;
    goodAfternoon: string;
    goodEvening: string;
    editProfileAriaLabel: string;
    tagline: string;
    signOutAriaLabel: string;
    welcomeEyebrow: string;
    beginJourneyHeading: string;
    beginMyJourney: string;
    continueYourJourneyEyebrow: string;
    dayOf: (current: number, total: number) => string;
    continueTheJourney: string;
    nextLeapEyebrow: string;
    journeyCompleteEyebrow: string;
    welcomeToNextLeap: string;
    onlyBeginning: string;
    percentComplete: (pct: number) => string;
    done: string;
    daysLeft: (n: number) => string;
    continueButton: string;
    browseOtherJourneys: string;
    prayerDaysLeft: (n: number) => string;
    tapToPray: string;
    today: string;
    scripture: string;
    readGodsWord: string;
    devotion: string;
    growDaily: string;
    thisWeeksCommitment: string;
    makeACommitment: string;
    keptThisWeek: (done: number, total: number) => string;
    studyPrayShare: string;
    leapCompanion: string;
    askForHelp: string;
  };
  gospelInvite: {
    heading: string;
    jesusSaid: string;
    scriptureQuote: string;
    scriptureRef: string;
    intro: string;
    prayerLabel: string;
    prayerText: string;
    prayedButton: string;
    maybeLater: string;
    beganHeading: string;
    beganSubheading: string;
    whereNext: string;
    hubJourneyTitle: string;
    hubJourneyDesc: string;
    hubCompanionTitle: string;
    hubCompanionDesc: string;
    hubScriptureTitle: string;
    hubScriptureDesc: string;
    closing: string;
  };
};

const en: Dictionary = {
  nav: {
    home: "Home",
    connect: "Connect",
    commit: "Commit",
    evolve: "Evolve",
    engage: "Engage",
    admin: "Admin",
  },
  companion: {
    menuHeading: "What would you like to do?",
    close: "Close",
    openAriaLabel: "Open Leap Companion",
    button: "Companion",
    intents: {
      "new-believer": "I just prayed to receive Jesus",
      pray: "Pray with me",
      scripture: "Help me understand Scripture",
      devotion: "Reflect on today's devotion",
      apply: "Help me apply this",
      encourage: "Encourage me",
      "next-step": "Help me take my next step",
      materials: "Get Christian materials",
    },
  },
  profile: {
    backToHome: "Back to Home",
    heading: "Profile",
    subheading: "Update your photo and name.",
    displayNameLabel: "Display name",
    save: "Save",
    language: "Language",
    english: "English",
    swahili: "Kiswahili",
    changePhoto: "Change photo",
    cancel: "Cancel",
    savePhoto: "Save photo",
    saving: "Saving…",
    zoom: "Zoom",
  },
  signIn: {
    back: "Back",
    welcomeBack: "Welcome back",
    createAccount: "Create your account",
    newHere: "New here? Create an account",
    alreadyHaveAccount: "Already have an account? Sign in",
    name: "Name",
    email: "Email",
    password: "Password",
    signInButton: "Sign in",
    createAccountButton: "Create account",
  },
  dashboard: {
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    editProfileAriaLabel: "Edit your profile",
    tagline: "Take the next step. Grow in Christ. Live His purpose.",
    signOutAriaLabel: "Sign out",
    welcomeEyebrow: "Welcome",
    beginJourneyHeading: "Let's begin your journey",
    beginMyJourney: "Begin my journey",
    continueYourJourneyEyebrow: "Continue Your Journey",
    dayOf: (current, total) => `Day ${current} of ${total}`,
    continueTheJourney: "Continue the journey",
    nextLeapEyebrow: "Next Leap",
    journeyCompleteEyebrow: "Journey Complete",
    welcomeToNextLeap: "Welcome to the Next Leap",
    onlyBeginning:
      "You've begun the journey of following Christ. This is only the beginning.",
    percentComplete: (pct) => `${pct}% complete`,
    done: "Done",
    daysLeft: (n) => `${n} day${n === 1 ? "" : "s"} left`,
    continueButton: "Continue",
    browseOtherJourneys: "Browse other journeys",
    prayerDaysLeft: (n) => `${n} day${n === 1 ? "" : "s"} left — tap to pray`,
    tapToPray: "Tap to pray",
    today: "Today",
    scripture: "Scripture",
    readGodsWord: "Read God's Word",
    devotion: "Devotion",
    growDaily: "Grow daily",
    thisWeeksCommitment: "This week's commitment",
    makeACommitment: "Make a commitment",
    keptThisWeek: (done, total) => `${done} of ${total} kept this week`,
    studyPrayShare: "Study, pray, and share the gospel this week.",
    leapCompanion: "Leap Companion",
    askForHelp: "Ask for help, prayer, or your next step.",
  },
  gospelInvite: {
    heading: "Do You Know Jesus?",
    jesusSaid: "Jesus said:",
    scriptureQuote: "I am the way, the truth, and the life.",
    scriptureRef: "John 14:6",
    intro:
      "If you're ready to begin a relationship with Jesus, you can start with a simple prayer.",
    prayerLabel: "A Simple Prayer",
    prayerText:
      "Lord Jesus, I believe You are the Son of God. I ask You to forgive my sins and come into my heart. I receive You as my Lord and Savior. Thank You for eternal life. In Jesus' name, Amen.",
    prayedButton: "I Prayed This Prayer",
    maybeLater: "Maybe Later",
    beganHeading: "Your Journey Has Begun",
    beganSubheading: "You have taken an important step today.",
    whereNext: "Where would you like to go next?",
    hubJourneyTitle: "Begin Your First Leap",
    hubJourneyDesc: "Start your first guided formation journey.",
    hubCompanionTitle: "Meet Your Companion",
    hubCompanionDesc: "An AI guide who can help you take your next steps.",
    hubScriptureTitle: "Explore Scripture",
    hubScriptureDesc: "Begin discovering God's Word.",
    closing:
      "Thank you for taking this step. Following Jesus is a journey, and you don't have to walk it alone.",
  },
};

const sw: Dictionary = {
  nav: {
    home: "Nyumbani",
    connect: "Ungana",
    commit: "Ahadi",
    evolve: "Kua",
    engage: "Shiriki",
    admin: "Msimamizi",
  },
  companion: {
    menuHeading: "Ungependa kufanya nini?",
    close: "Funga",
    openAriaLabel: "Fungua Rafiki wa Leap",
    button: "Rafiki",
    intents: {
      "new-believer": "Nimeomba kumpokea Yesu",
      pray: "Niombee",
      scripture: "Nisaidie kuelewa Maandiko",
      devotion: "Tafakari kuhusu ibada ya leo",
      apply: "Nisaidie kutumia hili",
      encourage: "Nitie moyo",
      "next-step": "Nisaidie kuchukua hatua yangu inayofuata",
      materials: "Pata vitabu vya Kikristo",
    },
  },
  profile: {
    backToHome: "Rudi Nyumbani",
    heading: "Wasifu",
    subheading: "Sasisha picha yako na jina.",
    displayNameLabel: "Jina la kuonyesha",
    save: "Hifadhi",
    language: "Lugha",
    english: "Kiingereza",
    swahili: "Kiswahili",
    changePhoto: "Badilisha picha",
    cancel: "Ghairi",
    savePhoto: "Hifadhi picha",
    saving: "Inahifadhi…",
    zoom: "Kuza",
  },
  signIn: {
    back: "Rudi",
    welcomeBack: "Karibu tena",
    createAccount: "Fungua akaunti yako",
    newHere: "Mgeni hapa? Fungua akaunti",
    alreadyHaveAccount: "Una akaunti tayari? Ingia",
    name: "Jina",
    email: "Barua pepe",
    password: "Nywila",
    signInButton: "Ingia",
    createAccountButton: "Fungua akaunti",
  },
  dashboard: {
    goodMorning: "Habari za asubuhi",
    goodAfternoon: "Habari za mchana",
    goodEvening: "Habari za jioni",
    editProfileAriaLabel: "Hariri wasifu wako",
    tagline: "Chukua hatua inayofuata. Kua katika Kristo. Ishi kusudi Lake.",
    signOutAriaLabel: "Toka",
    welcomeEyebrow: "Karibu",
    beginJourneyHeading: "Hebu tuanze safari yako",
    beginMyJourney: "Anza safari yangu",
    continueYourJourneyEyebrow: "Endelea na Safari Yako",
    dayOf: (current, total) => `Siku ya ${current} kati ya ${total}`,
    continueTheJourney: "Endelea na safari",
    nextLeapEyebrow: "Hatua Ifuatayo",
    journeyCompleteEyebrow: "Safari Imekamilika",
    welcomeToNextLeap: "Karibu kwenye Hatua Ifuatayo",
    onlyBeginning: "Umeanza safari ya kumfuata Kristo. Huu ni mwanzo tu.",
    percentComplete: (pct) => `Asilimia ${pct} imekamilika`,
    done: "Imekamilika",
    daysLeft: (n) =>
      n === 1 ? "Siku 1 imebaki" : `Siku ${n} zimebaki`,
    continueButton: "Endelea",
    browseOtherJourneys: "Vinjari safari zingine",
    prayerDaysLeft: (n) =>
      n === 1
        ? "Siku 1 imebaki — gusa kuomba"
        : `Siku ${n} zimebaki — gusa kuomba`,
    tapToPray: "Gusa kuomba",
    today: "Leo",
    scripture: "Maandiko",
    readGodsWord: "Soma Neno la Mungu",
    devotion: "Ibada",
    growDaily: "Kua kila siku",
    thisWeeksCommitment: "Ahadi ya wiki hii",
    makeACommitment: "Weka ahadi",
    keptThisWeek: (done, total) =>
      `${done} kati ya ${total} zimetimizwa wiki hii`,
    studyPrayShare: "Jifunze, omba, na shiriki injili wiki hii.",
    leapCompanion: "Rafiki wa Leap",
    askForHelp: "Omba msaada, maombi, au hatua yako ifuatayo.",
  },
  gospelInvite: {
    heading: "Je, Unamjua Yesu?",
    jesusSaid: "Yesu alisema:",
    scriptureQuote: "Mimi ndimi njia, na kweli, na uzima.",
    scriptureRef: "Yohana 14:6",
    intro:
      "Kama uko tayari kuanza uhusiano na Yesu, unaweza kuanza kwa ombi rahisi.",
    prayerLabel: "Ombi Rahisi",
    prayerText:
      "Bwana Yesu, ninaamini Wewe ni Mwana wa Mungu. Nakuomba unisamehe dhambi zangu na uje moyoni mwangu. Ninakupokea kuwa Bwana na Mwokozi wangu. Asante kwa uzima wa milele. Kwa jina la Yesu, Amina.",
    prayedButton: "Nimeomba Ombi Hili",
    maybeLater: "Labda Baadaye",
    beganHeading: "Safari Yako Imeanza",
    beganSubheading: "Umechukua hatua muhimu leo.",
    whereNext: "Ungependa kwenda wapi sasa?",
    hubJourneyTitle: "Anza Hatua Yako ya Kwanza",
    hubJourneyDesc: "Anza safari yako ya kwanza ya ukuaji iliyoongozwa.",
    hubCompanionTitle: "Kutana na Rafiki Yako",
    hubCompanionDesc:
      "Kiongozi wa AI anayeweza kukusaidia kuchukua hatua zako zifuatazo.",
    hubScriptureTitle: "Gundua Maandiko",
    hubScriptureDesc: "Anza kugundua Neno la Mungu.",
    closing:
      "Asante kwa kuchukua hatua hii. Kumfuata Yesu ni safari, na hauhitaji kuitembea peke yako.",
  },
};

export const dictionaries: Record<Locale, Dictionary> = { en, sw };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
