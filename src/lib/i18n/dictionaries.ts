// UI-chrome dictionaries, one file per language under ./messages.
// Deliberately not called "translations": src/lib/content/translations.ts
// already owns that word for Bible translations (BSB/KJV/ASV).
//
// Adding a language: create ./messages/<locale>/ mirroring ./messages/en/
// (each file typed from its English counterpart)
// (a missing key is then a compile error, never leaked English) and add
// it to `dictionaries` below. That alone switches the language on in the
// picker — see isEnabledLocale.

import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";
import { en } from "./messages/en";
import { sw } from "./messages/sw";
import { de } from "./messages/de";
import { fr } from "./messages/fr";
import { es } from "./messages/es";
import { zhCN } from "./messages/zh-CN";

export type { Locale };

/** The original (pre-split) namespaces, typed explicitly. */
export type CoreMessages = {
  nav: {
    home: string;
    connect: string;
    commit: string;
    evolve: string;
    engage: string;
    admin: string;
    inbox: string;
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
    changePhoto: string;
    cancel: string;
    savePhoto: string;
    saving: string;
    zoom: string;
    viewPhoto: string;
  };
  signIn: {
    back: string;
    welcomeBack: string;
    createAccount: string;
    newHere: string;
    alreadyHaveAccount: string;
    name: string;
    nationality: string;
    selectNationality: string;
    email: string;
    password: string;
    signInButton: string;
    createAccountButton: string;
    forgotPassword: string;
    resetTitle: string;
    resetIntro: string;
    sendResetLink: string;
    resetLinkSent: string;
    resetLinkInvalid: string;
    backToSignIn: string;
    newPasswordTitle: string;
    newPassword: string;
    saveNewPassword: string;
    checkEmailTitle: string;
    checkEmailSentTo: string;
    checkEmailBody: string;
    resendConfirmation: string;
    confirmationResent: string;
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
    tapToRead: string;
    askPdReplied: string;
    daysLeftShort: (n: number) => string;
    announcementKinds: {
      prayer: string;
      news: string;
      event: string;
      advert: string;
      general: string;
    };
    today: string;
    scripture: string;
    readGodsWord: string;
    devotion: string;
    growDaily: string;
    devotionNew: string;
    thisWeeksCommitment: string;
    makeACommitment: string;
    keptThisWeek: (done: number, total: number) => string;
    studyPrayShare: string;
    community: string;
    joinTheConversation: string;
  };
  welcome: {
    title: string;
    tagline: string;
    getStarted: string;
    haveAccount: string;
  };
  language: {
    /** Picker's accessible label, in the current language. */
    pickerLabel: string;
    /** The one-time offer, shown in the *offered* language. */
    suggest: string;
    accept: string;
    decline: string;
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
    close: string;
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

/**
 * Every language's full dictionary. Area namespaces (commit, evolve, …)
 * take their shape from the English files in ./messages/en.
 */
export type Dictionary = typeof en;

export const dictionaries: Partial<Record<Locale, Dictionary>> = {
  en,
  sw,
  de,
  fr,
  es,
  "zh-CN": zhCN,
};

/** Languages users can pick today, in registry order. */
export const ENABLED_LOCALES: readonly Locale[] = LOCALES.filter(
  (locale) => dictionaries[locale] !== undefined,
);

export function isEnabledLocale(locale: Locale): boolean {
  return dictionaries[locale] !== undefined;
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE]!;
}
