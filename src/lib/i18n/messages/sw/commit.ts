import type { CommitMessages } from "../en/commit";

export const commit: CommitMessages = {
  commitPage: {
    backToHome: "Nyumbani",
    heading: "Ahadi",
    subheading: "Nachagua njia ya Kristo.",
    journeyCardTitle: "Safari",
    journeyCardDescription: "Endelea na safari yako au vinjari mpya.",
    thisWeeksCommitment: "Ahadi ya wiki hii",
    weekOfProgress: (weekOf: string, done: number, total: number) =>
      `Wiki ya ${weekOf} — ${done} kati ya ${total} zimetimizwa`,
    markAsKept: "Thibitisha kuwa imetimizwa",
    checkAllToMarkAsKept: (total: number) =>
      `Tia alama zote ${total} ili kuthibitisha`,
    intro:
      "Mazoea matatu, kila wiki — madogo kiasi cha kuweza kuyatimiza kweli.",
    commitToThisWeek: "Weka ahadi ya wiki hii",
    keptCommitments: "Ahadi zilizotimizwa",
    weekOf: (weekOf: string) => `Wiki ya ${weekOf}`,
  },
  commitmentItems: {
    scripture_done: {
      label: "Jifunze aya 5 za Biblia",
      detail: "Kila siku wiki hii",
    },
    prayer_done: {
      label: "Omba kwa dakika 5–15",
      detail: "Kila siku wiki hii",
    },
    witness_done: {
      label: "Shiriki injili",
      detail: "Angalau mara moja wiki hii",
    },
  },
  journeyChooser: {
    backToCommit: "Ahadi",
    heading: "Safari",
    subheading: "Njia ya siku kadhaa iliyopangwa, pamoja na Kristo.",
    continueTitle: "Endelea na Safari Yako",
    continueDescription: "Endelea pale ulipoishia.",
    browseTitle: "Vinjari Safari",
    browseDescription: "Gundua safari nyingine za ukuaji unazoweza kuanza.",
  },
  browseJourneys: {
    backToJourney: "Safari",
    heading: "Vinjari Safari",
    intro:
      "Kila safari ya ukuaji ina njia yake — anza ile inayogusa hali uliyo nayo sasa.",
    durationLabel: (days: number) => `Safari ya siku ${days}`,
    completedReview: "Imekamilika — Pitia tena",
    percentContinue: (pct: number) => `Asilimia ${pct} imekamilika — Endelea`,
    start: "Anza",
    empty: "Bado hakuna safari zinazopatikana — rudi tena hivi karibuni.",
  },
  journeyOverview: {
    durationLabel: (days: number) => `Safari ya ukuaji ya siku ${days}`,
    startJourney: "Anza safari",
  },
  journeyDay: {
    dayOf: (day: number, total: number) => `Siku ya ${day} kati ya ${total}`,
    gatedHeading: "Karibu tena kesho",
    gatedBody:
      "Tumia leo kuomba na kutafakari ulichosoma sasa hivi — hatua inayofuata itafunguka utakaporudi kesho.",
    backToHome: "Rudi Nyumbani",
    continue: "Endelea",
    continueTo: (topic: string) => `Endelea: ${topic}`,
  },
  formationLoop: {
    scripture: "Maandiko",
    message: "Ujumbe",
    explore: "Chunguza",
    reflect: "Tafakari",
    pray: "Omba",
    nextStep: "Hatua Inayofuata",
    engage: "Shiriki",
  },
  connectPage: {
    backToHome: "Nyumbani",
    heading: "Ungana",
    subheading: "Nina mahali hapa.",
    prayerRoomTitle: "Chumba cha Maombi",
    prayerRoomDescription: "Omba, saidia wengine, na uombewe.",
    churchesTitle: "Makanisa",
    churchesDescription: "Tafuta kanisa la karibu na uungane na jumuiya yake.",
    askPdTitle: "Ask PD",
    askPdDescription:
      "Mtumie ujumbe Mchungaji Deniss na timu, au omba kupigiwa simu.",
    companionTitle: "Rafiki wa Leap",
    companionDescription: "Omba msaada, maombi, au hatua yako inayofuata.",
  },
  churches: {
    backToChurches: "Rudi kwenye Makanisa",
    backToConnect: "Ungana",
    notFound: "Kanisa hili halikupatikana.",
    leadPastor: (name: string) => `Mchungaji Kiongozi: ${name}`,
    service: (time: string) => `Ibada: ${time}`,
    members: (n: number) => `Takriban washiriki ${n}`,
    heading: "Makanisa",
    intro: "Tafuta kanisa la karibu na uungane na jumuiya yake.",
    empty: "Bado hakuna makanisa yaliyoorodheshwa — rudi tena hivi karibuni.",
    serviceTimeNotListed: "Muda wa ibada haujaorodheshwa",
  },
  hubCard: {
    comingSoon: "Inakuja hivi karibuni",
  },
};
