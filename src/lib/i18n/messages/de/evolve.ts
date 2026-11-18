import type { EvolveMessages } from "../en/evolve";

export const evolve: EvolveMessages = {
  hub: {
    tagline: "Ich wachse.",
    scriptureTitle: "Bibel",
    scriptureDescription: "Gottes Wort lesen, durchsuchen, studieren und speichern.",
    devotionTitle: "Tagesandacht",
    devotionDescription:
      "Halte inne, denk nach und begegne Gott im heutigen Gedanken.",
    booksTitle: "Bücher & Literatur",
    booksDescription:
      "Geh tiefer mit Büchern, Lehre und ausgewählten Materialien.",
  },
  devotion: {
    heading: "Tagesandacht",
    subheading: "Halte inne, denk nach und begegne Gott im heutigen Gedanken.",
    lockedHeading: "Du hast heute schon eine Andacht aus dem Archiv gewählt",
    lockedBody:
      "Du kannst pro Tag eine frühere Andacht lesen – diese ist morgen wieder verfügbar. Die heutige Andacht findest du weiterhin unten.",
    backToToday: "Zurück zur heutigen Andacht",
    reflection: "Zum Nachdenken",
    prayer: "Gebet",
    practice: "Umsetzung",
    empty: "Es wurde noch keine Andacht veröffentlicht – schau bald wieder vorbei.",
    pastDevotions: "Frühere Andachten",
    tomorrow: "Morgen",
  },
  reminder: {
    heading: "Tägliche Erinnerung",
    timeAriaLabel: "Uhrzeit der Erinnerung",
    needsInstall:
      "Um auf dem iPhone eine tägliche Erinnerung zu bekommen, füge The Leap zuerst deinem Home-Bildschirm hinzu: Tippe auf „Teilen“, dann auf „Zum Home-Bildschirm“, und öffne The Leap von dort.",
    unsupported: "Dieser Browser unterstützt keine Benachrichtigungen.",
    denied:
      "Benachrichtigungen für The Leap sind blockiert. Erlaube sie in den Website-Einstellungen deines Browsers, um eine tägliche Erinnerung zu bekommen.",
    offIntro:
      "Bekomme jeden Tag einen sanften Hinweis, wenn du die Andacht noch nicht gelesen hast.",
    turnOn: "Täglich erinnern",
    everyDayAt: "Jeden Tag um",
    turnOff: "Ausschalten",
    failed:
      "Beim Speichern deiner Erinnerung ist etwas schiefgelaufen. Bitte versuche es erneut.",
  },
  reminderPush: {
    title: "Die heutige Andacht ist da",
  },
  scripture: {
    heading: "Bibel",
    subheading: "Gottes Wort lesen, durchsuchen, studieren und speichern.",
    tabs: {
      bible: "Bibel",
      plans: "Pläne",
      favorites: "Favoriten",
    },
    plansTitle: "Bibellesepläne",
    plansDescription: "Begleitete Bibellesepläne sind bald verfügbar.",
    favoritesEmpty: "Speichere eine Bibelstelle im Tab „Bibel“, um sie hier zu sehen.",
    remove: "Entfernen",
  },
  bible: {
    comingSoonSuffix: " · Bald verfügbar",
    searchPlaceholder: "John 3:16 oder Suchbegriffe…",
    search: "Suchen",
    attribution:
      "Bibeltext aus der Berean Standard Bible (BSB), gemeinfrei.",
    oldTestament: "Altes Testament",
    newTestament: "Neues Testament",
    allBooks: "Alle Bücher",
    verseNotInBsb:
      "Dieser Vers ist in der BSB nicht enthalten, da sie den ältesten Handschriften folgt.",
    readChapter: "{reference} lesen",
    noMatches: "Keine Verse mit „{q}“ gefunden.",
    versesContaining: {
      one: "{count} Vers mit „{q}“",
      other: "{count} Verse mit „{q}“",
    },
    showingFirst: "Die ersten {shown} von {total} Versen mit „{q}“",
    notFound: "„{reference}“ wurde in der Bibel nicht gefunden.",
    saved: "Gespeichert",
    save: "Speichern",
  },
};
