import type { BooksMessages } from "../en/books";

export const books: BooksMessages = {
  library: {
    heading: "Bibliothek",
    bookCount: { one: "{count} Buch", other: "{count} Bücher" },
    empty:
      "Noch keine Bücher veröffentlicht – mach den Anfang und teile unten eins.",
    free: "Kostenlos",
    defaultAuthor: "The Leap",
  },
  catalogue: {
    heading: "Bücher & Literatur",
    readerSubheading:
      "Geh tiefer mit Büchern, Lehre und ausgewählten Materialien.",
    authorSubheading:
      "Reiche ein Buch zur Prüfung ein – freigegebene Bücher kommen in die Bibliothek.",
  },
  application: {
    eyebrowPending: "Autorenbewerbung",
    eyebrowDefault: "Werde Autor oder Autorin",
    headingPending: "Deine Bewerbung wird geprüft",
    headingMoreInfo: "Wir brauchen noch etwas mehr von dir",
    headingDefault: "Veröffentliche dein Buch bei The Leap",
    bodyPending: "Wir melden uns, sobald sie geprüft ist.",
    bodyMoreInfo: "Mach mit deiner Bewerbung dort weiter, wo du aufgehört hast.",
    bodyDefault:
      "Teile deine Texte mit unserer Gemeinschaft – kostenlos oder kostenpflichtig, du entscheidest.",
    continueApplication: "Bewerbung fortsetzen",
    applyNow: "Jetzt bewerben",
    rejected: "Deine Autorenbewerbung wurde nicht angenommen.",
    backToLibrary: "Zurück zur Bibliothek",
    underReview: "Deine Autorenbewerbung wird geprüft.",
    formHeading: "Als Autor oder Autorin bewerben",
    moreInfoRequested: "Weitere Informationen angefordert",
    bioLabel: "Ein bisschen über dich",
    reasonLabel: "Warum möchtest du bei The Leap veröffentlichen?",
    websiteLabel: "Website oder Profil-Link (optional)",
    agreement: "Ich stimme den Veröffentlichungsrichtlinien von The Leap zu.",
    resubmit: "Bewerbung erneut einreichen",
    submit: "Bewerbung einreichen",
  },
  submission: {
    editBook: "Buch bearbeiten",
    newBook: "Neues Buch",
    reviewerFeedback: "Rückmeldung zur Prüfung",
    titleLabel: "Titel",
    descriptionLabel: "Beschreibung",
    categoriesLabel: "Kategorien (durch Komma getrennt)",
    categoriesPlaceholder: "Jüngerschaft, Christliches Leben",
    manuscriptLabel: "Manuskript (PDF oder EPUB)",
    currentFile: "Aktuelle Datei: {filename}",
    coverLabel: "Titelbild",
    priceLabel: "Preis in USD (leer lassen für kostenlos)",
    rightsAttestation:
      "Ich bestätige, dass ich die Rechte an diesem Werk besitze oder die Erlaubnis habe, es zu veröffentlichen.",
    saveDraft: "Entwurf speichern",
    submitForReview: "Zur Prüfung einreichen",
    edit: "Bearbeiten",
    statusLabels: {
      draft: "Entwurf",
      pending_review: "In Prüfung",
      changes_requested: "Änderungen angefordert",
      rejected: "Abgelehnt",
      approved: "Freigegeben",
      published: "Veröffentlicht",
      unpublished: "Nicht mehr veröffentlicht",
    },
  },
  detail: {
    readNow: "Jetzt lesen",
    purchasingNotLive: "Kaufen ist noch nicht möglich",
    purchasingNotLiveBody:
      "Wir richten die Zahlung für kostenpflichtige Titel noch ein – schau bald wieder vorbei, um dieses Buch zu kaufen.",
    viewLargerCover: "Größeres Titelbild von {title} anzeigen",
    coverAlt: "Titelbild von {title}",
  },
  reader: {
    back: "Zurück",
    untitled: "Buch",
    loading: "Buch wird geladen…",
    epubError: "Dieses EPUB konnte nicht geladen werden.",
    pdfError: "Dieses PDF konnte nicht geladen werden.",
    fileErrorHint:
      "Die Datei ist möglicherweise beschädigt oder hat ein nicht unterstütztes Format.",
    previousPage: "Vorherige Seite",
    nextPage: "Nächste Seite",
    pageOf: "{page} / {total}",
  },
};
