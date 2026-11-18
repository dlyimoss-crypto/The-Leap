import type { CommunityMessages } from "../en/community";

export const community: CommunityMessages = {
  crisisBanner: {
    intro:
      "Du musst da nicht allein durch. Wenn du in akuter Gefahr bist oder daran denkst, dir selbst etwas anzutun, hol dir bitte sofort Hilfe.",
    findSupportLink: "Krisenhilfe in deinem Land finden →",
    outro:
      "Du kannst dich auch an eine Vertrauensperson, eine Gemeinde vor Ort, eine professionelle Beratungsstelle oder den Notruf wenden.",
  },
  timeAgo: {
    justNow: "gerade eben",
    minutes: (n: number) => `vor ${n} Min.`,
    hours: (n: number) => `vor ${n} Std.`,
    days: (n: number) => (n === 1 ? "vor 1 Tag" : `vor ${n} Tagen`),
  },
  communityMember: "Ein Mitglied der Gemeinschaft",
  report: "Melden",

  prayerRoom: {
    heading: "Gebetsraum",
    tabs: {
      requests: "Anliegen",
      testimonies: "Zeugnisse",
      mine: "Meine",
    },
    emptyRequests: "Noch keine Gebetsanliegen – mach den Anfang.",
    emptyTestimonies: "Noch keine Zeugnisse.",
    emptyMine: "Du hast noch kein Gebetsanliegen geteilt.",
  },
  prayerComposer: {
    placeholder: "Teile ein Gebetsanliegen…",
    public: "Öffentlich",
    private: "Privat",
    identified: "Mit Namen",
    anonymous: "Anonym",
    submitAriaLabel: "Gebetsanliegen teilen",
  },
  prayerMovement: {
    eyebrow: "Lass uns 5 Minuten beten",
    daysLeft: { one: "Noch {count} Tag", other: "Noch {count} Tage" },
    learnMore: "Mehr erfahren",
    prayedCount: "Gebetet: {count}",
    prayed: "Gebetet",
    iHavePrayed: "Ich habe gebetet",
  },
  prayerRequest: {
    anonymous: "Anonym",
    hiddenName: "Name verborgen",
    status: {
      open: "offen",
      answered: "erhört",
      hidden: "verborgen",
      removed: "entfernt",
    },
    testimony: "Zeugnis",
    prayed: "Gebetet",
    pray: "Beten",
    testimonyPlaceholder: "Wie hat Gott geantwortet? (optional)",
    markAnswered: "Als erhört markieren",
  },

  communityPage: {
    heading: "Gemeinschaft",
    empty: "Noch keine Beiträge – mach den Anfang und teile etwas.",
  },
  composer: {
    todaysQuestion: "Frage des Tages",
    submitAriaLabel: "Posten",
    placeholderPrompts: [
      "Teile, was dich gerade bewegt…",
      "Welcher Bibelvers inspiriert dich am meisten, und warum?",
      "Was hat Gott diese Woche in deinem Leben getan?",
      "Für welches Anliegen soll diese Gemeinschaft mit dir beten?",
      "Wofür bist du heute dankbar, auch wenn es nur eine Kleinigkeit ist?",
      "Wer könnte heute eine Ermutigung von dir gebrauchen?",
      "An welcher Wahrheit hältst du dich gerade fest?",
      "Was hat dich dein Glaube in letzter Zeit gelehrt?",
      "Welcher Vers hat dich durch eine schwere Zeit getragen?",
      "Wo hast du diese Woche Gottes Wirken gesehen?",
      "Welchen kleinen Erfolg kannst du heute feiern?",
      "Worin lernst du gerade, Ihm zu vertrauen?",
      "Was würdest du jemandem sagen, der gerade zu kämpfen hat?",
      "Welches Gebet wurde in letzter Zeit erhört?",
    ],
  },
  postCard: {
    block: "Blockieren",
  },
  postDetail: {
    backToCommunity: "Gemeinschaft",
    noComments: "Noch keine Kommentare.",
    commentPlaceholder: "Kommentar schreiben…",
    post: "Posten",
  },

  announcement: {
    noLongerRunning: "Diese Ankündigung ist nicht mehr aktiv.",
    backToHome: "Zurück zum Start",
    learnMore: "Mehr erfahren",
  },
};
