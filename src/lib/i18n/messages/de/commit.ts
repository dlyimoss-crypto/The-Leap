import type { CommitMessages } from "../en/commit";

export const commit: CommitMessages = {
  commitPage: {
    backToHome: "Start",
    heading: "Entscheiden",
    subheading: "Ich wähle den Weg Christi.",
    journeyCardTitle: "Reise",
    journeyCardDescription: "Setze deine Reise fort oder entdecke eine neue.",
    thisWeeksCommitment: "Vorsatz dieser Woche",
    weekOfProgress: (weekOf: string, done: number, total: number) =>
      `Woche vom ${weekOf} – ${done} von ${total} eingehalten`,
    markAsKept: "Als eingehalten markieren",
    checkAllToMarkAsKept: (total: number) =>
      `Hake alle ${total} ab, um ihn als eingehalten zu markieren`,
    intro: "Drei Übungen pro Woche – klein genug, um sie wirklich durchzuhalten.",
    commitToThisWeek: "Für diese Woche festlegen",
    keptCommitments: "Eingehaltene Vorsätze",
    weekOf: (weekOf: string) => `Woche vom ${weekOf}`,
  },
  commitmentItems: {
    scripture_done: {
      label: "5 Abschnitte in der Bibel studieren",
      detail: "Jeden Tag diese Woche",
    },
    prayer_done: {
      label: "5–15 Minuten beten",
      detail: "Jeden Tag diese Woche",
    },
    witness_done: {
      label: "Das Evangelium weitersagen",
      detail: "Mindestens einmal diese Woche",
    },
  },
  journeyChooser: {
    backToCommit: "Entscheiden",
    heading: "Reise",
    subheading: "Ein strukturierter Weg mit Christus über mehrere Tage.",
    continueTitle: "Setze deine Reise fort",
    continueDescription: "Mach dort weiter, wo du aufgehört hast.",
    browseTitle: "Reisen entdecken",
    browseDescription: "Entdecke weitere Glaubensreisen, die du beginnen kannst.",
  },
  browseJourneys: {
    backToJourney: "Reise",
    heading: "Reisen entdecken",
    intro:
      "Jede Glaubensreise hat ihren eigenen Weg – beginne mit der, die zu deiner jetzigen Situation passt.",
    durationLabel: (days: number) =>
      days === 1 ? "Reise über 1 Tag" : `Reise über ${days} Tage`,
    completedReview: "Abgeschlossen – Ansehen",
    percentContinue: (pct: number) => `${pct} % abgeschlossen – Weiter`,
    start: "Starten",
    empty: "Noch keine Reisen verfügbar – schau bald wieder vorbei.",
  },
  journeyOverview: {
    durationLabel: (days: number) =>
      days === 1 ? "Glaubensreise über 1 Tag" : `Glaubensreise über ${days} Tage`,
    startJourney: "Reise starten",
  },
  journeyDay: {
    dayOf: (day: number, total: number) => `Tag ${day} von ${total}`,
    gatedHeading: "Bis morgen!",
    gatedBody:
      "Nimm dir heute Zeit, zu beten und über das Gelesene nachzudenken – der nächste Schritt öffnet sich, wenn du morgen wiederkommst.",
    backToHome: "Zurück zum Start",
    continue: "Weiter",
    continueTo: (topic: string) => `Weiter: ${topic}`,
  },
  formationLoop: {
    scripture: "Bibeltext",
    message: "Impuls",
    explore: "Entdecken",
    reflect: "Nachdenken",
    pray: "Beten",
    nextStep: "Nächster Schritt",
    engage: "Wirken",
  },
  connectPage: {
    backToHome: "Start",
    heading: "Verbinden",
    subheading: "Ich gehöre dazu.",
    prayerRoomTitle: "Gebetsraum",
    prayerRoomDescription: "Bete, unterstütze andere und lass für dich beten.",
    churchesTitle: "Gemeinden",
    churchesDescription: "Finde eine Gemeinde vor Ort und werde Teil ihrer Gemeinschaft.",
    askPdTitle: "Ask PD",
    askPdDescription: "Schreib Pastor Deniss und dem Team oder bitte um einen Anruf.",
    companionTitle: "Leap-Begleiter",
    companionDescription: "Bitte um Hilfe, Gebet oder deinen nächsten Schritt.",
  },
  churches: {
    backToChurches: "Zurück zu den Gemeinden",
    backToConnect: "Verbinden",
    notFound: "Dieser Gemeinde-Eintrag wurde nicht gefunden.",
    leadPastor: (name: string) => `Leitender Pastor: ${name}`,
    service: (time: string) => `Gottesdienst: ${time}`,
    members: (n: number) => `ca. ${n} Mitglieder`,
    heading: "Gemeinden",
    intro: "Finde eine Gemeinde vor Ort und werde Teil ihrer Gemeinschaft.",
    empty: "Noch keine Gemeinden eingetragen – schau bald wieder vorbei.",
    serviceTimeNotListed: "Gottesdienstzeit nicht angegeben",
  },
  hubCard: {
    comingSoon: "Bald verfügbar",
  },
};
